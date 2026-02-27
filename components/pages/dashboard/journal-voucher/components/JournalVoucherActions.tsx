import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import ViewJournalVoucher from '../modals/ViewJournalVoucher';
import UpdateJournalVoucher from '../modals/UpdateJournalVoucher';
import DeleteJournalVoucher from '../modals/DeleteJournalVoucher';
import { AccessToken, JournalVoucher } from '../../../../../types/types';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import { TData } from '../JournalVoucher';
import PrintJournalVoucher from '../modals/prints/PrintJournalVoucher';
import ExportJournalVoucher from '../modals/prints/ExportJournalVoucher';

type JournalVoucherActionsProps = {
  journalVoucher: JournalVoucher;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  getJournalVouchers: (page: number, keyword?: string, sort?: string, to?: string, from?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  to: string;
  from: string;
  rowLength: number;
};

const JournalVoucherActions = ({
  journalVoucher,
  setData,
  getJournalVouchers,
  currentPage,
  setCurrentPage,
  searchKey,
  sortKey,
  to,
  from,
  rowLength,
}: JournalVoucherActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  return (
    <div>
      {canDoAction(token.role, token.permissions, 'journal voucher', 'visible') && <ViewJournalVoucher journalVoucher={journalVoucher} />}
      {canDoAction(token.role, token.permissions, 'journal voucher', 'update') && <UpdateJournalVoucher journalVoucher={journalVoucher} setData={setData} />}
      {canDoAction(token.role, token.permissions, 'journal voucher', 'delete') && (
        <DeleteJournalVoucher
          journalVoucher={journalVoucher}
          getJournalVouchers={getJournalVouchers}
          searchkey={searchKey}
          sortKey={sortKey}
          currentPage={currentPage}
          rowLength={rowLength}
        />
      )}
      {canDoAction(token.role, token.permissions, 'journal voucher', 'print') && <PrintJournalVoucher journalVoucher={journalVoucher} />}
      {canDoAction(token.role, token.permissions, 'expense voucher', 'export') && <ExportJournalVoucher journalVoucher={journalVoucher} />}
    </div>
    // <>
    //   <IonButton fill="clear" id={`journalVoucher-${journalVoucher._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
    //     <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
    //   </IonButton>
    //   <IonPopover showBackdrop={false} trigger={`journalVoucher-${journalVoucher._id}`} triggerAction="click" className="[--max-width:11rem]">
    //     <IonContent class="[--padding-top:0.5rem] [--padding-bottom:0.5rem]">
    //       {canDoAction(token.role, token.permissions, 'journal voucher', 'visible') && <ViewJournalVoucher journalVoucher={journalVoucher} />}
    //       {canDoAction(token.role, token.permissions, 'journal voucher', 'update') && <UpdateJournalVoucher journalVoucher={journalVoucher} setData={setData} />}
    //       {canDoAction(token.role, token.permissions, 'journal voucher', 'delete') && (
    //         <DeleteJournalVoucher
    //           journalVoucher={journalVoucher}
    //           getJournalVouchers={getJournalVouchers}
    //           searchkey={searchKey}
    //           sortKey={sortKey}
    //           currentPage={currentPage}
    //           rowLength={rowLength}
    //         />
    //       )}
    //       {canDoAction(token.role, token.permissions, 'journal voucher', 'print') && <PrintJournalVoucher journalVoucher={journalVoucher} />}
    //       {canDoAction(token.role, token.permissions, 'expense voucher', 'export') && <ExportJournalVoucher journalVoucher={journalVoucher} />}
    //       <UpdateCVJournalVoucher index={journalVoucher._id} />
    //     </IonContent>
    //   </IonPopover>
    // </>
  );
};

export default JournalVoucherActions;
