import z from 'zod';

export const fschema = z.object({
  reportCode: z.string().min(1, 'Report code is required'),
  reportName: z.string().min(1, 'Report name is required'),
  type: z.string().min(1, 'Type is required'),
  primaryYear: z.string().min(1, 'Primary year is required'),
  primaryMonth: z.string().min(1, 'Primary month is required'),
  secondaryYear: z.string().optional(),
  secondaryMonth: z.string().optional(),
});

export const entries = z.object({
  _id: z.string().optional(),
  financialStatement: z.string().optional(),
  line: z.string().optional(),
  acctCode: z.string().min(1, 'Account code is required'),
  acctCodeName: z.string().optional(),
  acctCodeDescription: z.string().optional(),
  remarks: z.string().min(1, 'Remarks is required'),
  amountType: z.string().min(1, 'Amount type is required'),
 
});

export const fsentriesschema = z.object({
  title: z.string().min(1, 'Title is required'),
  subTitle: z.string().min(1, 'Subtitle is required'),
  entries: z.array(entries).min(1, 'Entries is required'),

  reportCode: z.string().optional(),
  reportName: z.string().optional(),
  type: z.string().optional(),
  primaryYear: z.string().optional(),
  primaryMonth: z.string().optional(),
  secondaryYear: z.string().optional(),
  secondaryMonth: z.string().optional(),
 
});


export const financialstatementdocument = z.object({
  type: z.string().nonempty('Select options'),
  title: z.string().nonempty('Select options'),
  month: z
      .string()
      .min(1, 'Account Month is required')
      .max(255, 'Account Month must only consist of 255 characters')
      .refine(value => !isNaN(Number(value)), 'Account Month must be a number')
      .refine(value => !isNaN(Number(value)) && Number(value) >= 1 && Number(value) <= 12, 'Account month must be only 1 to 12'),
    year: z
      .string()
      .min(1, 'Account Year is required')
      .max(255, 'Account Year must only consist of 255 characters')
      .refine(value => !isNaN(Number(value)), 'Account Year must be a number'),
  
});

export type FSFormData = z.infer<typeof fschema>;
export type FSEntriesFormData = z.infer<typeof fsentriesschema>;
export type GenerateFSFormData = z.infer<typeof financialstatementdocument>;
