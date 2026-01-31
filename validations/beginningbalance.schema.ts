import z, { string } from 'zod';

export const entries = z.object({
  _id: z.string().optional(),
  line: z.string().optional(),
  acctCodeId: z.string().min(1, 'Account code is required'),
   acctCodeName: z.string().optional(),
    acctCodeDescription: z.string().optional(),
  debit: z
      .string()
      .refine(value => value !== undefined && value !== null && value !== '', 'Debit is required')
      .refine(value => !isNaN(Number(value.replace(/,/g, ''))), 'Debit must be a number'),
credit: z
    .string()
    .refine(value => value !== undefined && value !== null && value !== '', 'Credit is required')
    .refine(value => !isNaN(Number(value.replace(/,/g, ''))), 'Credit must be a number'),
 
});

export const begbalancechema = z.object({
   year: z
        .string()
        .min(1, 'Account Year is required')
        .max(255, 'Account Year must only consist of 255 characters')
        .refine(value => !isNaN(Number(value)), 'Account Year must be a number'),
  memo: z.string().min(1, 'Memo is required'),
   entries: z.array(entries).min(1, 'Entries is required'),
   deletedIds: z.array(z.string()).optional()
 
});


export const begbalancedocument = z.object({
  year: z.any(),
  type: z.string().nonempty('Select options')
  
});



export type BegBalanceFormData = z.infer<typeof begbalancechema>;
export type BegBalanceDocumemtFormData = z.infer<typeof begbalancedocument>;
