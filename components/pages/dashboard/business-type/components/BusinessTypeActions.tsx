import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateBusinessType from '../modals/UpdateBusinessType';
import DeleteBusinessType from '../modals/DeleteBusinessType';
import { AccessToken, BusinessType } from '../../../../../types/types';
import { TBusinessType } from '../BusinessType';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import ViewBusinessType from '../modals/ViewBusinessType';

type BusinessTypeActionsProps = {
  businessType: BusinessType;
  setData: React.Dispatch<React.SetStateAction<TBusinessType>>;
  getBusinessTypes: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const BusinessTypeActions = ({ businessType, setData, currentPage, setCurrentPage, getBusinessTypes, searchKey, sortKey, rowLength }: BusinessTypeActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  return (
    <div>
      {canDoAction(token.role, token.permissions, 'business type', 'visible') && <ViewBusinessType businessType={businessType} />}
      {canDoAction(token.role, token.permissions, 'business type', 'update') && <UpdateBusinessType businessType={businessType} setData={setData} />}
      {canDoAction(token.role, token.permissions, 'business type', 'delete') && (
        <DeleteBusinessType
          businessType={businessType}
          getBusinessTypes={getBusinessTypes}
          searchkey={searchKey}
          sortKey={sortKey}
          currentPage={currentPage}
          rowLength={rowLength}
        />
      )}
    </div>
    // <>
    //   <IonButton fill="clear" id={`bt-${businessType._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
    //     <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
    //   </IonButton>
    //   <IonPopover showBackdrop={false} trigger={`bt-${businessType._id}`} triggerAction="click" className="[--max-width:10rem]">
    //     <IonContent>
    //       {canDoAction(token.role, token.permissions, 'business type', 'update') && <UpdateBusinessType businessType={businessType} setData={setData} />}
    //       {canDoAction(token.role, token.permissions, 'business type', 'delete') && (
    //         <DeleteBusinessType
    //           businessType={businessType}
    //           getBusinessTypes={getBusinessTypes}
    //           searchkey={searchKey}
    //           sortKey={sortKey}
    //           currentPage={currentPage}
    //           rowLength={rowLength}
    //         />
    //       )}
    //     </IonContent>
    //   </IonPopover>
    // </>
  );
};

export default BusinessTypeActions;
