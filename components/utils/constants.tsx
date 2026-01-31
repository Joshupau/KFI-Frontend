export const TABLE_LIMIT = 10;

export const manageAccountResource: string[] = ['admin'];

export const dashboardResource: string[] = ['dashboard'];

export const transactionResource: string[] = ['loan release', 'expense voucher', 'journal voucher', 'acknowledgement', 'release', 'damayan fund', 'emergency loan'];

export const generalLedgerResource: string[] = ['audit trail', 'activity', 'financial statement', 'trial balance', 'beginning balance', 'weekly collection', 'projected collection'];

export const systemResource: string[] = ['group of account', 'chart of account', 'product', 'center', 'bank', 'weekly savings', 'business type', 'business supplier', 'nature', 'system parameters'];

export const diagnosticsResource: string[] = ['unbalance entries', 'login logs', 'action logs'];

export const actions: string[] = ['visible', 'create', 'view', 'updated', 'delete', 'print', 'export'];

// ENDED

export const allFilesResource: string[] = ['bank', 'business type', 'center', 'loans', 'weekly saving table', 'supplier'];

export const arrangedResource: { resource: string; path: string }[] = [
  { resource: 'dashboard', path: '/dashboard/home' },
  { resource: 'admin', path: '/dashboard/admin' },
  { resource: 'clients', path: '/dashboard/client' },
  { resource: 'loan release', path: '/dashboard/loan-release' },
  { resource: 'expense voucher', path: '/dashboard/expense-voucher' },
  { resource: 'journal voucher', path: '/dashboard/journal-voucher' },
  { resource: 'acknowledment', path: '/dashboard/official-receipt' },
  { resource: 'release', path: '/dashboard/acknowledgement' },
  { resource: 'emergency loan', path: '/dashboard/emergency-loan' },
  { resource: 'damayan fund', path: '/dashboard/damayan-fund' },
  { resource: 'audit trail', path: '/dashboard/audit-trail' },
  { resource: 'financial statement', path: '/dashboard/financial-statement' },
  { resource: 'trial balance', path: '/dashboard/trial-balance' },
  { resource: 'group of account', path: '/dashboard/group-of-account' },
  { resource: 'chart of account', path: '/dashboard/chart-of-account' },
  { resource: 'product', path: '/dashboard/product' },
  { resource: 'center', path: '/dashboard/center' },
  { resource: 'bank', path: '/dashboard/bank' },
  { resource: 'weekly savings', path: '/dashboard/weekly-savings' },
  { resource: 'business type', path: '/dashboard/business-type' },
  { resource: 'business supplier', path: '/dashboard/business-supplier' },
  { resource: 'unbalance entries', path: '/dashboard/unbalance-entries' },
  { resource: 'login logs', path: '/dashboard/login-logs' },
  { resource: 'action logs', path: '/dashboard/action-logs' },
];
