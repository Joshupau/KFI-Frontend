import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateSupplier from '../modals/UpdateSupplier';
import DeleteSupplier from '../modals/DeleteSupplier';
import { AccessToken, Supplier } from '../../../../../types/types';
import { TSupplier } from '../Supplier';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import ViewSupplier from '../modals/ViewSupplier';

type SupplierActionsProps = {
  supplier: Supplier;
  setData: React.Dispatch<React.SetStateAction<TSupplier>>;
  getSuppliers: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const SupplierActions = ({ supplier, setData, currentPage, setCurrentPage, getSuppliers, searchKey, sortKey, rowLength }: SupplierActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  return (
    <div>
      {canDoAction(token.role, token.permissions, 'business supplier', 'visible') && <ViewSupplier supplier={supplier} />}
      {canDoAction(token.role, token.permissions, 'business supplier', 'update') && <UpdateSupplier supplier={supplier} setData={setData} />}
      {canDoAction(token.role, token.permissions, 'business supplier', 'delete') && (
        <DeleteSupplier supplier={supplier} getSuppliers={getSuppliers} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
      )}
    </div>
    // <>
    //   <IonButton fill="clear" id={`supplier-${supplier._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
    //     <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
    //   </IonButton>
    //   <IonPopover showBackdrop={false} trigger={`supplier-${supplier._id}`} triggerAction="click" className="[--max-width:10rem]">
    //     <IonContent>
    //       {canDoAction(token.role, token.permissions, 'business supplier', 'update') && <UpdateSupplier supplier={supplier} setData={setData} />}
    //       {canDoAction(token.role, token.permissions, 'business supplier', 'delete') && (
    //         <DeleteSupplier supplier={supplier} getSuppliers={getSuppliers} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
    //       )}
    //     </IonContent>
    //   </IonPopover>
    // </>
  );
};

export default SupplierActions;
