export type SubNavLink = {
  label: string;
  path: string;
  resource: string;
};

export type NavLink = {
  label: string;
  path: string;
  resource: string | string[];
  children?: SubNavLink[];
};

export type ChartOfAccount = {
  _id: string;
  code: string;
  description: string;
  classification: string;
  nature: string;
  deptStatus: string;
  groupOfAccount?: GroupAccount;
};

export type Beneficiary = {
  createdAt: string;
  name: string;
  relationship: string;
  owner: string;
  _id: string;
};

export type Child = {
  createdAt: string;
  name: string;
  owner: string;
  _id: string;
};

export type Image = {
    path: string,
    originalname: string,
    mimetype: string,
    filename: string,
    size: number
}

export interface ClientMasterFile {
  acctNumber: string;
  acctOfficer: string;
  address: string;
  age: string;
  birthdate: string;
  birthplace: string;
  business: { _id: string; type: string };
  center: { _id: string; centerNo: string; description: string };
  city: string;
  civilStatus: string;
  createdAt: string;
  dateRelease: string;
  dateResigned: string;
  groupNumber: GroupAccount;
  memberStatus: string;
  mobileNo: string;
  name: string;
  newStatus: string;
  parent: string;
  position: string;
  reason: string;
  sex: string;
  spouse: string;
  telNo: string;
  zipCode: string;
  _id: string;
  id: string
  beneficiaries: Beneficiary[];
  children: Child[];
  image: Image
}

export type LoanCode = {
  _id?: string;
  loan?: string;
  module: string;
  loanType: string;
  acctCode: ChartOfAccount;
  sortOrder: string;
  createdAt?: string;
};

export type Loan = {
  _id: string;
  id: string;
  code: string;
  description: string;
  loanCodes: LoanCode[];
  createdAt?: string;
};

export type Supplier = {
  _id: string;
  id: string;
  code: string;
  description: string;
  createdAt: string;
};

export type Entry = {
  _id: string;
  acctCode: { _id: string; code: string; description: string };
  center: { _id: string; centerNo: string; description: string };
  client: { _id: string; name: string };
  particular: string;
  checkNo: string;
  credit: number | null;
  debit: number | null;
  cycle: number | null;
  interest: number | null;
  product: { _id: string; code: string };
  transaction: string;
  createdAt: string;
  line: number,

  _synced?: boolean,
  action?: string,
  deletedAt?: string
};

export type EmergencyLoanEntry = {
  _id: string;
  emergencyLoan: string;
  client: { _id: string; name: string; center: { _id: string; centerNo: string } };
  particular: string;
  acctCode: { _id: string; code: string; description: string };
  credit: number;
  debit: number;
  createdAt: string;
  line: number,
  _synced?: boolean,
  action?: string,
  deletedAt?: string
  
};

export type DamayanFundEntry = {
  _id: string;
  damayanFund: string;
  client: { _id: string; name: string; center: { _id: string; centerNo: string } };
  particular: string;
  acctCode: { _id: string; code: string; description: string };
  credit: number;
  debit: number;
  createdAt: string;

   line: number,
  _synced?: boolean,
  action?: string,
  deletedAt?: string
};

export type AcknowledgementEntry = {
  _id: string;
  acknowledgement: string;
  particular: string;
  acctCode: { _id: string; code: string; description: string };
  loanReleaseEntryId: {
    _id: string;
    transaction: { _id: string; code: string; noOfWeeks: number; dueDate: string };
    client: { _id: string; name: string };
  };
  credit: number | null;
  debit: number | null;
  createdAt: string;
  cvNo: string,
   line: number,
  _synced?: boolean,
  action?: string,
  deletedAt?: string

  
};

export type ReleaseEntry = {
  _id: string;
  release: string;
  particular: string;
  acctCode: { _id: string; code: string; description: string };
  loanReleaseEntryId: {
    _id: string;
    transaction: { _id: string; code: string; noOfWeeks: number; dueDate: string };
    client: { _id: string; name: string };
  };
  credit: number | null;
  debit: number | null;
  createdAt: string;
  cvNo: string,
  _synced?: boolean,
  action?: string,
  deletedAt?: string,
  line: number

};

export type ExpenseVoucherEntry = {
  _id: string;
  id?: string;
  expenseVoucher: string;
  client: { _id: string; name: string; center: { _id: string; centerNo: string } };
  particular: string;
  acctCode: { _id: string; code: string; description: string };
  credit: number | null;
  debit: number | null;
  cvForRecompute: string;
  createdAt: string;
  line?: any
  deletedAt?: string
  action?: string,
  _synced?: boolean
};

export type JournalVoucherEntry = {
  _id: string;
  journalVoucher: string;
  client: { _id: string; name: string; center: { _id: string; centerNo: string } };
  particular: string;
  acctCode: { _id: string; code: string; description: string };
  credit: number | null;
  debit: number | null;
  cvForRecompute: string;
  createdAt: string;
  line?: any
  deletedAt?: string
  action?: string,
  _synced?: boolean
};

export type ExpenseVoucher = {
  _id: string;
  id: string;
  acctMonth: number;
  acctYear: number;
  amount: number;
  bankCode: { _id: string; code: string; description: string };
  // supplier: { _id: string; code: string; description: string };
  supplier: string ;
  checkDate: string;
  checkNo: string;
  code: string;
  cycle: number;
  date: string;
  encodedBy: { username: string };
  entries: any[];
  refNo: string;
  remarks: string;
  createdAt: string;
};

export type Release = {
  _id: string;
  id: string;
  center: { _id: string; centerNo: string; description: string };
  acctMonth: number;
  acctYear: number;
  acctOfficer: string;
  amount: number;
  cashCollectionAmount?: number;
  bankCode: { _id: string; code: string; description: string };
  type: string;
  checkDate: string;
  checkNo: string;
  code: string;
  date: string;
  encodedBy: { username: string };
  entries: any[];
  refNo: string;
  remarks: string;
  createdAt: string;
  deletedAt?: string
  action?: string,
  _synced?: boolean
};

export type Acknowledgement = {
  _id: string;
  id: string;
  center: { _id: string; centerNo: string; description: string };
  acctMonth: number;
  acctYear: number;
  acctOfficer: string;
  amount: number;
  cashCollectionAmount?: number;
  bankCode: { _id: string; code: string; description: string };
  type: string;
  checkDate: string;
  checkNo: string;
  code: string;
  date: string;
  encodedBy: { username: string };
  entries: any[];
  refNo: string;
  remarks: string;
  createdAt: string;
   deletedAt?: string
  action?: string,
  _synced?: boolean
};

export type JournalVoucher = {
  _id: string;
  id: string;
  acctMonth: number;
  acctYear: number;
  amount: number;
  bankCode: { _id: string; code: string; description: string };
  nature: string;
  checkDate: string;
  checkNo: string;
  code: string;
  cycle: number;
  date: string;
  encodedBy: { username: string };
  entries: any[];
  refNo: string;
  remarks: string;
  createdAt: string;
  deletedAt?: string
  action?: string,
  _synced?: boolean
};

export type EmergencyLoan = {
  _id: string;
  id: string;
  code: string;
  user: string;
  // supplier: { _id: string; code: string; description: string };
  center: { _id: string; centerNo: string; description: string };
  refNo: string;
  remarks: string;
  date: string;
  acctMonth: number;
  acctYear: number;
  checkNo: string;
  checkDate: string;
  bankCode: { _id: string; code: string; description: string };
  amount: number;
  encodedBy: { username: string };
  entries: any[];
   deletedAt?: string
  action?: string,
  _synced?: boolean
};

export type DamayanFund = {
  _id: string;
  id: string;
  code: string;
  name: string;
  // supplier: { _id: string; code: string; description: string };
  center: { _id: string; centerNo: string; description: string };
  refNo: string;
  remarks: string;
  date: string;
  acctMonth: number;
  acctYear: number;
  checkNo: string;
  checkDate: string;
  bankCode: { _id: string; code: string; description: string };
  amount: number;
  encodedBy: { username: string };
  entries: any[];

};

export type Transaction = {
  _id?: string;
  id?: string;
  acctMonth: number;
  acctYear: number;
  amount: number;
  bank: { _id: string; code: string; description: string };
  center: { _id: string; centerNo: string; description: string };
  checkDate: string;
  checkNo: string;
  code: string;
  cycle: number;
  date: string;
  encodedBy: { username: string };
  entries: any[];
  interest: number;
  loan: { _id: string; code: string };
  noOfWeeks: number;
  refNo: string;
  remarks: string;
  createdAt: string;
  type: string;
  isEduc: boolean;

  //offline
};

export type Bank = {
  _id: string;
  id: string;
  code: string;
  description: string;
  createdAt: string;
};

export type Action = {
  create: boolean;
  update: boolean;
  delete: boolean;
  view: boolean;
  print: boolean;
  export: boolean;
  visible: boolean;
};

export type Activity = {
  _id: string;
  author: string;
  username: string;
  activity: string;
  resource: string;
  dataId: string;
  createdAt: string;
};

export type ActionType = 'create' | 'visible' | 'view' | 'update' | 'delete' | 'print' | 'export';

export type Permission = {
  resource: string;
  actions: Action;
  _id: string;
};

export type AccessToken = {
  _id: string;
  username: string;
  role: string;
  permissions: Permission[];
  exp: number;
  iat: number;
};

export type User = {
  _id: string;
  name: string;
  username: string;
  status: string;
  createdAt: string;
  permissions: Permission[];
};

export type GroupAccount = {
  _id: string;
  id: string;
  code: string;
  createdAt: string;
};

export type BusinessType = {
  _id: string;
  id: string;
  type: string;
  createdAt: string;
};

export type WeeklySavings = {
  _id: string;
  id: string;
  rangeAmountFrom: string;
  rangeAmountTo: string;
  weeklySavingsFund: string;
  createdAt: string;
};

export type Nature = {
  _id: string;
  id: string;
  nature: string;
  createdAt: string;
  description: string

};

export type Status = {
  _id: string;
  code: string;
  description: string;
  createdAt: string;
};

export type Center = {
  _id: string;
  id: string;
  centerNo: string;
  description: string;
  location: string;
  centerChief: string;
  treasurer: string;
  acctOfficer: string;
  createdAt: string;
};

export type TFormError = {
  msgs: string[];
  path: string;
};

export type TErrorData = {
  formErrors?: TFormError[];
  message: string;
};

export type TError = {
  error: TErrorData;
  message: string;
};

export type TTableFilter = {
  limit: number;
  page: number;
  search?: string;
  sort?: string;
};


export interface Accounts {
  _id: string;
  code: string;
  description: string;
}

export interface AccountsResponse {
  success: boolean;
  chartOfAccounts: ChartOfAccount[];
}


export type FinancialStatements = {
  primary: {
     year: number,
     month: number},
  secondary: {
     year: number,
     month: number},
  _id: string,
  reportCode: string,
  reportName: string,
  type: string,
  title: string,
  subTitle: string,
  createdAt: string,
  updatedAt: string,
};

export type BegBalance = {
  year: number,
  memo: string,
  encodedBy: string,
  debit: number,
  credit: number,
  entryCount: number,
  _id: string,
  createdAt: string
}

