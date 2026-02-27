import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical, print } from 'ionicons/icons';
import { AccessToken, Acknowledgement, ExpenseVoucher } from '../../../../../types/types';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';
import { TData } from '../Acknowledgement';
import ViewAcknowledgement from '../modals/ViewAcknowledgement';
import UpdateAcknowledgement from '../modals/UpdateExpenseVoucher';
import PrintAcknowledgement from '../modals/prints/PrintAcknowledgement';
import ExportAcknowledgement from '../modals/prints/ExportAcknowledgement';
import DeleteAcknowledgement from '../modals/DeleteAcknowledgement';

type AcknowledgementActionsProps = {
  acknowledgement: Acknowledgement;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  getAcknowledgements: (page: number, keyword?: string, sort?: string, to?: string, from?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  to: string;
  from: string;
  rowLength: number;
};

const AcknowledgementActions = ({
  acknowledgement,
  setData,
  getAcknowledgements,
  currentPage,
  setCurrentPage,
  searchKey,
  sortKey,
  to,
  from,
  rowLength,
}: AcknowledgementActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  return (
    <div>
      {canDoAction(token.role, token.permissions, 'acknowledgement', 'visible') && <ViewAcknowledgement acknowledgement={acknowledgement} />}
      {canDoAction(token.role, token.permissions, 'acknowledgement', 'update') && <UpdateAcknowledgement acknowledgement={acknowledgement} setData={setData} getAcknowledgement={getAcknowledgements} currentPage={currentPage} />}
      {canDoAction(token.role, token.permissions, 'acknowledgement', 'delete') && (
        <DeleteAcknowledgement
          acknowledgement={acknowledgement}
          getAcknowledgements={getAcknowledgements}
          searchkey={searchKey}
          sortKey={sortKey}
          currentPage={currentPage}
          rowLength={rowLength}
        />
      )}
      {canDoAction(token.role, token.permissions, 'acknowledgement', 'print') && <PrintAcknowledgement acknowledgement={acknowledgement} />}
      {canDoAction(token.role, token.permissions, 'acknowledgement', 'export') && <ExportAcknowledgement acknowledgement={acknowledgement} />}
    </div>
    // <>
    //   <IonButton fill="clear" id={`acknowledgement-${acknowledgement._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
    //     <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
    //   </IonButton>
    //   <IonPopover showBackdrop={false} trigger={`acknowledgement-${acknowledgement._id}`} triggerAction="click" className="[--max-width:11rem]">
    //     <IonContent class="[--padding-top:0.5rem] [--padding-bottom:0.5rem]">
    //       {canDoAction(token.role, token.permissions, 'acknowledgement', 'visible') && <ViewAcknowledgement acknowledgement={acknowledgement} />}
    //       {canDoAction(token.role, token.permissions, 'acknowledgement', 'update') && <UpdateAcknowledgement acknowledgement={acknowledgement} setData={setData} />}
    //       {canDoAction(token.role, token.permissions, 'acknowledgement', 'delete') && (
    //         <DeleteAcknowledgement
    //           acknowledgement={acknowledgement}
    //           getAcknowledgements={getAcknowledgements}
    //           searchkey={searchKey}
    //           sortKey={sortKey}
    //           currentPage={currentPage}
    //           rowLength={rowLength}
    //         />
    //       )}
    //       {canDoAction(token.role, token.permissions, 'acknowledgement', 'print') && <PrintAcknowledgement acknowledgement={acknowledgement} />}
    //       {canDoAction(token.role, token.permissions, 'acknowledgement', 'export') && <ExportAcknowledgement acknowledgement={acknowledgement} />}
    //       {/* <UpdateCVExpenseVoucher index={index} /> */}
    //     </IonContent>
    //   </IonPopover>
    // </>
  );
};

export default AcknowledgementActions;
