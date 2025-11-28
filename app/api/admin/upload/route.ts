/**
 * Image Upload API
 * POST /api/admin/upload
 *
 * Features:
 * - 이미지 업로드 (Vercel Blob Storage)
 * - 파일 크기 제한 (5MB)
 * - 허용 파일 타입 제한 (이미지만)
 */

import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';

// 허용된 파일 타입
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

// 최대 파일 크기 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '파일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 파일 타입 검사
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: '허용되지 않는 파일 형식입니다. (JPEG, PNG, GIF, WebP, SVG만 가능)',
        },
        { status: 400 }
      );
    }

    // 파일 크기 검사
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: '파일 크기가 너무 큽니다. (최대 5MB)',
        },
        { status: 400 }
      );
    }

    // 파일명 생성 (timestamp + original name)
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;

    // Vercel Blob에 업로드
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      contentDisposition: blob.contentDisposition,
    });
  } catch (error) {
    console.error('[Upload Error]', error);

    // Vercel Blob 설정이 없는 경우
    if (error instanceof Error && error.message.includes('BLOB_READ_WRITE_TOKEN')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vercel Blob 설정이 필요합니다. BLOB_READ_WRITE_TOKEN 환경변수를 설정해주세요.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: '파일 업로드에 실패했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Delete uploaded file
 * DELETE /api/admin/upload
 */
export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL이 필요합니다.' },
        { status: 400 }
      );
    }

    await del(url);

    return NextResponse.json({
      success: true,
      message: '파일이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('[Delete Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '파일 삭제에 실패했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
