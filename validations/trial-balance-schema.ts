import z from 'zod';

export const tbchema = z.object({
  reportCode: z.string().min(1, 'Report code is required'),
  reportName: z.string().min(1, 'Report name is required'),
 
});

export const entries = z.object({
  _id: z.string().optional(),
  line: z.any().optional(),
  acctCode: z.string().min(1, 'Account code is required'),
  acctCodeName: z.string().optional(),
  acctCodeDescription: z.string().optional(),
  remarks: z.string().min(1, 'Remarks is required'),
 
});

export const tbentriesschema = z.object({
  title: z.string().min(1, 'Title is required'),
  subTitle: z.string().min(1, 'Subtitle is required'),
  entries: z.array(entries).min(1, 'Entries is required'),

  reportCode: z.string().optional(),
  reportName: z.string().optional(),
 
});

export type TBFormData = z.infer<typeof tbchema>;
export type TBEntriesFormData = z.infer<typeof tbentriesschema>;
