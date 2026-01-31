import { z } from 'zod';

export const portfolioAtRiskSchema = z.object({
  // Customer Range
  customerNameFrom: z.string().optional(),
  customerIdFrom: z.string().optional(),
  customerNameTo: z.string().optional(),
  customerIdTo: z.string().optional(),
  
  // Center Range
  centerNoFrom: z.string().optional(),
  centerIdFrom: z.string().optional(),
  centerNoTo: z.string().optional(),
  centerIdTo: z.string().optional(),
  
  // Loan Release Date
  loanReleaseDateFrom: z.string().optional(),
  loanReleaseDateTo: z.string().optional(),
  
  // Date of Payment
  dateOfPaymentFrom: z.string().optional(),
  dateOfPaymentTo: z.string().optional(),
  
  // Center or All radio
  centerOption: z.enum(['center', 'all']).optional().default('center'),
  
  // Type of Loan
  typeOfLoan: z.string().optional(),
  loanTypeId: z.string().optional(),
  
  // PAR Date Range
  parDateFrom: z.string().optional(),
  parDateTo: z.string().optional(),
  
  // Account Officer
  accountOfficer: z.string().optional(),
  accountOfficerId: z.string().optional(),
  
  // Less Than As Of Date
  lessThanAsOfDate: z.string().optional(),
  
  // Greater Than As of Date
  greaterThanAsOfDate: z.string().optional(),
  
  // Days (number field after date fields)
  lessThanDays: z.string().optional(),
  greaterThanDays: z.string().optional(),
  
  // Weekly Collection
  weeklyCollection: z.boolean().optional().default(false),
  withCBU: z.boolean().optional().default(false),
  
  // By Center or By Center w/ Members
  reportType: z.enum(['byCenter', 'byCenterWithMembers']).optional().default('byCenter'),
  
  // Print or Export
  type: z.enum(['print', 'export']).optional().default('print'),
});

export type PortfolioAtRiskFormData = z.infer<typeof portfolioAtRiskSchema>;
