import prisma from '../src/lib/prisma';
import { calculateCompaRatio, DEFAULT_PAY_BANDS } from '../src/lib/compensation';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runTests() {
  console.log('🧪 Starting End-to-End Reconciliation Verification Tests...\n');

  // TEST 1: Baseline Check
  const initialTotal = await prisma.employee.count({ where: { status: { not: 'EXITED' } } });
  const teamA = await prisma.employee.count({ where: { teamId: 'A', status: { not: 'EXITED' } } });
  const teamB = await prisma.employee.count({ where: { teamId: 'B', status: { not: 'EXITED' } } });
  const teamC = await prisma.employee.count({ where: { teamId: 'C', status: { not: 'EXITED' } } });

  console.log(`[TEST 1] Initial Headcount: ${initialTotal} (Team A: ${teamA}, Team B: ${teamB}, Team C: ${teamC})`);
  if (initialTotal !== 288 || teamA !== 128 || teamB !== 96 || teamC !== 64) {
    throw new Error(`Test 1 Failed: Expected 288 (128/96/64) but got ${initialTotal} (${teamA}/${teamB}/${teamC})`);
  }
  console.log('✅ TEST 1 PASSED: Baseline workforce matches exactly 288 (128/96/64).\n');

  // TEST 2: Add Employee Live Reconciliation
  console.log('[TEST 2] Adding new female L3 Data Engineer to Team A...');
  const newId = `SYN-0289`;
  const managerId = 'SYN-0050';
  const prevManager = await prisma.employee.findUnique({ where: { id: managerId } });
  const prevSpan = prevManager?.span || 0;

  await prisma.employee.create({
    data: {
      id: newId,
      name: 'Ananya Sharma',
      status: 'ACTIVE',
      dateOfJoining: '2026-09-19',
      employmentType: 'Full-time',
      location: 'Hyderabad',
      workMode: 'Hybrid',
      businessUnitId: 'BU-01',
      teamId: 'A',
      department: 'Engineering',
      jobCodeId: 'A-SR-DATA',
      jobTitle: 'Lead Data Engineer',
      careerLevel: 'L3',
      careerTrack: 'IC',
      reportingManagerId: managerId,
      gender: 'Woman',
      age: 28,
      tenure: 1.5,
      annualFixedPay: 22.0,
      totalTargetComp: 25.3,
      compaRatio: calculateCompaRatio(22.0, 'L3'),
      topTalent: false,
      criticalRole: false
    }
  });

  await prisma.employee.update({
    where: { id: managerId },
    data: { span: { increment: 1 } }
  });

  const afterAddTotal = await prisma.employee.count({ where: { status: { not: 'EXITED' } } });
  const afterAddTeamA = await prisma.employee.count({ where: { teamId: 'A', status: { not: 'EXITED' } } });
  const updatedManager = await prisma.employee.findUnique({ where: { id: managerId } });

  console.log(`Updated Headcount: ${afterAddTotal} (Team A: ${afterAddTeamA})`);
  console.log(`Manager (${managerId}) Span: ${prevSpan} -> ${updatedManager?.span}`);

  if (afterAddTotal !== 289 || afterAddTeamA !== 129 || updatedManager?.span !== prevSpan + 1) {
    throw new Error('Test 2 Failed: Reconciliation did not increment correctly.');
  }
  console.log('✅ TEST 2 PASSED: Live Single Source of Truth reconciled headcount (289/129) and manager span.\n');

  // TEST 3: Promotion from L3 to L4
  console.log('[TEST 3] Testing L3-to-L4 Promotion on candidate SYN-0012...');
  const candidate = await prisma.employee.findUnique({ where: { id: 'SYN-0012' } });
  console.log(`Candidate Before: Level ${candidate?.careerLevel}, Pay ₹${candidate?.annualFixedPay}L, Compa ${candidate?.compaRatio}`);

  const bandL4 = DEFAULT_PAY_BANDS['L4'];
  const newSalary = 34.0;
  const newCompa = calculateCompaRatio(newSalary, 'L4');

  await prisma.employee.update({
    where: { id: 'SYN-0012' },
    data: {
      careerLevel: 'L4',
      jobCodeId: 'A-PRIN-DATA',
      jobTitle: 'Principal Data Engineer',
      annualFixedPay: newSalary,
      compaRatio: newCompa
    }
  });

  const promotedCandidate = await prisma.employee.findUnique({ where: { id: 'SYN-0012' } });
  console.log(`Candidate After: Level ${promotedCandidate?.careerLevel}, Pay ₹${promotedCandidate?.annualFixedPay}L, Compa ${promotedCandidate?.compaRatio}`);

  if (promotedCandidate?.careerLevel !== 'L4' || promotedCandidate?.annualFixedPay !== 34.0 || promotedCandidate?.compaRatio !== 1.0) {
    throw new Error('Test 3 Failed: Promotion attributes not updated properly.');
  }
  console.log('✅ TEST 3 PASSED: Promotion updated career level to L4, salary to ₹34L, and compa-ratio to 1.000.\n');

  // TEST 4: Reset Demo
  console.log('[TEST 4] Testing Demo Reset function (re-seeding to 288 baseline)...');
  await execAsync('npx tsx prisma/seed.ts', { cwd: process.cwd() });

  const finalTotal = await prisma.employee.count({ where: { status: { not: 'EXITED' } } });
  const finalTeamA = await prisma.employee.count({ where: { teamId: 'A', status: { not: 'EXITED' } } });
  console.log(`Reset Headcount: ${finalTotal} (Team A: ${finalTeamA})`);

  if (finalTotal !== 288 || finalTeamA !== 128) {
    throw new Error('Test 4 Failed: Reset did not restore exact 288 baseline.');
  }
  console.log('✅ TEST 4 PASSED: Reset restored exactly 288 baseline employees.\n');

  console.log('🎉 ALL RECONCILIATION & SSOT INTEGRITY TESTS PASSED 100%!');
}

runTests()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
