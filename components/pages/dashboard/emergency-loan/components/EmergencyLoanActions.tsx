import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import { AccessToken, EmergencyLoan } from '../../../../../types/types';
import { jwtDecode } from 'jwt-decode';
import { TData } from '../EmergencyLoan';
import { canDoAction } from '../../../../utils/permissions';
import UpdateEmergencyLoan from '../modals/UpdateEmergencyLoan';
import ViewEmergencyLoan from '../modals/ViewEmergencyLoan';
import DeleteEmergencyLoan from '../modals/DeleteEmergencyLoan';
import PrintEmergencyLoan from '../modals/prints/PrintEmergencyLoan';
import ExportEmergencyLoan from '../modals/prints/ExportEmergencyLoan';

type EmergencyLoanActionsProps = {
  emergencyLoan: EmergencyLoan;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  getEmergencyLoans: (page: number, keyword?: string, sort?: string, to?: string, from?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  to: string;
  from: string;
  rowLength: number;
};

const EmergencyLoanActions = ({ emergencyLoan, setData, getEmergencyLoans, currentPage, setCurrentPage, searchKey, sortKey, to, from, rowLength }: EmergencyLoanActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  return (
    <div>
      {canDoAction(token.role, token.permissions, 'emergency loan', 'visible') && <ViewEmergencyLoan emergencyLoan={emergencyLoan} />}
      {canDoAction(token.role, token.permissions, 'emergency loan', 'update') && <UpdateEmergencyLoan emergencyLoan={emergencyLoan} setData={setData} currentPage={currentPage} getEmergencyLoans={getEmergencyLoans} />}
      {canDoAction(token.role, token.permissions, 'emergency loan', 'delete') && (
        <DeleteEmergencyLoan
          emergencyLoan={emergencyLoan}
          getEmergencyLoans={getEmergencyLoans}
          searchkey={searchKey}
          sortKey={sortKey}
          currentPage={currentPage}
          rowLength={rowLength}
        />
      )}
      {canDoAction(token.role, token.permissions, 'emergency loan', 'print') && <PrintEmergencyLoan emergencyLoan={emergencyLoan} />}
      {canDoAction(token.role, token.permissions, 'emergency loan', 'export') && <ExportEmergencyLoan emergencyLoan={emergencyLoan} />}
    </div>
    // <>
    //   <IonButton fill="clear" id={`emergencyLoan-${emergencyLoan._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
    //     <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
    //   </IonButton>
    //   <IonPopover showBackdrop={false} trigger={`emergencyLoan-${emergencyLoan._id}`} triggerAction="click" className="[--max-width:11rem]">
    //     <IonContent class="[--padding-top:0.5rem] [--padding-bottom:0.5rem]">
    //       {canDoAction(token.role, token.permissions, 'emergency loan', 'visible') && <ViewEmergencyLoan emergencyLoan={emergencyLoan} />}
    //       {canDoAction(token.role, token.permissions, 'emergency loan', 'update') && <UpdateEmergencyLoan emergencyLoan={emergencyLoan} setData={setData} />}
    //       {canDoAction(token.role, token.permissions, 'emergency loan', 'delete') && (
    //         <DeleteEmergencyLoan
    //           emergencyLoan={emergencyLoan}
    //           getEmergencyLoans={getEmergencyLoans}
    //           searchkey={searchKey}
    //           sortKey={sortKey}
    //           currentPage={currentPage}
    //           rowLength={rowLength}
    //         />
    //       )}
    //       {canDoAction(token.role, token.permissions, 'emergency loan', 'print') && <PrintEmergencyLoan emergencyLoan={emergencyLoan} />}
    //       {canDoAction(token.role, token.permissions, 'emergency loan', 'export') && <ExportEmergencyLoan emergencyLoan={emergencyLoan} />}
    //       {/* <UpdateCVExpenseVoucher index={index} /> */}
    //     </IonContent>
    //   </IonPopover>
    // </>
  );
};

export default EmergencyLoanActions;
