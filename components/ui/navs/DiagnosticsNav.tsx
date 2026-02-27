import { IonAccordion, IonAccordionGroup, IonIcon, IonItem, IonLabel, IonList, IonMenuToggle } from '@ionic/react';
import { documentTextOutline } from 'ionicons/icons';
import React from 'react';
import { AccessToken, NavLink, Permission } from '../../../types/types';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import { jwtDecode } from 'jwt-decode';

const DiagnosticsNav = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const pathname = usePathname();

  const fileLinks: NavLink[] = [
    { path: '/dashboard/unbalance-entries', label: 'Unbalance Entries', resource: 'unbalance entries' },
    { path: '/dashboard/login-logs', label: 'Login Logs', resource: 'login logs' },
    { path: '/dashboard/action-logs', label: 'Action Logs', resource: 'action logs' },
  ];

  return (
    <IonAccordion value="diagnotics" className="bg-transparent">
      <IonItem
        slot="header"
        className={classNames(
          '!text-[0.9rem] space-x-2 text-slate-500 [--padding-start:0.5rem] [--padding-end:0.5rem] hover:[--color:#FA6C2F] [--border-color:transparent] [--background:transparent]',
          fileLinks.find((link: NavLink) => pathname === link.path) && '!text-[#fa6c2f]',
        )}
      >
        <IonIcon size="small" icon={documentTextOutline} className="!text-inherit" />
        <IonLabel className="text-sm">Diagnostics</IonLabel>
      </IonItem>
      <div slot="content">
        <IonList className="p-0">
          {fileLinks.map(
            link =>
              (token.role === 'superadmin' || token.permissions.find((e: Permission) => e.resource === link.resource && e.actions.visible)) &&
              (link.children ? (
                <IonAccordionGroup>
                  <IonAccordion value="transactions" className="bg-transparent">
                    <IonItem
                      slot="header"
                      className={classNames(
                        '!text-[0.9rem] space-x-2 text-slate-500 [--padding-start:0.5rem] [--padding-end:0.5rem] hover:[--color:#FA6C2F] [--border-color:transparent] [--background:transparent]',
                        fileLinks.find((link: NavLink) => pathname === link.path) && '!text-[#fa6c2f]',
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

export default DiagnosticsNav;
