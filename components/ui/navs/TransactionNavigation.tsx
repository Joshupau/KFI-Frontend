import { IonAccordion, IonAccordionGroup, IonIcon, IonItem, IonLabel, IonList, IonMenuToggle } from '@ionic/react';
import { fileTrayFullOutline } from 'ionicons/icons';
import React from 'react';
import { AccessToken, NavLink, Permission } from '../../../types/types';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import { jwtDecode } from 'jwt-decode';

const TransactionNavigation = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const pathname = usePathname();

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
        { path: '/dashboard/acknowledgement', label: 'Acknowledgement', resource: 'acknowledgement' },
        { path: '/dashboard/release', label: 'Release', resource: 'release' },
      ],
    },
    { path: '/dashboard/emergency-loan', label: 'Emergency Loan', resource: 'emergency loan' },
    { path: '/dashboard/damayan-fund', label: 'Damayan Fund', resource: 'damayan fund' },
  ];

  const isActivePath = (currentPath: string, navLinks: NavLink[]): boolean => {
    return navLinks.some(link => {
      if (link.path === currentPath) return true;
      if (link.children) {
        return isActivePath(currentPath, link.children);
      }
      return false;
    });
  };

  return (
    <IonAccordion value="transactions" className="bg-transparent">
      <IonItem
        slot="header"
        className={classNames(
          '!text-[0.9rem] space-x-2 text-slate-500 [--padding-start:0.5rem] [--padding-end:0.5rem] hover:[--color:#FA6C2F] [--border-color:transparent] [--background:transparent]',
          isActivePath(pathname, fileLinks) && '!text-[#fa6c2f]',
        )}
      >
        <IonIcon size="small" icon={fileTrayFullOutline} className="!text-inherit" />
        <IonLabel className="text-sm">Transactions</IonLabel>
      </IonItem>
      <div slot="content">
        <IonList className="p-0">
          {fileLinks.map(
            (link, i) =>
              (token.role === 'superadmin' || token.permissions.find((e: Permission) => link.resource.includes(e.resource) && e.actions.visible)) &&
              (link.children ? (
                <IonAccordionGroup key={`transaction-link-${i}`}>
                  <IonAccordion value={link.label} className="bg-transparent">
                    <IonItem
                      slot="header"
                      className={classNames(
                        '!text-[0.9rem] space-x-2 text-slate-500 [--padding-start:1rem] [--padding-end:0.5rem] hover:[--color:#FA6C2F] [--border-color:transparent] [--background:transparent]',
                        link.children.find((link: NavLink) => pathname === link.path) && '!text-[#fa6c2f]',
                      )}
                    >
                      <IonLabel className="text-sm">{link.label}</IonLabel>
                    </IonItem>
                    <div slot="content">
                      <IonList className="p-0">
                        {link.children.map(
                          subLink =>
                            (token.role === 'superadmin' || token.permissions.find((e: Permission) => e.resource === subLink.resource && e.actions.visible)) && (
                              <IonMenuToggle key={subLink.path} autoHide={false}>
                                <IonItem
                                  routerLink={subLink.path}
                                  className={classNames(
                                    '!text-[0.9rem] [--padding-start:1.5rem] [--min-height:2.25rem] [--border-color:transparent] space-x-2 text-slate-500 hover:[--color:#FA6C2F]',
                                    pathname === subLink.path && '!text-[#fa6c2f]',
                                  )}
                                >
                                  <IonLabel>{subLink.label}</IonLabel>
                                </IonItem>
                              </IonMenuToggle>
                            ),
                        )}
                      </IonList>
                    </div>
                  </IonAccordion>
                </IonAccordionGroup>
              ) : (
                <IonMenuToggle key={link.path} autoHide={false}>
                  <IonItem
                    routerLink={link.path}
                    className={classNames(
                      '!text-[0.9rem] [--padding-start:1rem] [--min-height:2.25rem] [--border-color:transparent] space-x-2 text-slate-500 hover:[--color:#FA6C2F]',
                      pathname === link.path && '!text-[#fa6c2f]',
                    )}
                  >
                    <IonLabel>{link.label}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              )),
          )}
        </IonList>
      </div>
    </IonAccordion>
  );
};

export default TransactionNavigation;
