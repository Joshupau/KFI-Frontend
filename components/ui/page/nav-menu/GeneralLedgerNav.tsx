import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import NoChildNav from './NoChildNav';
import { AccessToken, NavLink, Permission } from '../../../../types/types';
import WithChildNav from './WithChildNav';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { CollectionsBookmarkIcon  } from 'hugeicons-react';


const GeneralLedgerNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  const fileLinks: NavLink[] = [
    { path: '/dashboard/audit-trail', label: 'Audit Trail', resource: 'audit trail' },
    { path: '/dashboard/activity', label: 'Activity', resource: 'activity' },
    { path: '/dashboard/financial-statement', label: 'Financial Statement', resource: 'financial statement' },
    { path: '/dashboard/trial-balance', label: 'Trial Balance', resource: 'trial balance' },
    { path: '/dashboard/beginning-balance', label: 'Beginning Balance', resource: 'beginning balance' },
    { path: "/dashboard/projected-collection", label: "Projected Collection", resource: "projected collection" },
    { path: "/dashboard/portfolio-at-risk", label: "Portfolio at Risk", resource: "portfolio at risk" },
    { path: '/dashboard/weekly-collection', label: 'Weekly Collection', resource: 'weekly collection' },


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
        id="general-ledgers"
        onClick={() => setIsOpen(true)}
      >
        <CollectionsBookmarkIcon size={15} stroke='.8' className=' mr-1 mb-1' />
        General Ledgers&nbsp;
        <IonIcon icon={chevronDownOutline} className="text-xs" />
      </IonButton>
      <IonPopover onDidDismiss={() => setIsOpen(false)} showBackdrop={false} trigger="general-ledgers" triggerAction="click" className="[--max-width:14rem]">
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

export default GeneralLedgerNav;
