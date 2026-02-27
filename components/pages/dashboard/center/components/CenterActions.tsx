import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';

import { ellipsisVertical } from 'ionicons/icons';
import UpdateCenter from '../modals/UpdateCenter';
import DeleteCenter from '../modals/DeleteCenter';
import { AccessToken, Center } from '../../../../../types/types';
import { TCenter } from '../Center';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import ViewCenter from '../modals/ViewCenter';

type CenterActionsProps = {
  center: Center;
  setData: React.Dispatch<React.SetStateAction<TCenter>>;
  getCenters: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const CenterActions = ({ center, setData, getCenters, currentPage, setCurrentPage, searchKey, sortKey, rowLength }: CenterActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  return (
    <div>
      {canDoAction(token.role, token.permissions, 'center', 'visible') && <ViewCenter center={center} />}
      {canDoAction(token.role, token.permissions, 'center', 'update') && <UpdateCenter center={center} setData={setData} />}
      {canDoAction(token.role, token.permissions, 'center', 'delete') && (
        <DeleteCenter center={center} getCenters={getCenters} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
      )}
    </div>
    // <>
    //   <IonButton fill="clear" id={`center-${center._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
    //     <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
    //   </IonButton>
    //   <IonPopover showBackdrop={false} trigger={`center-${center._id}`} triggerAction="click" className="[--max-width:10rem]">
    //     <IonContent>
    //       {canDoAction(token.role, token.permissions, 'center', 'update') && <UpdateCenter center={center} setData={setData} />}
    //       {canDoAction(token.role, token.permissions, 'center', 'delete') && (
    //         <DeleteCenter center={center} getCenters={getCenters} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
    //       )}
    //     </IonContent>
    //   </IonPopover>
    // </>
  );
};

export default CenterActions;
