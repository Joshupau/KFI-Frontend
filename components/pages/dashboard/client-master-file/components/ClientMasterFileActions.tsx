import React from 'react';
import { AccessToken, ClientMasterFile } from '../../../../../types/types';
import { TClientMasterFile } from '../ClientMasterFile';
import UpdateClientMasterFile from '../modals/UpdateClientMasterFile';
import DeleteClientMasterFile from '../modals/DeleteClientMasterFile';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';
import PrintClient from '../modals/PrintClient';
import ExportClient from '../modals/ExportClient';
import ViewClientMasterFile from '../modals/ViewClientMasterFile';

type ClientMasterFileActionsProps = {
  client: ClientMasterFile;
  setData: React.Dispatch<React.SetStateAction<TClientMasterFile>>;
  getClients: (page: number, keyword?: string, sort?: string) => {};
  getClientsOffline: (page: number, keyword?: string, sort?: string) => void;

  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const ClientMasterFileActions = ({ client, getClients, setData, currentPage, setCurrentPage, searchKey, sortKey, rowLength, getClientsOffline }: ClientMasterFileActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  return (
    <div className="flex items-center gap-1">
      {canDoAction(token.role, token.permissions, 'clients', 'visible') && <ViewClientMasterFile member={client} />}
      {canDoAction(token.role, token.permissions, 'clients', 'update') && <UpdateClientMasterFile getClientsOffline={getClientsOffline} client={client} setData={setData} />}
      {canDoAction(token.role, token.permissions, 'clients', 'delete') && (
        <DeleteClientMasterFile getClientsOffline={getClientsOffline} client={client} getClients={getClients} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
      )}
      {canDoAction(token.role, token.permissions, 'clients', 'print') && <PrintClient client={client} />}
      {canDoAction(token.role, token.permissions, 'clients', 'export') && <ExportClient client={client} />}
    </div>
    // <>
    //   <IonButton fill="clear" id={`cmf-${client._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
    //     <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
    //   </IonButton>
    //   <IonPopover showBackdrop={false} trigger={`cmf-${client._id}`} triggerAction="click" className="[--max-width:13rem]">
    //     <IonContent>
    //       {canDoAction(token.role, token.permissions, 'clients', 'update') && <UpdateClientMasterFile client={client} setData={setData} />}
    //       {canDoAction(token.role, token.permissions, 'clients', 'visible') && (
    //         <>
    //           <ViewBeneficiaries client={client} setData={setData} />
    //           <ViewChildrens client={client} setData={setData} />
    //         </>
    //       )}

    //       {canDoAction(token.role, token.permissions, 'clients', 'delete') && (
    //         <DeleteClientMasterFile client={client} getClients={getClients} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
    //       )}
    //       {canDoAction(token.role, token.permissions, 'clients', 'print') && <PrintClient client={client} />}
    //       {canDoAction(token.role, token.permissions, 'clients', 'export') && <ExportClient client={client} />}
    //     </IonContent>
    //   </IonPopover>
    // </>
  );
};

export default ClientMasterFileActions;
