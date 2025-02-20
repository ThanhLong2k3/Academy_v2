import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import type { NextApiRequest, NextApiResponse } from 'next';

import fs from 'node:fs/promises';
import path from 'path';

export async function POST(req: Request) {
  console.log('API route called');
  try {
    const formData = await req.formData();
    console.log('FormData received:', formData);

    const uploadDir = './public/uploads';
    const uploadedPaths = [];

    for (const [key, value] of formData.entries()) {
      console.log(`Processing ${key}:`, value);
      if (value instanceof File) {
        const file = value;
        const filePath = path.join(uploadDir, file.name);

        // Read file and write to directory
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        await fs.writeFile(filePath, buffer);

        const fileUrl = `/uploads/${file.name}`;
        uploadedPaths.push(fileUrl);
        console.log(`File uploaded: ${fileUrl}`);
      }
    }

    if (uploadedPaths.length === 0) {
      console.log('No files uploaded');
      return NextResponse.json({ status: 'fail', error: 'No files uploaded' });
    }

    revalidatePath('/');

    console.log('Upload successful:', uploadedPaths);
    return NextResponse.json({ status: 'success', uploadedPaths });
  } catch (e) {
    console.error('Error in API route:', e);
    return NextResponse.json({ status: 'fail', error: String(e) });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json(
      { error: 'Thiếu đường dẫn file' },
      { status: 400 },
    );
  }

  const fullPath = path.join(process.cwd(), 'public', filePath);

  try {
    const stats = await fs.stat(fullPath);

    if (!stats.isFile()) {
      return NextResponse.json(
        { error: 'File không tồn tại' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      uid: stats.ino.toString(),
      name: path.basename(fullPath),
      size: stats.size,
      url: `/uploads/${path.basename(fullPath)}`,
    });
  } catch (error) {
    return NextResponse.json({ error: 'File không tồn tại' }, { status: 404 });
  }
}
