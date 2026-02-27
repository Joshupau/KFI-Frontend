import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar } from '@ionic/react';
import { person } from 'ionicons/icons';
import React, { useRef } from 'react';
import { AccessToken, Beneficiary, ClientMasterFile } from '../../../../../types/types';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { TClientMasterFile } from '../ClientMasterFile';
import CreateBeneficiary from './CreateBeneficiary';
import DeleteBeneficiary from './DeleteBeneficiary';
import UpdateBeneficiary from './UpdateBeneficiary';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';

type ViewBeneficiariesProps = {
  client: ClientMasterFile;
  setData: React.Dispatch<React.SetStateAction<TClientMasterFile>>;
};

const ViewBeneficiaries = ({ client, setData }: ViewBeneficiariesProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <>
      {/* <div className="text-end">
        <div
          id={`view-beneficiaries-modal-${client._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={person} className="text-[1rem]" /> View Beneficiaries
        </div>
      </div> */}
      <IonButton
        type="button"
        id={`view-beneficiaries-modal-${client._id}`}
        fill="clear"
        className="space-x-1 rounded-lg w-40 h-6 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#FA6C2F] text-slate-100 capitalize min-h-8 text-xs"
      >
        <IonIcon icon={person} className="text-xs" />
        <span>View Beneficiary</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`view-beneficiaries-modal-${client._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:40rem] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Client - View Beneficiaries" sub="Manage Account" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div className="py-1">{canDoAction(token.role, token.permissions, 'clients', 'update') && <CreateBeneficiary client={client} setData={setData} />}</div>
          {client.beneficiaries.length < 1 && <div className="text-center text-slate-700 text-sm py-3">No Beneficiary Found</div>}
          {client.beneficiaries.length > 0 && (
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow className="border-b-0 bg-slate-100">
                    <TableHead>Beneficiary Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    {canDoAction(token.role, token.permissions, 'clients', 'update') && <TableHead>Actions</TableHead>}
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {client.beneficiaries.map((beneficiary: Beneficiary) => (
                    <TableRow key={beneficiary._id} className="border-b-0 hover:!bg-transparent">
                      <TableCell className="border-4 border-slate-100">{beneficiary.name}</TableCell>
                      <TableCell className="border-4 border-slate-100">{beneficiary.relationship}</TableCell>
                      {canDoAction(token.role, token.permissions, 'clients', 'update') && (
                        <TableCell className="border-4 border-slate-100">
                          <div className="flex items-center gap-2">
                            <UpdateBeneficiary beneficiary={beneficiary} setData={setData} />
                            <DeleteBeneficiary beneficiary={beneficiary} setData={setData} />
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </IonModal>
    </>
  );
};

export default ViewBeneficiaries;
