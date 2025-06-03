import { NextResponse } from 'next/server';
import { getBabysitters } from '@/lib/googleSheets';

export async function GET() {
  try {
    const babysitters = await getBabysitters();
    return NextResponse.json({ babysitters });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 