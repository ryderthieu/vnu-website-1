import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import registerImg from "../../../../../assets/images/users/regis.jpg";

interface VolunteerData {
  fullName?: string;
  gender?: string;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  phone?: string;
  dob?: string;
  volunteerData?: VolunteerData;
}

interface FormErrors {
  email?: string;
  password?: string;
  username?: string;
  phone?: string;
  dob?: string;
  'volunteerData.fullName'?: string;
  'volunteerData.gender'?: string;
  [key: string]: string | undefined;
}

const RegisterDetails: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    volunteerData: {
      fullName: '',
      gender: '',
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    if (name.startsWith('volunteerData.')) {
      const key = name.split('.')[1] as keyof VolunteerData;
      setFormData((prev) => ({
        ...prev,
        volunteerData: {
          ...prev.volunteerData,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải có 10 chữ số.';
    }

    const today = new Date();
    const birthDate = new Date(formData.dob || '');
    if (!formData.dob || isNaN(birthDate.getTime())) {
      newErrors.dob = 'Vui lòng chọn ngày sinh hợp lệ.';
    } else if (birthDate > today) {
      newErrors.dob = 'Ngày sinh không thể là ngày trong tương lai.';
    } else {
      const age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (age < 10 || (age === 10 && m < 0)) {
        newErrors.dob = 'Bạn phải đủ 10 tuổi để đăng ký.';
      }
    }

    if (!formData.volunteerData?.fullName || formData.volunteerData.fullName.trim() === '') {
      newErrors['volunteerData.fullName'] = 'Vui lòng nhập họ và tên.';
    }
    if (!formData.volunteerData?.gender) {
      newErrors['volunteerData.gender'] = 'Vui lòng chọn giới tính.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage('');
    if (isSubmitting) return;

    if (!validateForm()) {
      const firstErrorField = document.querySelector('.text-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    const payload = {
      username: formData.username?.trim(),
      email: formData.email?.trim(),
      password: formData.password,
      phone: formData.phone?.trim(),
      dateOfBirth: formData.dob,
      volunteerData: {
        fullName: formData.volunteerData?.fullName?.trim(),
        gender: formData.volunteerData?.gender,
      },
    };

    console.log('Dữ liệu đăng ký chi tiết:', JSON.stringify(payload, null, 2));

    setTimeout(() => {
      setIsSubmitting(false);
      setErrorMessage('Form hợp lệ! (Chưa kết nối API)');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 relative">

      {/* BLUE GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 animate-gradient opacity-60"></div>

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

          /* BLUE INPUT FOCUS */
          .input-focus {
            transition: all 0.3s ease;
          }
          .input-focus:focus {
            transform: scale(1.02);
            box-shadow: 0 0 10px rgba(29, 78, 216, 0.4);
          }

          /* BUTTON ANIMATION */
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
        <div className="w-1/2 hidden md:block bg-cover bg-center" style={{
          backgroundImage: `url(${registerImg})`
        }}></div>

        <div className="w-full md:w-1/2 bg-white p-8 fade-in overflow-y-auto max-h-screen">
          <div className="flex justify-center mb-6">
            <img className="w-70 pb-10 pt-10" src="/src/assets/logos/LogoChu.svg" alt="logo" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center text-black mb-6">
            Đăng ký tài khoản
          </h2>
          <div className="text-center text-gray-600 mb-8">
            <p>Vui lòng cung cấp thông tin cá nhân</p>
          </div>
          <div className="w-3/4 mx-auto h-px bg-gray-300 mb-8"></div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-700">Thông tin cá nhân</h4>

              {/* FULL NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  name="volunteerData.fullName"
                  placeholder="Nhập họ và tên"
                  value={formData.volunteerData?.fullName || ''}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 input-focus"
                />
                {errors['volunteerData.fullName'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['volunteerData.fullName']}</p>
                )}
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 input-focus"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  name="dob"
                  type="date"
                  value={formData.dob || ''}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 input-focus"
                />
                {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
              </div>

              {/* GENDER */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <select
                  name="volunteerData.gender"
                  value={formData.volunteerData?.gender || ''}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 input-focus"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                {errors['volunteerData.gender'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['volunteerData.gender']}</p>
                )}
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-bold transition-all duration-300 button-hover ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[var(--color-primary-light)]"
                }`}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Gửi đăng ký'}
            </button>

            {/* MESSAGE */}
            {errorMessage && (
              <div className={`mt-4 text-center ${errorMessage.includes('hợp lệ') ? 'text-green-500' : 'text-red-500'}`}>
                <p>{errorMessage}</p>
              </div>
            )}

            {/* BACK */}
            <div className="mt-6 text-center">
              <button type="button" className="text-blue-600 font-medium hover:underline">
                Quay lại
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterDetails;
