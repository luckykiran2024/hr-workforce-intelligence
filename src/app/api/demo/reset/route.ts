import { NextResponse } from 'next/server';
import { resetToBaseline } from '@/lib/dataProvider';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('🔄 Triggering Platform Reset to baseline employees...');
    resetToBaseline();
    return NextResponse.json({
      success: true,
      message: 'Platform successfully reset to initial baseline with all 288 employees.'
    });
  } catch (error: any) {
    console.error('Error during demo reset:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
