import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import { AccessToken, DamayanFund } from '../../../../../types/types';
import { jwtDecode } from 'jwt-decode';
import { TData } from '../DamayanFund';
import { canDoAction } from '../../../../utils/permissions';
import ExportEmergencyLoan from '../modals/prints/ExportEmergencyLoan';
import ViewDamayanFund from '../modals/ViewEmergencyLoan';
import UpdateDamayanFund from '../modals/UpdateEmergencyLoan';
import DeleteDamayanFund from '../modals/DeleteEmergencyLoan';
import PrintDamayanFund from '../modals/prints/PrintDamayanFund';

type DamayanFundActionsProps = {
  damayanFund: DamayanFund;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  getDamayanFunds: (page: number, keyword?: string, sort?: string, to?: string, from?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  to: string;
  from: string;
  rowLength: number;
};

const DamayanFundActions = ({ damayanFund, setData, getDamayanFunds, currentPage, setCurrentPage, searchKey, sortKey, to, from, rowLength }: DamayanFundActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  return (
    <div>
      {canDoAction(token.role, token.permissions, 'damayan fund', 'visible') && <ViewDamayanFund damayanFund={damayanFund} />}
      {canDoAction(token.role, token.permissions, 'damayan fund', 'update') && <UpdateDamayanFund damayanFund={damayanFund} setData={setData} getDamayanFunds={getDamayanFunds} currentPage={currentPage} />}
      {canDoAction(token.role, token.permissions, 'damayan fund', 'delete') && (
        <DeleteDamayanFund damayanFund={damayanFund} getDamayanFunds={getDamayanFunds} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
      )}
      {canDoAction(token.role, token.permissions, 'damayan fund', 'print') && <PrintDamayanFund damayanFund={damayanFund} />}
      {canDoAction(token.role, token.permissions, 'damayan fund', 'export') && <ExportEmergencyLoan damayanFund={damayanFund} />}
    </div>
    // <>
    //   <IonButton fill="clear" id={`damayanFund-${damayanFund._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
    //     <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
    //   </IonButton>
    //   <IonPopover showBackdrop={false} trigger={`damayanFund-${damayanFund._id}`} triggerAction="click" className="[--max-width:11rem]">
    //     <IonContent class="[--padding-top:0.5rem] [--padding-bottom:0.5rem]">
    //       {canDoAction(token.role, token.permissions, 'damayan fund', 'visible') && <ViewDamayanFund damayanFund={damayanFund} />}
    //       {canDoAction(token.role, token.permissions, 'damayan fund', 'update') && <UpdateDamayanFund damayanFund={damayanFund} setData={setData} />}
    //       {canDoAction(token.role, token.permissions, 'damayan fund', 'delete') && (
    //         <DeleteDamayanFund
    //           damayanFund={damayanFund}
    //           getDamayanFunds={getDamayanFunds}
    //           searchkey={searchKey}
    //           sortKey={sortKey}
    //           currentPage={currentPage}
    //           rowLength={rowLength}
    //         />
    //       )}
    //       {canDoAction(token.role, token.permissions, 'damayan fund', 'print') && <PrintDamayanFund damayanFund={damayanFund} />}
    //       {canDoAction(token.role, token.permissions, 'damayan fund', 'export') && <ExportEmergencyLoan damayanFund={damayanFund} />}
    //       {/* <UpdateCVExpenseVoucher index={index} /> */}
    //     </IonContent>
    //   </IonPopover>
    // </>
  );
};

export default DamayanFundActions;
