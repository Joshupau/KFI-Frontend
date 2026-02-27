import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateGroupAccount from '../modals/UpdateGroupAccount';
import DeleteGroupAccount from '../modals/DeleteGroupAccount';
import { AccessToken, GroupAccount } from '../../../../../types/types';
import { TGroupAccount } from '../GroupAccount';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import ViewGroupAccount from '../modals/ViewGroupAccount';

type GroupAccountActionsProps = {
  groupAccount: GroupAccount;
  setData: React.Dispatch<React.SetStateAction<TGroupAccount>>;
  getGroupAccounts: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const GroupAccountActions = ({ groupAccount, setData, currentPage, setCurrentPage, getGroupAccounts, searchKey, sortKey, rowLength }: GroupAccountActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  return (
    <div>
      {canDoAction(token.role, token.permissions, 'group of account', 'visible') && <ViewGroupAccount groupAccount={groupAccount} />}
      {canDoAction(token.role, token.permissions, 'group of account', 'update') && <UpdateGroupAccount groupAccount={groupAccount} setData={setData} />}
      {canDoAction(token.role, token.permissions, 'group of account', 'delete') && (
        <DeleteGroupAccount
          groupAccount={groupAccount}
          getGroupAccounts={getGroupAccounts}
          searchkey={searchKey}
          sortKey={sortKey}
          currentPage={currentPage}
          rowLength={rowLength}
        />
      )}
    </div>
    // <>
    //   <IonButton fill="clear" id={`ga-${groupAccount._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
    //     <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
    //   </IonButton>
    //   <IonPopover showBackdrop={false} trigger={`ga-${groupAccount._id}`} triggerAction="click" className="[--max-width:10rem]">
    //     <IonContent>
    //       {canDoAction(token.role, token.permissions, 'group of account', 'update') && <UpdateGroupAccount groupAccount={groupAccount} setData={setData} />}
    //       {canDoAction(token.role, token.permissions, 'group of account', 'delete') && (
    //         <DeleteGroupAccount
    //           groupAccount={groupAccount}
    //           getGroupAccounts={getGroupAccounts}
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

export default GroupAccountActions;
