import { z } from 'zod';

export const trialBalanceReportSchema = z.object({
  dateFrom: z.string().min(1, 'From date is required'),
  dateTo: z.string().min(1, 'To date is required'),
  displayZeroValues: z.boolean().optional().default(false),
  acctgYear: z.string().min(1, 'Accounting year is required'),
  reportCode: z.string().min(1, 'Report code is required'),
  summarizeBeginningAndEndingBalance: z.boolean().optional().default(false),
  includeBeginningAndEndingBalance: z.boolean().optional().default(false),
  message: z.string().optional(),
  type: z.enum(['print', 'export']).optional().default('print'),
});

export type TrialBalanceReportFormData = z.infer<typeof trialBalanceReportSchema>;
