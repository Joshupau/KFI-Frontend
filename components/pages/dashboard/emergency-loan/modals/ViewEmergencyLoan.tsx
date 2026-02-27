import React, { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { eye } from 'ionicons/icons';
import JournalVoucherViewCard from '../components/EmergencyLoanViewCard';
import { formatDateTable } from '../../../../utils/date-utils';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import { EmergencyLoan } from '../../../../../types/types';
import ViewELEntries from '../components/ViewELEntries';

const ViewEmergencyLoan = ({ emergencyLoan }: { emergencyLoan: EmergencyLoan }) => {
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
            <ModalHeader title="Emergency Loan - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content max-h-[90%] h-full !p-6 flex flex-col">
            <ModalHeader title="Emergency Loan - View Record" sub="Transaction" dismiss={dismiss} />

          <div className="space-y-1 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <JournalVoucherViewCard label="CV#" value={`${emergencyLoan.code}`} labelClassName=" text-end" />
                  <JournalVoucherViewCard label="Center Code" value={emergencyLoan?.center?.centerNo || ''} labelClassName="m text-end" />
                </div>
                <div className="space-y-1">
                  <JournalVoucherViewCard label="Date" value={formatDateTable(emergencyLoan.date)} labelClassName="min-w-14 text-end " />
                  <JournalVoucherViewCard label="Account Month" value={`${emergencyLoan.acctMonth}`} labelClassName="min-w-20 text-end " />
                  <JournalVoucherViewCard label="Account Year" value={`${emergencyLoan.acctYear}`} labelClassName="min-w-20 text-end " />
                </div>
               
                 <div className="space-y-1">
                  <JournalVoucherViewCard label="Check Number" value={emergencyLoan.checkNo} labelClassName="min-w-20 text-end" />
                  <JournalVoucherViewCard label="Check Date" value={formatDateTable(emergencyLoan.checkDate)} labelClassName="min-w-20 text-end" />
                  <JournalVoucherViewCard label="Bank Code" value={emergencyLoan.bankCode.code} labelClassName="min-w-20 text-end" />
                  <JournalVoucherViewCard label="Amount" value={`${formatNumber(emergencyLoan.amount)}`} labelClassName="min-w-20 text-end" />
                </div>

                 <div className=" space-y-1 lg:col-span-3">
                  <JournalVoucherViewCard label="Particular" value={emergencyLoan.remarks} labelClassName="min-w-14 text-end" />
                  <JournalVoucherViewCard label="User" value={emergencyLoan.encodedBy?.username} labelClassName="min-w-14 text-end" containerClassName="" />
                </div>
              </div>
             
            {/* <div className="">
              <JournalVoucherViewCard label="User" value={emergencyLoan.encodedBy.username} labelClassName="min-w-14 text-end !text-slate-600" containerClassName="" />
            </div> */}
          </div>
          <div className="flex-1 mt-4">
            <ViewELEntries emergencyLoan={emergencyLoan} isOpen={isOpen} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewEmergencyLoan;
