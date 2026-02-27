import React, { useEffect, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { createSharp } from 'ionicons/icons';
import { ExpenseVoucherFormData, expenseVoucherSchema, UpdateExpenseVoucherFormData, updateExpenseVoucherSchema } from '../../../../../validations/expense-voucher.schema';
import { ExpenseVoucher, ExpenseVoucherEntry, TErrorData, TFormError } from '../../../../../types/types';
import { TData } from '../ExpenseVoucher';
import { formatDateInput } from '../../../../utils/date-utils';
import ExpenseVoucherForm from '../components/ExpenseVoucherForm';
import UpdateExpenseVoucherEntries from '../components/UpdateExpenseVoucherEntries';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { formatAmount, removeAmountComma } from '../../../../ui/utils/formatNumber';
import Signatures from '../../../../ui/common/Signatures';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';

type UpdateExpenseVoucherProps = {
  expenseVoucher: ExpenseVoucher;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  currentPage: number,
  getExpenseVouchers: (page: number, keyword?: string, sort?: string) => void;
};

const UpdateExpenseVoucher = ({ expenseVoucher, setData, getExpenseVouchers, currentPage }: UpdateExpenseVoucherProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<ExpenseVoucherEntry[]>(expenseVoucher.entries || []);
  const [preventries, setPrevEntries] = useState<ExpenseVoucherEntry[]>(expenseVoucher.entries || []);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const online = useOnlineStore((state) => state.online);
  
  const form = useForm<UpdateExpenseVoucherFormData>({
    resolver: zodResolver(updateExpenseVoucherSchema),
    defaultValues: {
      code: '',
      supplier: '',
      supplierId: '',
      refNo: '',
      remarks: '',
      date: formatDateInput(new Date().toISOString()),
      acctMonth: `${new Date().getMonth() + 1}`,
      acctYear: `${new Date().getFullYear()}`,
      checkNo: '',
      checkDate: '',
      bank: '',
      bankLabel: '',
      amount: '0',
    },
  });

  useEffect(() => {
    if (expenseVoucher) {
      form.reset({
        code: expenseVoucher.code,
        supplier: `${expenseVoucher.supplier}`,
        supplierId: expenseVoucher.supplier,
        refNo: expenseVoucher.refNo,
        remarks: expenseVoucher.remarks,
        date: formatDateInput(expenseVoucher.date),
        acctMonth: `${expenseVoucher.acctMonth}`,
        acctYear: `${expenseVoucher.acctYear}`,
        checkNo: `${expenseVoucher.checkNo}`,
        checkDate: formatDateInput(expenseVoucher.checkDate),
        bank: expenseVoucher.bankCode._id,
        bankLabel: `${expenseVoucher.bankCode.code}`,
        amount: `${formatAmount(expenseVoucher.amount)}`,
        
      });
    }
  }, [expenseVoucher, form]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
    setDeletedIds([])
  }

  async function onSubmit(data: UpdateExpenseVoucherFormData) {
        data.amount = removeAmountComma(data.amount);

      const finalDeletedIds = deletedIds.filter((id) =>
          preventries.some((e) => e._id === id)
          );

        const prevIds = new Set(preventries.map((e) => e._id));

        const formattedEntries = entries.map((entry, index) => {
          const isExisting = prevIds.has(entry._id);
          return {
            line: index + 1 ,
            _id: isExisting ? entry._id : undefined,
            client: entry.client?._id ?? "",
            clientLabel: entry.client.name ?? "",
            particular: entry.particular,
            acctCodeId: entry.acctCode?._id ?? "",
            acctCode: entry.acctCode?.code ?? "",
            description: entry.acctCode?.description ?? "",
            debit: entry.debit?.toString() ?? "",
            credit: entry.credit?.toString() ?? "",
            cvForRecompute: entry.cvForRecompute
          };
        });


   if(online){
     setLoading(true);
      try {

      
        const result = await kfiAxios.put(`/expense-voucher/${expenseVoucher._id}`, {...data, entries: formattedEntries,deletedIds: finalDeletedIds});
        const { success, expenseVoucher: updatedExpenseVoucher } = result.data;
        if (success) {
          setData(prev => {
            const index = prev.expenseVouchers.findIndex(expenseVoucher => expenseVoucher._id === updatedExpenseVoucher._id);
            if (index < 0) return prev;
            prev.expenseVouchers[index] = { ...updatedExpenseVoucher };
            return { ...prev };
          });
          present({
            message: 'Expense voucher successfully updated.',
            duration: 1000,
          });
          dismiss()
          return;
        }
        present({
          message: 'Failed to update the expense voucher',
          duration: 1000,
        });
      } catch (error: any) {
        const errs: TErrorData | string = error?.response?.data?.error || error?.response?.data?.msg || error.message;
        const errors: TFormError[] | string = checkError(errs);
        const fields: string[] = Object.keys(form.formState.defaultValues as Object);
        formErrorHandler(errors, form.setError, fields);
      } finally {
        setLoading(false);
      }
   } else {
    try {

       const existing = await db.expenseVouchers.get(expenseVoucher.id);
        if (!existing) {
          console.log("Data not found");
          return;
        }
        const updated = {
          ...data,
          entries: entries, 
          deletedIds: finalDeletedIds,
          _synced: false,
          action: "update",
        };

        console.log('Form Data',updated)
        await db.expenseVouchers.update(expenseVoucher.id, updated);
        getExpenseVouchers(currentPage)
        // setData(prev => {
        //   const clone = [...prev.expenseVouchers];
        //   const index = clone.findIndex(c => c.id === expenseVoucher.id);
        //   if (index !== -1) {
        //     clone[index] = {
        //       ...clone[index],  
        //       ...data,
        //       entries: entries,
              
        //     };
        //   }
        //   return { ...prev, expenseVouchers: clone };
        // });

        dismiss();
        present({
          message: "Data successfully updated!",
          duration: 1000,
        });
      } catch (error: any) {
        console.log(error)
         const errs: TErrorData | string = error?.response?.data?.error || error?.response?.data?.msg || error.message;
        const errors: TFormError[] | string = checkError(errs);
        const fields: string[] = Object.keys(form.formState.defaultValues as Object);
        formErrorHandler(errors, form.setError, fields);
        present({
          message: "Failed to save record. Please try again.",
          duration: 1200,
        });

      }
   }
  }

  return (
    <>
      {/* <div className="text-end">
        <div
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div> */}
      <IonButton
        onClick={() => setIsOpen(true)}
        type="button"
        fill="clear"
        className="space-x-1 rounded-md w-16 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-blue-50 text-blue-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={createSharp} className="text-xs" />
        <span>Edit</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:74rem] [--width:100%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Expense Voucher - Edit Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content max-h-[90%] h-full !p-6 flex flex-col">
            <ModalHeader title="Expense Voucher - Edit Record" sub="Manage expense voucher." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(onSubmit)} className=' mt-4'>
            <div>
              <ExpenseVoucherForm form={form} loading={loading} />
            </div>

            <div className="text-end space-x-1 px-2 pb-2">
              <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                {loading ? 'Saving...' : 'Save Changes'}
              </IonButton>
            </div>

            {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}

          </form>
          <div className="border-t border-t-slate-200 mt-2 flex-1 py-2">
            <UpdateExpenseVoucherEntries isOpen={isOpen} expenseVoucher={expenseVoucher} entries={entries} setEntries={setEntries} deletedIds={deletedIds} setDeletedIds={setDeletedIds} setPrevEntries={setPrevEntries}/>
          </div>
          <Signatures open={isOpen} type={'expense voucher'}/>
          
        </div>
      </IonModal>
    </>
  );
};

export default UpdateExpenseVoucher;
