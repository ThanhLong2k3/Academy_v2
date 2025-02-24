'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Thêm logic xác thực tài khoản
    console.log('Đăng nhập với:', { email, password });

    // Điều hướng sau khi đăng nhập thành công
    router.push('/vi/customer');
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: 'auto',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            background: 'blue',
            color: '#fff',
          }}
        >
          Đăng nhập
        </button>
        <p>
          Chưa có tài khoản? <a href="/vi/register">Tạo tài khoản ngay</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
