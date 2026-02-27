import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import NoChildNav from './NoChildNav';
import { AccessToken, NavLink, Permission } from '../../../../types/types';
import WithChildNav from './WithChildNav';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { ToolsIcon  } from 'hugeicons-react';


const Diagnostics = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  const fileLinks: NavLink[] = [
    { path: '/dashboard/unbalance-entries', label: 'Unbalance Entries', resource: 'unbalance entries' },
    { path: '/dashboard/login-logs', label: 'Login Logs', resource: 'login logs' },
    { path: '/dashboard/action-logs', label: 'Action Logs', resource: 'action logs' },
  ];

  return (
    <div>
      <IonButton
        fill="clear"
        className={classNames(
          'min-h-6 text-[0.8rem] capitalize [--padding-start:1rem] [--padding-end:1rem] rounded-md py-1 [--padding-bottom:0] [--padding-top:0]  [--color:black]  [--ripple-color:transparent]',
          isOpen && '!font-semibold',
          fileLinks.map(link => link.path).includes(pathname) ? 'bg-orange-600 text-white' : 'bg-transparent',
        )}
        id="diagnostics"
        onClick={() => setIsOpen(true)}
      >
        <ToolsIcon size={15} stroke='.8' className=' mr-1 mb-1' />
        Diagnostics&nbsp;
        <IonIcon icon={chevronDownOutline} className="text-xs" />
      </IonButton>
      <IonPopover onDidDismiss={() => setIsOpen(false)} showBackdrop={false} trigger="diagnostics" triggerAction="click" className="[--max-width:12rem]">
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

export default Diagnostics;
