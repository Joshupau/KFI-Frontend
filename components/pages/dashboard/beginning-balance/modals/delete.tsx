import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import { trashBin } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { BegBalance, FinancialStatements, Nature } from '../../../../../types/types';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';

type DeleteNatureProps = {
  item: BegBalance;
  getList: (page: number) => void;
  currentPage: number;
};

const Delete = ({item,getList,currentPage }: DeleteNatureProps) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);
  const online = useOnlineStore((state) => state.online);

  function dismiss() {
    modal.current?.dismiss();
  }

  async function handleDelete() {
      setLoading(true);
      try {
        const result = await kfiAxios.delete(`/beginning-balance/${item._id}`);
        const { success } = result.data;
        if (success) {
            getList(currentPage)
            present({
          message: 'Record successfully deleted. ',
          duration: 1000,
        });
          dismiss();
          return;
        }
      } catch (error: any) {
        present({
          message: 'Failed to delete the record. Please try again',
          duration: 1000,
        });
      } finally {
        setLoading(false);
      }
   
  }


  return (
    <>
      
        <IonButton
               id={`delete-bb-modal-${item._id}`}
               type="button"
               fill="clear"
               className="space-x-1 rounded-md w-24 min-h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0] bg-red-100 text-red-900 capitalize text-xs"
             >
               <IonIcon icon={trashBin} className="text-[1rem] mr-1" /> Delete
             </IonButton>
      <IonModal
        ref={modal}
        trigger={`delete-bb-modal-${item._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--width:95%] [--max-width:32rem]"
      >
         <div className="p-6 flex flex-col gap-6">
           <ModalHeader disabled={loading} title="Beginning Balance - Delete Record" sub="Are you sure you want to delete this record?" dismiss={dismiss} />
          <p className="text-lg text-center py-5">Are you sure you want to delete this record?</p>
          <div className="text-end border-t mt-2 pt-1 space-x-2">
            <IonButton onClick={handleDelete} disabled={loading} color="danger" type="submit" className="!text-sm capitalize" strong={true}>
              {loading ? 'Deleting...' : 'Yes'}
            </IonButton>
            <IonButton disabled={loading} onClick={dismiss} color="tertiary" type="button" className="!text-sm capitalize" strong={true}>
              No
            </IonButton>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default Delete;
