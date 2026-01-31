import { z } from 'zod';

export const weeklyCollectionSchema = z.object({
  centerNo: z.string().optional(),
  centerId: z.string().optional(),
  loanReleaseDate: z.string().min(1, 'Loan release date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  weekNoFrom: z.string().optional(),
  weekNoTo: z.string().optional(),
  multi: z.boolean().optional().default(false),
  basedOn: z.enum(['actual', 'projection']).optional().default('actual'),
  newFormat: z.boolean().optional().default(true),
  cbuOption: z.enum(['none', 'both', 'gross', 'net']).optional().default('gross'),
  includeResigned: z.boolean().optional().default(false),
  excludeDamayan: z.boolean().optional().default(false),
  balanceBasis: z.enum(['selectedWeek', 'current']).optional().default('selectedWeek'),
  type: z.enum(['print', 'export']).optional().default('print'),
}).refine((data) => {
  // centerNo is required when multi is false
  if (!data.multi && !data.centerNo) {
    return false;
  }
  return true;
}, {
  message: 'Center is required when not in multi-center mode',
  path: ['centerNo'],
});

export type WeeklyCollectionFormData = z.infer<typeof weeklyCollectionSchema>;
