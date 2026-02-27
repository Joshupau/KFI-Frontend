import React, { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { eye } from 'ionicons/icons';
import { formatDateTable } from '../../../../utils/date-utils';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import { DamayanFund } from '../../../../../types/types';
import DamayanFundViewCard from '../components/DamayanFundViewCard';
import ViewDFEntries from '../components/ViewDFEntries';

const ViewDamayanFund = ({ damayanFund }: { damayanFund: DamayanFund }) => {
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
        className=" [--border-radius:0.35rem] auto-height [--max-width:84rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Damayan Fund - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content max-h-[90%] h-full !p-6 flex flex-col">
            <ModalHeader title="Damayan Fund - View Record" sub="Transaction" dismiss={dismiss} />

          
          <div className="space-y-1 mb-1 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-y-1">
                <div className="space-y-1">
                  <DamayanFundViewCard label="JV#" value={`${damayanFund.code}`} labelClassName="min-w-24 text-end" />
                  <DamayanFundViewCard label="Center Code" value={damayanFund?.center?.description} labelClassName="min-w-24 text-end" />
                </div>
                <div className="space-y-1">
                  <DamayanFundViewCard label="Date" value={formatDateTable(damayanFund.date)} labelClassName="min-w-24 text-end" />
                  <DamayanFundViewCard label="Account Month" value={`${damayanFund.acctMonth}`} labelClassName="min-w-24 text-end" />
                  <DamayanFundViewCard label="Account Year" value={`${damayanFund.acctYear}`} labelClassName="min-w-24 text-end" />
                </div>
                 <div className="space-y-1">
                  <DamayanFundViewCard label="Check Number" value={damayanFund.checkNo} labelClassName="min-w-24 text-end" />
                  <DamayanFundViewCard label="Check Date" value={formatDateTable(damayanFund.checkDate)} labelClassName="min-w-24 text-end" />
                  <DamayanFundViewCard label="Bank Code" value={damayanFund.bankCode.code} labelClassName="min-w-24 text-end" />
                  <DamayanFundViewCard label="Amount" value={`${formatNumber(damayanFund.amount)}`} labelClassName="min-w-24 text-end" />
                </div>
                <div className=" lg:col-span-3 space-y-1">
                  <DamayanFundViewCard label="Particular" value={damayanFund.remarks} labelClassName="min-w-24 text-end" />
                   <DamayanFundViewCard label="User" value={damayanFund.encodedBy.username} labelClassName="min-w-24 text-end" containerClassName="" />

                </div>
              </div>
             
            {/* <div>
              <DamayanFundViewCard label="User" value={damayanFund.encodedBy.username} labelClassName="min-w-16 text-end !text-slate-600" containerClassName="" />
            </div> */}
          </div>
          <div className="flex-1 mt-4">
            <ViewDFEntries damayanFund={damayanFund} isOpen={isOpen} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewDamayanFund;
