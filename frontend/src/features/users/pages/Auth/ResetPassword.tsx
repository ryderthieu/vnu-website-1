import React, { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import bg from "../../../../assets/images/users/forgotpw.jpg";
import bl from "../../../../assets/images/users/bgRegist.jpg";
interface Errors {
  password?: string;
  confirmPassword?: string;
}

interface Status {
  success: boolean;
  message: string;
}

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()

  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status | null>(null)
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
  const [tokenMessage, setTokenMessage] = useState<string>("")

  useEffect(() => {
    const validateToken = async () => {
      // Simulate token validation for demo
      setTimeout(() => {
        // Demo mode: accept any token as valid
        setIsTokenValid(true)
        setTokenMessage("Token hợp lệ")
      }, 1000)

      /* Original API call - uncomment when backend is ready
      try {
        const response = await fetch(`http://localhost:3000/api/auth/validate-reset-token/${token}`)
        const data = await response.json()

        setIsTokenValid(data.valid)
        setTokenMessage(data.message)

        if (!data.valid) {
          console.error("Token không hợp lệ:", data.message)
        }
      } catch (error) {
        console.error("Lỗi kiểm tra token:", error)
        setIsTokenValid(false)
        setTokenMessage("Không thể xác thực token. Vui lòng thử lại hoặc yêu cầu token mới.")
      }
      */
    }

    validateToken()
  }, [token])

  const validateForm = (): boolean => {
    const newErrors: Errors = {}

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu mới"
    } else if (password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự"
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 1 chữ hoa"
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 1 chữ thường"
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 1 số"
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setStatus(null)

    // Simulate API call for demo
    setTimeout(() => {
      setStatus({
        success: true,
        message: "Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới. (Demo mode)",
      })

      setPassword("")
      setConfirmPassword("")

      setTimeout(() => {
        navigate("/login")
      }, 3000)

      setIsLoading(false)
    }, 1500)

    /* Original API call - uncomment when backend is ready
    try {
      const response = await fetch(`http://localhost:3000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi đặt lại mật khẩu")
      }

      setStatus({
        success: true,
        message: "Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới.",
      })

      setPassword("")
      setConfirmPassword("")

      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err) {
      console.error("Lỗi đặt lại mật khẩu:", err)

      setStatus({
        success: false,
        message: err instanceof Error ? err.message : "Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.",
      })
    } finally {
      setIsLoading(false)
    }
    */
  }

  if (isTokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center py-10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-primary)] animate-gradient opacity-60"></div>
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
          <div className="w-1/2 hidden md:block bg-cover bg-center" style={{
            backgroundImage: `url(${bl})`
          }}>
          </div>
          <div className="w-full md:w-1/2 bg-white p-8 fade-in">
            <div className="flex justify-center mb-4">
              <img className="w-24 transform transition-transform duration-300 hover:scale-110" src="/src/assets/logos/LogoChu.svg" alt="logo" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-black mb-6">Đặt lại mật khẩu</h2>
            <div className="bg-[var(--color-surface)] border border-[var(--color-primary)] text-[var(--color-primary)] px-4 py-3 rounded mb-4">
              <p>{tokenMessage || "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."}</p>
            </div>
            <div className="text-center mt-6">
              <p className="mb-4">Vui lòng yêu cầu liên kết đặt lại mật khẩu mới</p>
              <Link
                to="/forgot-password"
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-bold button-hover transition-all duration-300"
              >
                Quên mật khẩu
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isTokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center py-10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-primary)] animate-gradient opacity-60"></div>
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
          <div className="w-1/2 hidden md:block bg-cover bg-center" style={{
            backgroundImage: `url(${bl})`
          }}>
          </div>
          <div className="w-full md:w-1/2 bg-white p-8 fade-in">
            <div className="flex justify-center mb-4">
              <img className="w-24 transform transition-transform duration-300 hover:scale-110" src="/src/assets/logos/LogoChu.svg" alt="logo" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-black mb-6">Đặt lại mật khẩu</h2>
            <div className="flex justify-center">
              <p>Đang xác thực liên kết đặt lại mật khẩu...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-primary)] animate-gradient opacity-60"></div>
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
        <div className="w-1/2 hidden md:block bg-cover bg-center" style={{
          backgroundImage: `url(${bg})`
        }}>
        </div>
        <div className="w-full md:w-1/2 bg-white p-8 fade-in">
          <div className="flex justify-center mb-4">
            <img className="w-24 transform transition-transform duration-300 hover:scale-110" src="/src/assets/logos/LogoChu.svg" alt="logo" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-black mb-6">Đặt lại mật khẩu</h2>
          <div className="text-center text-gray-600 mb-6">
            <p>Nhập mật khẩu mới cho tài khoản của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] input-focus"
                  placeholder="Nhập mật khẩu mới"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-3 flex items-center text-sm leading-5 hover:text-[var(--color-primary)] transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                  }}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] input-focus"
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-3 flex items-center text-sm leading-5 hover:text-[var(--color-primary)] transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-bold transition-all duration-300 button-hover ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[var(--color-primary-light)]"
                }`}
            >
              {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>

          {status && (
            <div className={`mt-4 text-center ${status.success ? "text-green-600" : "text-red-500"}`}>
              <p>{status.message}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-[var(--color-primary)] font-medium hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}