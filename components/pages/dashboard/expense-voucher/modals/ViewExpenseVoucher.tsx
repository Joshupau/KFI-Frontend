import React, { useRef, useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonText, IonButton } from '@ionic/react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { eye } from 'ionicons/icons';
import ExpenseVoucherViewCard from '../components/ExpenseVoucherViewCard';
import { ExpenseVoucher } from '../../../../../types/types';
import { formatDateTable } from '../../../../utils/date-utils';
import { formatNumber } from '../../../../ui/utils/formatNumber';
import ViewExpenseVoucherEntries from '../components/ViewExpenseVoucherEntries';

type ViewExpenseVoucherType = {
  expenseVoucher: ExpenseVoucher;
};

const ViewExpenseVoucher = ({ expenseVoucher }: ViewExpenseVoucherType) => {
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
        type="button"
        onClick={() => setIsOpen(true)}
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
            <ModalHeader title="Expense Voucher - View Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6 max-h-[90%] h-full flex flex-col gap-2">
            <ModalHeader title="Expense Voucher - View Record" sub="Manage expense voucher." dismiss={dismiss} />

          <div className="space-y-1 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <ExpenseVoucherViewCard label="CV#" value={`${expenseVoucher.code}`} labelClassName=" text-xs" />
                <ExpenseVoucherViewCard label="Supplier" value={expenseVoucher.supplier} labelClassName=" text-xs" />
                 <ExpenseVoucherViewCard label="Date" value={formatDateTable(expenseVoucher.date)} labelClassName=" text-xs" />
                <ExpenseVoucherViewCard label="Account Month" value={`${expenseVoucher.acctMonth}`} labelClassName=" text-xs" />
                <ExpenseVoucherViewCard label="Account Year" value={`${expenseVoucher.acctYear}`} labelClassName=" text-xs" />
              </div>
              {/* <div className="space-y-1">
                <ExpenseVoucherViewCard label="Date" value={formatDateTable(expenseVoucher.date)} labelClassName=" text-xs" />
                <ExpenseVoucherViewCard label="Account Month" value={`${expenseVoucher.acctMonth}`} labelClassName=" text-xs" />
                <ExpenseVoucherViewCard label="Account Year" value={`${expenseVoucher.acctYear}`} labelClassName=" text-xs" />
              </div> */}
              <div className="space-y-1">
                <ExpenseVoucherViewCard label="Check Number" value={expenseVoucher.checkNo} labelClassName=" text-xs" />
                <ExpenseVoucherViewCard label="Check Date" value={formatDateTable(expenseVoucher.checkDate)} labelClassName=" text-xs" />
                <ExpenseVoucherViewCard label="Bank Code" value={expenseVoucher.bankCode.code} labelClassName=" text-xs" />
                <ExpenseVoucherViewCard label="Amount" value={`${formatNumber(expenseVoucher.amount)}`} labelClassName=" text-xs" />
              </div>
            </div>
            <div className="space-y-1">
              <ExpenseVoucherViewCard label="Remark" value={expenseVoucher.remarks} labelClassName="" />
              <ExpenseVoucherViewCard label="User" value={expenseVoucher.encodedBy.username} labelClassName="" containerClassName="" />
            </div>
          </div>
          <div className="flex-1 mt-2">
            <ViewExpenseVoucherEntries expenseVoucher={expenseVoucher} isOpen={isOpen} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewExpenseVoucher;
