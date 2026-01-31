import { z } from 'zod';

export const projectedCollectionSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  dueDateFrom: z.string().min(1, 'Due date from is required'),
  dueDateTo: z.string().min(1, 'Due date to is required'),
  centerNo: z.string().optional(),
  centerId: z.string().optional(),
  accountOfficer: z.string().optional(),
  groupBy: z.enum(['ao', 'centerAo']).optional().default('ao'),
  type: z.enum(['print', 'export']).optional().default('print'),
});

export type ProjectedCollectionFormData = z.infer<typeof projectedCollectionSchema>;
