import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateCompaRatio, DEFAULT_PAY_BANDS } from '@/lib/compensation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employees } = body;

    if (!Array.isArray(employees) || employees.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Expected an array of employee records.' },
        { status: 400 }
      );
    }

    // Determine current employee count to generate sequential IDs if needed
    const currentCount = await prisma.employee.count();
    let nextSeq = currentCount + 1;

    const validLevels = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
    const validTeams = ['A', 'B', 'C'];

    const teamDepartments: Record<string, string> = {
      A: 'Digital Engineering',
      B: 'Operations & Support',
      C: 'Commercial & Revenue'
    };

    const recordsToCreate: any[] = [];

    for (let i = 0; i < employees.length; i++) {
      const row = employees[i];
      if (!row.name || typeof row.name !== 'string' || row.name.trim() === '') {
        continue; // skip empty or invalid name rows
      }

      const teamId = (row.teamId || row.team || 'A').toString().trim().toUpperCase();
      const sanitizedTeam = validTeams.includes(teamId) ? teamId : 'A';

      const levelRaw = (row.careerLevel || row.level || 'L3').toString().trim().toUpperCase();
      const careerLevel = validLevels.includes(levelRaw) ? levelRaw : 'L3';

      const pay = Number(row.annualFixedPay || row.salary || row.fixedPay || row.ctc || 15);
      const annualFixedPay = isNaN(pay) || pay <= 0 ? 15.0 : Number(pay.toFixed(2));

      // Calculate compa-ratio against Centralized Pay Bands
      const compaRatio = calculateCompaRatio(annualFixedPay, careerLevel);

      const ratingNum = Number(row.currentRating || row.rating || 3);
      const currentRating = Math.min(5, Math.max(1, isNaN(ratingNum) ? 3 : Math.round(ratingNum)));

      const potentialNum = Number(row.potential || row.competence || row.pot || 3);
      const potential = Math.min(5, Math.max(1, isNaN(potentialNum) ? 3 : Math.round(potentialNum)));

      const genderRaw = (row.gender || 'Undisclosed').toString().trim();
      let gender = 'Undisclosed';
      if (genderRaw.toLowerCase().startsWith('w') || genderRaw.toLowerCase().startsWith('f')) gender = 'Female';
      else if (genderRaw.toLowerCase().startsWith('m')) gender = 'Male';

      const modeRaw = (row.workMode || row.mode || 'Hybrid').toString().trim();
      let workMode = 'Hybrid';
      if (modeRaw.toLowerCase().includes('site') || modeRaw.toLowerCase().includes('office')) workMode = 'On-site';
      else if (modeRaw.toLowerCase().includes('rem')) workMode = 'Remote';

      const isMgr = Boolean(row.isManager === true || row.isManager === 'true' || row.isManager === 'TRUE' || row.isManager === 1 || row.isManager === '1');
      const span = isMgr ? Math.max(1, Number(row.span || 4)) : 0;
      const orgLayer = isMgr ? (careerLevel === 'L6' || careerLevel === 'L7' || careerLevel === 'L8' ? 2 : 3) : 4;

      const employeeId = row.id && String(row.id).trim() !== ''
        ? String(row.id).trim()
        : `SYN-${String(nextSeq++).padStart(4, '0')}`;

      const department = row.department || teamDepartments[sanitizedTeam] || 'Digital Technologies';
      const jobTitle = row.jobTitle || row.role || row.title || `${careerLevel} Professional`;
      const location = row.location || 'Bengaluru';
      const age = Number(row.age) || (24 + (parseInt(careerLevel.replace('L', '')) * 3));
      const tenure = Number(row.tenure) || 2.5;

      const isHipo = currentRating >= 4 && potential >= 4;
      const topTalent = isHipo || (currentRating >= 4 && potential >= 3);
      const criticalRole = careerLevel === 'L4' || careerLevel === 'L5' || careerLevel === 'L6' || isMgr;
      const highPotential = isHipo;
      const flightRisk = row.flightRisk || (compaRatio < 0.85 ? 'High' : 'Low');

      recordsToCreate.push({
        id: employeeId,
        name: row.name.trim(),
        status: 'ACTIVE',
        dateOfJoining: row.dateOfJoining || '2023-01-15',
        employmentType: 'Full-time',
        location,
        workMode,
        corporateEmail: `${row.name.trim().toLowerCase().replace(/\s+/g, '.')}@synthesia.corp`,
        businessUnitId: 'BU-01',
        teamId: sanitizedTeam,
        department,
        jobTitle,
        jobCodeId: null,
        careerLevel,
        careerTrack: row.careerTrack || (isMgr ? 'Management' : 'IC'),
        reportingManagerId: row.reportingManagerId || null,
        coachId: row.coachId || null,
        gender,
        age,
        tenure,
        annualFixedPay,
        variablePay: Number((annualFixedPay * 0.15).toFixed(2)),
        totalTargetComp: Number((annualFixedPay * 1.15).toFixed(2)),
        compaRatio,
        lastIncrementPct: 0,
        orgLayer,
        isManager: isMgr,
        span,
        topTalent,
        highPotential,
        criticalRole,
        successionCandidate: topTalent && isMgr,
        flightRisk,
        currentRating,
        potential
      });
    }

    if (recordsToCreate.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid employee rows found to import.' },
        { status: 400 }
      );
    }

    // Insert into database using Prisma interactive transaction
    await prisma.$transaction(async (tx) => {
      for (const emp of recordsToCreate) {
        await tx.employee.upsert({
          where: { id: emp.id },
          update: emp,
          create: emp
        });

        // Add initial performance record for appraisal intelligence
        await tx.performanceRecord.create({
          data: {
            employeeId: emp.id,
            cycle: '2025-2026',
            preRating: emp.currentRating,
            finalRating: emp.currentRating,
            potential: emp.potential,
            goalFY: 85 + Math.floor(Math.random() * 15),
            goalQ4: 85 + Math.floor(Math.random() * 15),
            reviewWords: 120,
            reviewLate: false,
            peerInputs: 2,
            appeal: false
          }
        });
      }

      // Record an audit log for the bulk ingestion
      await tx.auditLog.create({
        data: {
          entityType: 'Employee',
          entityId: recordsToCreate[0].id,
          fieldName: 'BULK_IMPORT',
          oldValue: '0',
          newValue: String(recordsToCreate.length),
          changedBy: 'Lead HRBP',
          effectiveDate: new Date().toISOString().split('T')[0]
        }
      });
    });

    const totalHeadcount = await prisma.employee.count({ where: { status: 'ACTIVE' } });

    return NextResponse.json({
      success: true,
      importedCount: recordsToCreate.length,
      totalHeadcount,
      message: `Successfully imported ${recordsToCreate.length} employee records.`
    });
  } catch (error: any) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to bulk import employees' },
      { status: 500 }
    );
  }
}
