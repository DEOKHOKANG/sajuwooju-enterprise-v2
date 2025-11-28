import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju-calculator';
import { validateSajuInput } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const errors = validateSajuInput(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const result = calculateSaju({
      ...body,
      birthDate: new Date(body.birthDate)
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Calculate saju error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
