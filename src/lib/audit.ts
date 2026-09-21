import prisma from './prisma';

export async function logAudit({
  entityType,
  entityId,
  fieldName,
  oldValue,
  newValue,
  changedBy = 'Demo Administrator',
  effectiveDate = new Date().toISOString().split('T')[0],
}: {
  entityType: string;
  entityId: string;
  fieldName: string;
  oldValue?: string | null;
  newValue?: string | null;
  changedBy?: string;
  effectiveDate?: string;
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        entityType,
        entityId,
        fieldName,
        oldValue: oldValue != null ? String(oldValue) : null,
        newValue: newValue != null ? String(newValue) : null,
        changedBy,
        effectiveDate,
      },
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
