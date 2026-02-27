import { IonAccordion, IonAccordionGroup, IonIcon, IonItem, IonLabel, IonList, IonMenuToggle } from '@ionic/react';
import { desktopOutline } from 'ionicons/icons';
import React from 'react';
import { AccessToken, NavLink, Permission } from '../../../types/types';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import { jwtDecode } from 'jwt-decode';

const SystemNav = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const pathname = usePathname();

  const fileLinks: NavLink[] = [
    {
      path: '',
      label: 'Loan Product',
      resource: ['group of account', 'chart of account', 'product'],
      children: [
        { path: '/dashboard/group-of-account', label: 'Group Of Account', resource: 'group of account' },
        { path: '/dashboard/chart-of-account', label: 'Chart Of Account', resource: 'chart of account' },
        { path: '/dashboard/product', label: 'Product', resource: 'product' },
      ],
    },
    { path: '/dashboard/center', label: 'Center', resource: 'center' },
    { path: '/dashboard/bank', label: 'Bank', resource: 'bank' },
    { path: '/dashboard/weekly-savings', label: 'Weekly Savings', resource: 'weekly savings' },
    {
      path: '',
      label: 'Business',
      resource: ['business type', 'business supplier'],
      children: [
        { path: '/dashboard/business-type', label: 'Type', resource: 'business type' },
        { path: '/dashboard/business-supplier', label: 'Supplier', resource: 'business supplier' },
      ],
    },
    { path: '/dashboard/systemparameters', label: 'System Parameters', resource: 'system parameters' },
    { path: '/dashboard/databases', label: 'Databases', resource: 'databases' },

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
    <IonAccordion value="allFiles" className="bg-transparent">
      <IonItem
        slot="header"
        className={classNames(
          '!text-[0.9rem] space-x-2 text-slate-500 [--padding-start:0.5rem] [--padding-end:0.5rem] hover:[--color:#FA6C2F] [--border-color:transparent] [--background:transparent]',
          isActivePath(pathname, fileLinks) && '!text-[#fa6c2f]',
        )}
      >
        <IonIcon size="small" icon={desktopOutline} className="!text-inherit" />
        <IonLabel className="text-sm">System</IonLabel>
      </IonItem>
      <div slot="content">
        <IonList className="p-0">
          {fileLinks.map(
            (link, i) =>
              (token.role === 'superadmin' || token.permissions.find((e: Permission) => link.resource.includes(e.resource) && e.actions.visible)) &&
              (link.children ? (
                <IonAccordionGroup key={`system-link-${i}`}>
                  <IonAccordion value="transactions" className="bg-transparent">
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

export default SystemNav;
