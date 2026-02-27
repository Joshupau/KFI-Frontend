import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical, print } from 'ionicons/icons';
import DeleteExpenseVoucher from '../modals/DeleteExpenseVoucher';
import UpdateExpenseVoucher from '../modals/UpdateExpenseVoucher';
import ViewExpenseVoucher from '../modals/ViewExpenseVoucher';
import UpdateCVExpenseVoucher from '../modals/UpdateCVExpenseVoucher';
import { AccessToken, ExpenseVoucher } from '../../../../../types/types';
import { TData } from '../ExpenseVoucher';
import PrintExpenseVoucher from '../modals/prints/PrintExpenseVoucher';
import ExportExpenseVoucher from '../modals/prints/ExportExpenseVoucher';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';

type ExpenseVoucherActionsProps = {
  expenseVoucher: ExpenseVoucher;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  getExpenseVouchers: (page: number, keyword?: string, sort?: string, to?: string, from?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  to: string;
  from: string;
  rowLength: number;
};

const ExpenseVoucherActions = ({
  expenseVoucher,
  setData,
  getExpenseVouchers,
  currentPage,
  setCurrentPage,
  searchKey,
  sortKey,
  to,
  from,
  rowLength,
}: ExpenseVoucherActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  return (
    <div>
      {canDoAction(token.role, token.permissions, 'expense voucher', 'visible') && <ViewExpenseVoucher expenseVoucher={expenseVoucher} />}
      {canDoAction(token.role, token.permissions, 'expense voucher', 'update') && <UpdateExpenseVoucher expenseVoucher={expenseVoucher} setData={setData} getExpenseVouchers={getExpenseVouchers} currentPage={currentPage} />}
      {canDoAction(token.role, token.permissions, 'expense voucher', 'delete') && (
        <DeleteExpenseVoucher
          expenseVoucher={expenseVoucher}
          getExpenseVouchers={getExpenseVouchers}
          searchkey={searchKey}
          sortKey={sortKey}
          currentPage={currentPage}
          rowLength={rowLength}
        />
      )}
      {canDoAction(token.role, token.permissions, 'expense voucher', 'print') && <PrintExpenseVoucher expenseVoucher={expenseVoucher} />}
      {canDoAction(token.role, token.permissions, 'expense voucher', 'export') && <ExportExpenseVoucher expenseVoucher={expenseVoucher} />}
    </div>
    // <>
    //   <IonButton fill="clear" id={`expenseVoucher-${expenseVoucher._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
    //     <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
    //   </IonButton>
    //   <IonPopover showBackdrop={false} trigger={`expenseVoucher-${expenseVoucher._id}`} triggerAction="click" className="[--max-width:11rem]">
    //     <IonContent class="[--padding-top:0.5rem] [--padding-bottom:0.5rem]">
    //       {canDoAction(token.role, token.permissions, 'expense voucher', 'visible') && <ViewExpenseVoucher expenseVoucher={expenseVoucher} />}
    //       {canDoAction(token.role, token.permissions, 'expense voucher', 'update') && <UpdateExpenseVoucher expenseVoucher={expenseVoucher} setData={setData} />}
    //       {canDoAction(token.role, token.permissions, 'expense voucher', 'delete') && (
    //         <DeleteExpenseVoucher
    //           expenseVoucher={expenseVoucher}
    //           getExpenseVouchers={getExpenseVouchers}
    //           searchkey={searchKey}
    //           sortKey={sortKey}
    //           currentPage={currentPage}
    //           rowLength={rowLength}
    //         />
    //       )}
    //       {canDoAction(token.role, token.permissions, 'expense voucher', 'print') && <PrintExpenseVoucher expenseVoucher={expenseVoucher} />}
    //       {canDoAction(token.role, token.permissions, 'expense voucher', 'export') && <ExportExpenseVoucher expenseVoucher={expenseVoucher} />}
    //        <UpdateCVExpenseVoucher index={index} />
    //     </IonContent>
    //   </IonPopover>
    // </>
  );
};

export default ExpenseVoucherActions;
