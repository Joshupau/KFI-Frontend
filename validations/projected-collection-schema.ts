import z from 'zod';

export const projectcollectiondocument = z.object({
    startDate: z.string().nonempty('Start date is required'),
    dueDateFrom: z.string().nonempty('Due date from is required'),
    dueDateTo: z.string().nonempty('Due date from is required'),
    center: z.string().min(1, 'Center Code is required').max(255, 'Center Code must only consist of 255 characters'),
    centerLabel: z.string().min(1, 'Center Code is required').max(255, 'Center Code must only consist of 255 characters'),
    accountOfficer: z.string().nonempty('Account officer is required'),
    groupBy: z.string().nonempty('Group is required'),
    type: z.string().nonempty('Type is required'),


  
});

export type GeneratePCFormData = z.infer<typeof projectcollectiondocument>;
