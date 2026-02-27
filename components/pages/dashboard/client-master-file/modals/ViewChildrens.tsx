import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar } from '@ionic/react';
import { people } from 'ionicons/icons';
import React, { useRef } from 'react';
import { AccessToken, Child, ClientMasterFile } from '../../../../../types/types';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import CreateChildren from './CreateChildren';
import { TClientMasterFile } from '../ClientMasterFile';
import DeleteChildren from './DeleteChildren';
import UpdateChildren from './UpdateChildren';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';

type ViewChildrensProps = {
  client: ClientMasterFile;
  setData: React.Dispatch<React.SetStateAction<TClientMasterFile>>;
};

const ViewChildrens = ({ client, setData }: ViewChildrensProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <>
      {/* <div className="text-end">
        <div
          id={`view-children-modal-${client._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={people} className="text-[1rem]" /> View Children
        </div>
      </div> */}
      <IonButton
        type="button"
        id={`view-children-modal-${client._id}`}
        fill="clear"
        className="space-x-1 w-32 h-6 rounded-lg ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#FA6C2F] text-slate-100 capitalize min-h-8 text-xs"
      >
        <IonIcon icon={people} className="text-xs" />
        <span>View Children</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`view-children-modal-${client._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:35rem] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Client - View Children" sub="Manage Account" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div className="py-1">
            <div className="py-1">{canDoAction(token.role, token.permissions, 'clients', 'update') && <CreateChildren client={client} setData={setData} />}</div>
          </div>
          {client.children.length < 1 && <div className="text-center text-slate-700 text-sm py-3">No Children Found</div>}
          {client.children.length > 0 && (
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow className="border-b-0 bg-slate-100">
                    <TableHead>Child Name</TableHead>
                    {canDoAction(token.role, token.permissions, 'clients', 'update') && <TableHead>Actions</TableHead>}
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {client.children.map((child: Child) => (
                    <TableRow key={child._id} className="border-b-0 hover:!bg-transparent">
                      <TableCell className="border-4 border-slate-100">{child.name}</TableCell>
                      {canDoAction(token.role, token.permissions, 'clients', 'update') && (
                        <TableCell className="border-4 border-slate-100">
                          <div className="flex items-center gap-2">
                            <UpdateChildren child={child} setData={setData} />
                            <DeleteChildren child={child} setData={setData} />
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

export default ViewChildrens;
