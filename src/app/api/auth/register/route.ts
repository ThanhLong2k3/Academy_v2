import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { executeQuery } from '@/libs/db';

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 },
      );
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUsers = await executeQuery<any[]>(
      'SELECT * FROM users WHERE email = ?',
      [email],
    );
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 409 },
      );
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Thêm user mới vào database
    const result = await executeQuery<{ insertId: number }>(
      "INSERT INTO users (email, password, fullName, role) VALUES (?, ?, ?, 'user')",
      [email, hashedPassword, fullName],
    );

    return NextResponse.json(
      { message: 'Đăng ký thành công', userId: result.insertId },
      { status: 201 },
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Không thể đăng ký' }, { status: 500 });
  }
}
