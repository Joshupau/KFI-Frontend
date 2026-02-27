import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateWeeklySavingTable from '../modals/UpdateWeeklySavingTable';
import DeleteWeeklySavingTable from '../modals/DeleteWeeklySavingTable';
import { AccessToken, WeeklySavings } from '../../../../../types/types';
import { TWeeklySavingsTable } from '../WeeklySavingTable';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';

type WeeklySavingTableActionsProps = {
  saving: WeeklySavings;
  setData: React.Dispatch<React.SetStateAction<TWeeklySavingsTable>>;
  getWeeklySavings: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const WeeklySavingTableActions = ({ saving, setData, getWeeklySavings, currentPage, setCurrentPage, searchKey, sortKey, rowLength }: WeeklySavingTableActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  return (
    <div>
      {canDoAction(token.role, token.permissions, 'weekly savings', 'update') && <UpdateWeeklySavingTable saving={saving} setData={setData} />}
      {canDoAction(token.role, token.permissions, 'weekly savings', 'delete') && (
        <DeleteWeeklySavingTable saving={saving} getWeeklySavings={getWeeklySavings} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
      )}
    </div>
    // <>
    //   <IonButton fill="clear" id={`wst-${saving._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
    //     <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
    //   </IonButton>
    //   <IonPopover showBackdrop={false} trigger={`wst-${saving._id}`} triggerAction="click" className="[--max-width:10rem]">
    //     <IonContent>
    //       {canDoAction(token.role, token.permissions, 'weekly savings', 'update') && <UpdateWeeklySavingTable saving={saving} setData={setData} />}
    //       {canDoAction(token.role, token.permissions, 'weekly savings', 'delete') && (
    //         <DeleteWeeklySavingTable saving={saving} getWeeklySavings={getWeeklySavings} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
    //       )}
    //     </IonContent>
    //   </IonPopover>
    // </>
  );
};

export default WeeklySavingTableActions;
