import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import NoChildNav from './NoChildNav';
import { AccessToken, NavLink, Permission } from '../../../../types/types';
import WithChildNav from './WithChildNav';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { Task02Icon  } from 'hugeicons-react';


const TransactionNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  const fileLinks: NavLink[] = [
    { path: '/dashboard/loan-release', label: 'Loan Release', resource: 'loan release' },
    {
      path: '',
      label: 'Voucher',
      resource: ['expense voucher', 'journal voucher'],
      children: [
        { path: '/dashboard/expense-voucher', label: 'Expense Voucher', resource: 'expense voucher' },
        { path: '/dashboard/journal-voucher', label: 'Journal Voucher', resource: 'journal voucher' },
      ],
    },
    {
      path: '',
      label: 'Receipt',
      resource: ['acknowledgement', 'release'],
      children: [
        { path: '/dashboard/official-receipt', label: 'Official Receipt', resource: 'acknowledgement' },
        { path: '/dashboard/acknowledgement', label: 'Acknowledgement Receipt', resource: 'release' },
      ],
    },
    { path: '/dashboard/emergency-loan', label: 'Emergency Loan', resource: 'emergency loan' },
    { path: '/dashboard/damayan-fund', label: 'Damayan Fund', resource: 'damayan fund' },
  ];

  return (
    <div>
      <IonButton
        fill="clear"
        className={classNames(
          'min-h-6 text-[0.8rem] capitalize [--padding-start:1rem] [--padding-end:1rem] rounded-md py-1 [--padding-bottom:0] [--padding-top:0]  [--color:black]  [--ripple-color:transparent]',
          isOpen && '!font-semibold',
          fileLinks
            .map(link => (link.children ? link.children.map(child => child.path) : link.path))
            .flat()
            .includes(pathname)
            ? 'bg-orange-600 text-white'
            : 'bg-transparent',
        )}
        id="transactions"
        onClick={() => setIsOpen(true)}
      >
        <Task02Icon size={15} stroke='.8' className=' mr-1 mb-1' />
        Transactions&nbsp;
        <IonIcon icon={chevronDownOutline} className="text-xs" />
      </IonButton>
      <IonPopover onDidDismiss={() => setIsOpen(false)} showBackdrop={false} trigger="transactions" triggerAction="click" className="[--max-width:12rem]">
        <IonContent class="[--padding-top:0.5rem] [--padding-bottom:0.5rem]">
          {fileLinks.map(
            link =>
              (token.role === 'superadmin' || token.permissions.find((e: Permission) => link.resource.includes(e.resource) && e.actions.visible)) &&
              (link.children ? (
                <WithChildNav key={link.label} label={link.label} resource={link.resource} childPaths={link.children} />
              ) : (
                <NoChildNav key={link.label} label={link.label} path={link.path} resource={link.resource} />
              )),
          )}
        </IonContent>
      </IonPopover>
    </div>
  );
};

export default TransactionNav;
