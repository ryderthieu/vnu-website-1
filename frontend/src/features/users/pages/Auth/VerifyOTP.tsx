import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bg from "../../../../assets/images/users/forgotpw.jpg";

interface Errors {
  otp?: string;
}

interface Status {
  success: boolean;
  message: string;
}

interface LocationState {
  email?: string;
}

export default function VerifyOtp() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpTimer, setOtpTimer] = useState<number>(60 * 60);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = (location.state as LocationState) || {};

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer, email, navigate]);

  const validateOtp = (): boolean => {
    const otpString = otp.join("");
    if (!otpString || otpString.length !== 6) {
      setErrors({ otp: "Mã OTP phải là 6 chữ số." });
      return false;
    }
    return true;
  };

  const handleOtpChange = (index: number, value: string): void => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrors({});

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleConfirmOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    if (!validateOtp()) return;

    setIsLoading(true);

    // Simulate API call for demo
    setTimeout(() => {
      const otpString = otp.join("");
      // Demo mode: accept "123456" as valid OTP
      if (otpString === "123456") {
        setStatus({
          success: true,
          message: "Xác nhận OTP thành công! Đăng ký hoàn tất. (Demo mode)",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatus({
          success: false,
          message: "Mã OTP không đúng. (Demo mode - sử dụng: 123456)",
        });
      }
      setIsLoading(false);
    }, 1000);

    /* Original API call - uncomment when backend is ready
    try {
      const response = await fetch("http://localhost:3000/api/auth/verify-register-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join("") }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Lỗi server: ${response.status}`);
      }

      setStatus({
        success: true,
        message: "Xác nhận OTP thành công! Đăng ký hoàn tất.",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Lỗi xác nhận OTP:", err);
      setStatus({
        success: false,
        message: err instanceof Error && err.message.includes("không đúng")
          ? "Mã OTP không đúng."
          : err instanceof Error && err.message.includes("hết hạn")
          ? "Mã OTP đã hết hạn."
          : "Có lỗi xảy ra, vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
    */
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setStatus(null);

    // Simulate API call for demo
    setTimeout(() => {
      setStatus({
        success: true,
        message: "Mã OTP mới đã được gửi tới email của bạn! (Demo mode - mã OTP: 123456)",
      });
      setOtpTimer(60 * 60);
      setOtp(["", "", "", "", "", ""]);
      setIsLoading(false);
    }, 1000);

    /* Original API call - uncomment when backend is ready
    try {
      const response = await fetch("http://localhost:3000/api/auth/resend-register-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Lỗi server: ${response.status}`);
      }

      setStatus({
        success: true,
        message: "Mã OTP mới đã được gửi tới email của bạn!",
      });
      setOtpTimer(60 * 60);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      console.error("Lỗi gửi lại OTP:", err);
      setStatus({
        success: false,
        message: "Không thể gửi lại OTP. Vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
    */
  };

  const formatTimer = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface)] via-white to-[var(--color-surface-dim)] animate-gradient opacity-60"></div>
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 20s ease infinite;
          }
          .input-focus {
            transition: all 0.3s ease;
          }
          .input-focus:focus {
            transform: scale(1.02);
            box-shadow: 0 0 10px rgba(29, 78, 216, 0.5);
          }
          .button-hover {
            transition: all 0.3s ease;
          }
          .button-hover:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          .fade-in {
            animation: fadeIn 0.5s ease-in;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div className="w-full max-w-4xl flex rounded-lg shadow-lg overflow-hidden relative z-10">
        {/* Left Half: Volunteer Image */}
        <div className="w-1/2 hidden md:block bg-cover bg-center" style={{ 
          backgroundImage: `url(${bg})`
        }}>
        </div>
        {/* Right Half: Form */}
        <div className="w-full md:w-1/2 bg-white p-8 fade-in">
          <div className="flex justify-center mb-4">
            <img className="w-70 pb-10 pt-10" src="/src/assets/logos/logo_white.png" alt="logo" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[var(--color-text-main)] mb-6">
            Xác nhận OTP
          </h2>
          <div className="text-center text-gray-600 mb-6">
            <p>Nhập mã OTP được gửi đến {email}</p>
            <p className="text-sm mt-2">Thời gian còn lại: {formatTimer(otpTimer)}</p>
          </div>
          <form onSubmit={handleConfirmOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mã OTP <span className="text-red-500">*</span>
              </label>
              <div className="flex justify-between">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    maxLength={1}
                    className="w-12 h-12 text-center border border-[var(--color-surface-dim)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] input-focus"
                  />
                ))}
              </div>
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-bold transition-all duration-300 button-hover ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[var(--color-primary-light)]"
              }`}
            >
              {isLoading ? "Đang xác nhận..." : "Xác nhận OTP"}
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              className="mt-2 text-sm text-[var(--color-primary)] hover:underline w-full text-center button-hover"
            >
              Gửi lại OTP
            </button>
          </form>
          {status && (
            <div className={`mt-4 text-center ${status.success ? "text-green-600" : "text-[var(--color-primary)]"}`}>
              <p>{status.message}</p>
            </div>
          )}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/register/common")}
              className="text-[var(--color-primary)] font-medium hover:underline"
            >
              Quay lại đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}