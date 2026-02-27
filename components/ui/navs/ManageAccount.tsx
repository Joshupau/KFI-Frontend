import { IonAccordion, IonIcon, IonItem, IonLabel, IonList, IonMenuToggle } from '@ionic/react';
import { keyOutline } from 'ionicons/icons';
import React from 'react';
import { AccessToken, NavLink, Permission } from '../../../types/types';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import { jwtDecode } from 'jwt-decode';

const ManageAccount = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const pathname = usePathname();

  const fileLinks: NavLink[] = [
    { path: '/dashboard/admin', label: 'Admin', resource: 'admin' },
    { path: '/dashboard/client', label: 'Clients', resource: 'clients' },
  ];
  return (
    <IonAccordion value="manageAccount" className="bg-transparent">
      <IonItem
        slot="header"
        className={classNames(
          '!text-[0.9rem] space-x-2 text-slate-500 [--padding-start:0.65rem] [--padding-end:0.65rem] hover:[--color:#FA6C2F] [--border-color:transparent] [--background:transparent]',
          fileLinks.find((link: NavLink) => pathname === link.path) && '!text-[#fa6c2f]',
        )}
      >
        <IonIcon size="small" icon={keyOutline} className="!text-inherit" />
        <IonLabel className="text-sm">Manage Account</IonLabel>
      </IonItem>
      <div slot="content">
        <IonList className="p-0">
          {fileLinks.map(
            link =>
              (token.role === 'superadmin' || token.permissions.find((e: Permission) => e.resource === link.resource && e.actions.visible)) && (
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
              ),
          )}
        </IonList>
      </div>
    </IonAccordion>
  );
};

export default ManageAccount;
