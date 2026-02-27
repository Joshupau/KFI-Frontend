import React, { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { eye } from 'ionicons/icons';
import { Acknowledgement } from '../../../../../types/types';
import { formatDateTable } from '../../../../utils/date-utils';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import AcknowledgementViewCard from '../components/AcknowledgementViewCard';
import ViewAcknowledgementEntries from '../components/ViewAcknowledgementEntries';

type ViewAcknowledgementProps = {
  acknowledgement: Acknowledgement;
};

const ViewAcknowledgement = ({ acknowledgement }: ViewAcknowledgementProps) => {
  const [isOpen, setIsOpen] = useState(false);

  function dismiss() {
    setIsOpen(false);
  }

  return (
    <>
      {/* <div className="text-end">
        <div
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={eye} className="text-[1rem]" /> View
        </div>
      </div> */}
      <IonButton
        onClick={() => setIsOpen(true)}
        type="button"
        fill="clear"
        className="space-x-1 rounded-md w-20 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-orange-100 text-orange-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={eye} className="text-xs" />
        <span>View</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:74rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Official Receipt - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content max-h-[90%] h-full !p-6 flex flex-col gap-2">
            <ModalHeader title="Official Receipt - View Record" sub="Manage official reciept." dismiss={dismiss} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 !mt-4">
              <div className="space-y-1">
                <AcknowledgementViewCard label="OR#" value={`${acknowledgement.code}`} labelClassName="min-w-28 text-end " />
                <AcknowledgementViewCard label="Center Code" value={`${acknowledgement.center.centerNo}`} labelClassName="min-w-28 text-end " />
                <AcknowledgementViewCard label="Name" value={`${acknowledgement.center.description}`} labelClassName="min-w-28 text-end" />
                <AcknowledgementViewCard label="Cash Type" value={acknowledgement.type} labelClassName="min-w-28 text-end " />
              </div>
              <div className="space-y-1">
                <AcknowledgementViewCard label="Date" value={formatDateTable(acknowledgement.date)} labelClassName="min-w-28 text-end " />
                <AcknowledgementViewCard label="Account Month" value={`${acknowledgement.acctMonth}`} labelClassName="min-w-28 text-end " />
                <AcknowledgementViewCard label="Account Year" value={`${acknowledgement.acctYear}`} labelClassName="min-w-28 text-end " />
                <AcknowledgementViewCard label="Account Officer" value={acknowledgement.acctOfficer} labelClassName="min-w-28 text-end" />
              </div>
           

            
            <div className="space-y-1">
              <AcknowledgementViewCard label="Check Number" value={acknowledgement.checkNo} labelClassName="min-w-28 text-end " />
              <AcknowledgementViewCard label="Check Date" value={formatDateTable(acknowledgement.checkDate)} labelClassName="min-w-28 text-end " />
              <AcknowledgementViewCard label="Bank Code" value={acknowledgement.bankCode.code} labelClassName="min-w-28 text-end " />
              <AcknowledgementViewCard label="Amount" value={`${formatNumber(acknowledgement.amount)}`} labelClassName="min-w-28 text-end" />
              <AcknowledgementViewCard
                label="Cash Collection"
                value={`${formatNumber(acknowledgement.cashCollectionAmount || 0)}`}
                labelClassName="min-w-28 text-end "
              />
            </div>

             <div className=" lg:col-span-3 space-y-1 ">
                <AcknowledgementViewCard label="Particular" value={acknowledgement.remarks} labelClassName="min-w-28 text-end " />

                <AcknowledgementViewCard label="User" value={acknowledgement.encodedBy.username} labelClassName=" min-w-28 text-end" containerClassName="" />


              </div>
          </div>
          {/* <div>
            <AcknowledgementViewCard label="User" value={acknowledgement.encodedBy.username} labelClassName=" w-24 text-end !text-slate-600" containerClassName="max-w-40" />
          </div> */}
          <div className="flex-1">
            <ViewAcknowledgementEntries acknowledgement={acknowledgement} isOpen={isOpen} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewAcknowledgement;
