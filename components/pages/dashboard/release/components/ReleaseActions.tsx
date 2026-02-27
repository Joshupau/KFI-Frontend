import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import { AccessToken, Release } from '../../../../../types/types';
import { canDoAction } from '../../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';
import { TData } from '../Release';
import UpdateRelease from '../modals/UpdateRelease';
import ViewRelease from '../modals/ViewRelease';
import PrintRelease from '../modals/prints/PrintRelease';
import ExportRelease from '../modals/prints/ExportRelease';
import DeleteRelease from '../modals/DeleteRelease';

type ReleaseActionsProps = {
  release: Release;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  getReleases: (page: number, keyword?: string, sort?: string, to?: string, from?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  to: string;
  from: string;
  rowLength: number;
};

const ReleaseActions = ({ release, setData, getReleases, currentPage, setCurrentPage, searchKey, sortKey, to, from, rowLength }: ReleaseActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  return (
    <div>
      {canDoAction(token.role, token.permissions, 'release', 'visible') && <ViewRelease release={release} />}
      {canDoAction(token.role, token.permissions, 'release', 'update') && <UpdateRelease release={release} setData={setData} getReleases={getReleases} currentPage={currentPage} />}
      {canDoAction(token.role, token.permissions, 'release', 'delete') && (
        <DeleteRelease release={release} getRelease={getReleases} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
      )}
      {canDoAction(token.role, token.permissions, 'release', 'print') && <PrintRelease release={release} />}
      {canDoAction(token.role, token.permissions, 'release', 'export') && <ExportRelease release={release} />}
    </div>
    // <>
    //   <IonButton fill="clear" id={`release-${release._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
    //     <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
    //   </IonButton>
    //   <IonPopover showBackdrop={false} trigger={`release-${release._id}`} triggerAction="click" className="[--max-width:11rem]">
    //     <IonContent class="[--padding-top:0.5rem] [--padding-bottom:0.5rem]">
    //       {canDoAction(token.role, token.permissions, 'release', 'visible') && <ViewRelease release={release} />}
    //       {canDoAction(token.role, token.permissions, 'release', 'update') && <UpdateRelease release={release} setData={setData} />}
    //       {canDoAction(token.role, token.permissions, 'release', 'delete') && (
    //         <DeleteRelease release={release} getRelease={getReleases} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
    //       )}
    //       {canDoAction(token.role, token.permissions, 'release', 'print') && <PrintRelease release={release} />}
    //       {canDoAction(token.role, token.permissions, 'release', 'export') && <ExportRelease release={release} />}
    //       {/* <UpdateCVExpenseVoucher index={index} /> */}
    //     </IonContent>
    //   </IonPopover>
    // </>
  );
};

export default ReleaseActions;
