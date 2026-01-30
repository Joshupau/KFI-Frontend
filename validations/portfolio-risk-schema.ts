import z from 'zod';

export const portfoliodocument = z.object({
    clientFrom: z.string().optional(),
    clientFromLabel: z.string().optional(),
    clientTo: z.string().optional(),
    clientToLabel: z.string().optional(),
    centerFrom: z.string().optional(),
    centerFromLabel: z.string().optional(),
    centerTo: z.string().optional(),
    centerToLabel: z.string().optional(),
    loanReleaseDateFrom: z.string().optional(),
    loanReleaseDateTo: z.string().optional(),
    paymentDateFrom: z.string().optional(),
    paymentDateTo: z.string().optional(),
    rangeType: z.string().optional(),
    typeOfLoan: z.string().optional(),
    typeOfLoanLabel: z.string().optional(),

    parDateFrom: z.string().optional(),
    parDateTo: z.string().optional(),
    accountOfficer: z.string().optional(),
    lessThanDate: z.string().optional(),
    greaterThanDate: z.string().optional(),
    collectionType: z.string().optional(),
    centerType: z.string().optional(),
    type: z.string().nonempty('Type is required'),
  
});

export type GeneratePortfolioFormData = z.infer<typeof portfoliodocument>;
