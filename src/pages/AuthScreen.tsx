import { FormEvent, useState } from 'react';
import { Icon } from '@/assets/icons';
import { Button, Avatar } from '@/components/common';

interface AuthScreenProps {
  onAuthenticated: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

export function AuthScreen({ onAuthenticated, dark, onToggleDark }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(false);
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (mode === 'register' && values.name.trim().length < 2) {
      nextErrors.name = 'Vui lòng nhập tên hiển thị';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = 'Email chưa đúng định dạng';
    }
    if (values.password.length < 8) {
      nextErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    setErrors(nextErrors);
    setBanner(false);

    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      if (mode === 'login' && values.email !== 'demo@hustalo.vn') {
        setBanner(true);
      } else {
        onAuthenticated();
      }
    }, 700);
  }

  return (
    <main className="auth-shell">
      <Button
        iconOnly
        aria-label={dark ? 'Bật giao diện sáng' : 'Bật giao diện tối'}
        className="absolute right-5 top-5"
        onClick={onToggleDark}
      >
        <Icon name={dark ? 'sun' : 'moon'} />
      </Button>

      <section className="auth-visual">
        <div className="brand brand-light">
          <span className="brand-mark">
            <Icon name="message" />
          </span>
          HustAlo
        </div>
        <div className="max-w-lg">
          <p className="eyebrow text-blue-100">Kết nối nội bộ an toàn</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight xl:text-5xl">
            Trao đổi liền mạch.
            <br />
            Làm việc hiệu quả hơn.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-blue-100">
            Tin nhắn, cuộc gọi và mọi cuộc thảo luận của đội ngũ trong một không gian riêng
            tư.
          </p>
        </div>
        <div className="auth-orbit" aria-hidden="true">
          <Avatar name="Minh Anh" size="lg" />
          <span className="orbit-message">Hẹn gặp cả nhóm lúc 14:00 nhé!</span>
        </div>
        <p className="text-sm text-blue-200">Dành riêng cho đội ngũ HustAlo</p>
      </section>

      <section className="auth-form-wrap">
        <div className="w-full max-w-md">
          <div className="brand mb-10 lg:hidden">
            <span className="brand-mark">
              <Icon name="message" />
            </span>
            HustAlo
          </div>
          <p className="eyebrow">
            {mode === 'login' ? 'Chào mừng trở lại' : 'Bắt đầu cùng HustAlo'}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            {mode === 'login' ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới'}
          </h2>
          <p className="mt-3 text-sm text-muted">
            {mode === 'login'
              ? 'Tiếp tục cuộc trò chuyện với đồng đội.'
              : 'Kết nối với mọi người trong công ty.'}
          </p>

          {banner && (
            <div className="error-banner" role="alert">
              <span className="error-dot">!</span>
              <span>
                <strong>Không thể đăng nhập</strong>
                <br />
                Email hoặc mật khẩu không đúng
              </span>
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={submit} noValidate>
            {mode === 'register' && (
              <label className="field-label">
                Tên hiển thị
                <input
                  className={`field-input ${errors.name ? 'field-error' : ''}`}
                  value={values.name}
                  onChange={(e) => setValues({ ...values, name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Minh Anh"
                />
                {errors.name && <span className="field-message">{errors.name}</span>}
              </label>
            )}
            <label className="field-label">
              Email công ty
              <input
                className={`field-input ${errors.email ? 'field-error' : ''}`}
                type="email"
                value={values.email}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                placeholder="tenban@congty.vn"
              />
              {errors.email && <span className="field-message">{errors.email}</span>}
            </label>
            <label className="field-label">
              Mật khẩu
              <span className="password-wrap">
                <input
                  className={`field-input pr-12 ${errors.password ? 'field-error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={(e) => setValues({ ...values, password: e.target.value })}
                  placeholder="Ít nhất 8 ký tự"
                />
                <Button
                  type="button"
                  iconOnly
                  className="password-button"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} />
                </Button>
              </span>
              {errors.password && <span className="field-message">{errors.password}</span>}
            </label>
            <Button className="primary-button w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner white" />
                  Đang xử lý...
                </>
              ) : mode === 'login' ? (
                'Đăng nhập'
              ) : (
                'Tạo tài khoản'
              )}
            </Button>
          </form>

          {mode === 'login' && (
            <Button
              className="demo-button mt-3 w-full"
              onClick={() => {
                setValues({ name: '', email: 'demo@hustalo.vn', password: 'hustalo123' });
                onAuthenticated();
              }}
            >
              Dùng tài khoản mẫu
            </Button>
          )}
          <p className="mt-7 text-center text-sm text-muted">
            {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
            <Button
              className="text-button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setErrors({});
                setBanner(false);
              }}
            >
              {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
            </Button>
          </p>
        </div>
      </section>
    </main>
  );
}
