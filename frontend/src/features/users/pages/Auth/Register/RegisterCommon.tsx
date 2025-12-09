import React, { useState, type FormEvent, type ChangeEvent, type FocusEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import registerImg from "../../../../../assets/images/users/regis.jpg";

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  [key: string]: string | undefined;
}

const RegisterCommon: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    // Tạm thời bỏ check duplicate vì chưa có API
    // const { name, value } = e.target;
    // checkDuplicate(name, value.trim());
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.username) newErrors.username = 'Vui lòng nhập username.';

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formData.email.trim())) newErrors.email = 'Email không hợp lệ.';

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(formData.password))
      newErrors.password =
        'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.';

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    console.log('Đăng ký với mật khẩu:', formData.password);

    const dataToSubmit = {
      ...formData,
      email: formData.email.trim(),
      username: formData.username.trim(),
    };

    console.log('Dữ liệu đăng ký:', dataToSubmit);

    if (validateForm()) {
      console.log('Form hợp lệ, sẵn sàng gửi:', dataToSubmit);
      navigate('/register/details');
    }
  };

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
        box-shadow: 0 0 10px rgba(53, 180, 246, 0.5); /* glow xanh nhạt */
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

      <div className="w-full max-w-6xl flex rounded-lg shadow-lg overflow-hidden relative z-10">
        <div className="w-1/2 hidden md:block bg-cover bg-center"
          style={{ backgroundImage: `url(${registerImg})` }}
        />

        <div className="w-full md:w-1/2 bg-[var(--color-surface)] p-8 fade-in">
          <div className="flex justify-center mb-6">
            <img className="w-70 pb-10 pt-10" src="/src/assets/logos/LogoChu.svg" alt="logo" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center text-[var(--color-text-main)] mb-6">
            Đăng ký tài khoản - Thông tin chung
          </h2>

          <div className="text-center text-[var(--color-text-main)] opacity-70 mb-8">
            <p>Tham gia để khám phá thêm nhiều tính năng nào!</p>
          </div>

          <div className="w-3/4 mx-auto h-px bg-[var(--color-surface-dim)] mb-8"></div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* USERNAME */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)]">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                placeholder="Nhập username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1 w-full px-4 py-2 border border-[var(--color-surface-dim)] rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] input-focus"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)]">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1 w-full px-4 py-2 border border-[var(--color-surface-dim)] rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] input-focus"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)]">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-[var(--color-surface-dim)] rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] input-focus"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              <p className="text-xs text-[var(--color-text-main)] opacity-60 mt-1">
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
              </p>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-bold
                      hover:bg-[var(--color-primary-light)] transition-all duration-300 button-hover"
            >
              Tiếp tục
            </button>

            {/* LINK TO LOGIN */}
            <div className="mt-6 text-center">
              <p className="text-sm text-[var(--color-text-main)] opacity-70">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[var(--color-info)] font-medium hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterCommon;