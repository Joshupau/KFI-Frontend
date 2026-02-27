import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import NoChildNav from './NoChildNav';
import { AccessToken, NavLink, Permission } from '../../../../types/types';
import WithChildNav from './WithChildNav';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { Settings02Icon  } from 'hugeicons-react';


const SystemNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

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
    { path: '/dashboard/nature', label: 'Nature', resource: 'nature' },
    { path: '/dashboard/systemparameters', label: 'System Parameters', resource: 'system parameters' },
    { path: '/dashboard/databases', label: 'Databases', resource: 'databases' },


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
        id="systems"
        onClick={() => setIsOpen(true)}
      >
        <Settings02Icon size={15} stroke='.8' className=' mr-1 mb-1' />
        System&nbsp;
        <IonIcon icon={chevronDownOutline} className="text-xs" />
      </IonButton>
      <IonPopover onDidDismiss={() => setIsOpen(false)} showBackdrop={false} trigger="systems" triggerAction="click" className="[--max-width:16rem]">
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

export default SystemNav;
