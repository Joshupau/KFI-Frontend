import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import { AccessToken, Status } from '../../../../../types/types';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import { TStatus } from '../Status';
import UpdateStatus from '../modals/UpdateStatus';
import DeleteStatus from '../modals/DeleteStatus';

type StatusActionsProps = {
  status: Status;
  setData: React.Dispatch<React.SetStateAction<TStatus>>;
  getStatuses: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const StatusActions = ({ status, setData, currentPage, setCurrentPage, getStatuses, searchKey, sortKey, rowLength }: StatusActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  return (
    <>
      <IonButton fill="clear" id={`status-${status._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`status-${status._id}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          {canDoAction(token.role, token.permissions, 'status', 'update') && <UpdateStatus status={status} setData={setData} />}
          {canDoAction(token.role, token.permissions, 'status', 'delete') && (
            <DeleteStatus status={status} getStatuses={getStatuses} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
          )}
        </IonContent>
      </IonPopover>
    </>
  );
};

export default StatusActions;
