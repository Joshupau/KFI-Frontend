import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateLoan from '../modals/UpdateLoan';
import DeleteLoan from '../modals/DeleteLoan';
import { AccessToken, Loan } from '../../../../../types/types';
import { TLoan } from '../Loans';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import ViewLoanCodes from '../modals/ViewLoanCodes';

type LoanActionsProps = {
  loan: Loan;
  setData: React.Dispatch<React.SetStateAction<TLoan>>;
  getLoans: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const LoanActions = ({ loan, setData, currentPage, setCurrentPage, getLoans, searchKey, sortKey, rowLength }: LoanActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  return (
    <div>
      {canDoAction(token.role, token.permissions, 'product', 'visible') && <ViewLoanCodes loan={loan} />}
      {canDoAction(token.role, token.permissions, 'product', 'update') && <UpdateLoan loan={loan} setData={setData} />}
      {canDoAction(token.role, token.permissions, 'product', 'delete') && (
        <DeleteLoan loan={loan} getLoans={getLoans} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
      )}
    </div>
    // <>
    //   <IonButton fill="clear" id={`loan-${loan._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
    //     <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
    //   </IonButton>
    //   <IonPopover showBackdrop={false} trigger={`loan-${loan._id}`} triggerAction="click" className="[--max-width:12rem]">
    //     <IonContent>
    //       {canDoAction(token.role, token.permissions, 'product', 'visible') && <ViewLoanCodes loan={loan} />}
    //       {canDoAction(token.role, token.permissions, 'product', 'update') && <UpdateLoan loan={loan} setData={setData} />}
    //       {canDoAction(token.role, token.permissions, 'product', 'delete') && (
    //         <DeleteLoan loan={loan} getLoans={getLoans} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
    //       )}
    //     </IonContent>
    //   </IonPopover>
    // </>
  );
};

export default LoanActions;
