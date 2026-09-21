import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    console.log('🔄 Triggering Database Reset to baseline employees...');
    await execAsync('npx tsx prisma/seed.ts', { cwd: process.cwd() });
    return NextResponse.json({
      success: true,
      message: 'Platform successfully reset to initial baseline.'
    });
  } catch (error: any) {
    console.error('Error during demo reset:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
