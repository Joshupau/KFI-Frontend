import dynamic from 'next/dynamic';

const App = dynamic(() => import('../../components/AppShell'), {
  ssr: false,
});

export async function generateStaticParams() {
  return [
    // ...lists.map(list => ({ all: ['lists', list.id] })),
    { all: ['login'] },
    { all: ['dashboard'] },
    { all: ['dashboard', 'home'] },

    // Manage Accounts
    { all: ['dashboard', 'admin'] },
    { all: ['dashboard', 'client'] },

    // Transactions
    { all: ['dashboard', 'loan-release'] },
    { all: ['dashboard', 'expense-voucher'] },
    { all: ['dashboard', 'journal-voucher'] },
    { all: ['dashboard', 'acknowledgement'] },
    { all: ['dashboard', 'official-receipt'] },
    { all: ['dashboard', 'emergency-loan'] },
    { all: ['dashboard', 'damayan-fund'] },

    //nature
    { all: ['dashboard', 'nature'] },

    // General Ledger
    { all: ['dashboard', 'audit-trail'] },
    { all: ['dashboard', 'activity'] },
    { all: ['dashboard', 'financial-statement'] },
    { all: ['dashboard', 'trial-balance'] },
    { all: ['dashboard', 'beginning-balance'] },
    { all: ['dashboard', 'projected-collection'] },
    { all: ['dashboard', 'portfolio-at-risk'] },

    // System
    { all: ['dashboard', 'group-of-account'] },
    { all: ['dashboard', 'chart-of-account'] },
    { all: ['dashboard', 'product'] },
    { all: ['dashboard', 'center'] },
    { all: ['dashboard', 'bank'] },
    { all: ['dashboard', 'weekly-savings'] },
    { all: ['dashboard', 'business-type'] },
    { all: ['dashboard', 'business-supplier'] },
    { all: ['dashboard', 'systemparameters'] },
    { all: ['dashboard', 'databases'] },

    // Diagnostics
    { all: ['dashboard', 'unbalance-entries'] },
    { all: ['dashboard', 'login-logs'] },
    { all: ['dashboard', 'action-logs'] },
  ];
}

export default function Page() {
  return <App />;
}
