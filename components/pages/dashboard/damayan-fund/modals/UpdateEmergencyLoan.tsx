import React, { useEffect, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast, IonIcon } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { EmergencyLoanFormData, emergencyLoanSchema } from '../../../../../validations/emergency-loan.schema';
import kfiAxios from '../../../../utils/axios';
import { DamayanFund, DamayanFundEntry, TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { createSharp } from 'ionicons/icons';
import { TData } from '../DamayanFund';
import { formatDateInput } from '../../../../utils/date-utils';
import DamayanFundForm from '../components/DamayanFundForm';
import UpdateDFEntries from '../components/UpdateDFEntries';
import { DamayanFundFormData, damayanFundSchema } from '../../../../../validations/damayan-fund.schema';
import { formatAmount, removeAmountComma } from '../../../../ui/utils/formatNumber';
import Signatures from '../../../../ui/common/Signatures';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';

type UpdateDamayanFundProps = {
  damayanFund: DamayanFund;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  currentPage: number,
  getDamayanFunds: (page: number, keyword?: string, sort?: string) => void;
};

const UpdateDamayanFund = ({ damayanFund, setData, getDamayanFunds, currentPage }: UpdateDamayanFundProps) => {
  const [present] = useIonToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [entries, setEntries] = useState<DamayanFundEntry[]>(damayanFund.entries || []);
  const [preventries, setPrevEntries] = useState<DamayanFundEntry[]>(damayanFund.entries || []);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const online = useOnlineStore((state) => state.online);
    

  const form = useForm<DamayanFundFormData>({
    resolver: zodResolver(damayanFundSchema),
    defaultValues: {
      code: '',
      centerLabel: '',
      centerValue: '',
      refNo: '',
      remarks: '',
      date: formatDateInput(new Date().toISOString()),
      acctMonth: `${new Date().getMonth() + 1}`,
      acctYear: `${new Date().getFullYear()}`,
      checkNo: '',
      checkDate: '',
      bankCode: '',
      bankCodeLabel: '',
      amount: '0',
      mode: 'update',
      name: ''
    },
  });

  useEffect(() => {
    if (damayanFund) {
      form.reset({
        code: damayanFund.code,
        centerLabel: damayanFund?.center?.centerNo,
        centerValue: damayanFund?.center?._id,
        refNo: damayanFund.refNo,
        remarks: damayanFund.remarks,
        date: formatDateInput(damayanFund.date),
        acctMonth: `${damayanFund.acctMonth}`,
        acctYear: `${damayanFund.acctYear}`,
        checkNo: damayanFund.checkNo,
        checkDate: formatDateInput(damayanFund.checkDate),
        bankCode: damayanFund.bankCode._id,
        bankCodeLabel: `${damayanFund.bankCode.code}`,
        amount: `${formatAmount(damayanFund.amount)}`,
        mode: 'update',
        name: ''
      });
    }
  }, [damayanFund, form]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
    setDeletedIds([])
  }

  async function onSubmit(data: DamayanFundFormData) {
     const finalDeletedIds = deletedIds.filter((id) =>
        preventries.some((e) => e._id === id)
        );

        const prevIds = new Set(preventries.map((e) => e._id));

        const formattedEntries = entries.map((entry, index) => {
          const isExisting = prevIds.has(entry._id);
          return {
              _id: isExisting ? entry._id : undefined,
              client: entry.client._id,
              clientLabel: entry.client.name,
              particular: entry.particular,
              acctCodeId: entry.acctCode._id,
              acctCode: entry.acctCode.code,
              description: entry.acctCode.description,
              debit: entry.debit,
              credit: entry.debit,
            
          };
        });
        data.amount = removeAmountComma(data.amount);
    if(online){
      setLoading(true);
      try {
       
        const result = await kfiAxios.put(`damayan-fund/${damayanFund._id}`, {...data, entries: formattedEntries, deletedIds: finalDeletedIds});
        const { success, damayanFund: updatedDamayanFund } = result.data;
        if (success) {
          setData(prev => {
            const index = prev.damayanFunds.findIndex(damayanFund => damayanFund._id === updatedDamayanFund._id);
            if (index < 0) return prev;
            prev.damayanFunds[index] = { ...updatedDamayanFund };
            return { ...prev };
          });
          present({
            message: 'Damayan fund successfully updated.',
            duration: 1000,
          });
          dismiss()
          return;
        }
        present({
          message: 'Failed to update the damayan fund',
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
       const existing = await db.damayanFunds.get(damayanFund.id);
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
        await db.damayanFunds.update(damayanFund.id, updated);
        getDamayanFunds(currentPage)
       

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

  console.log(form.formState.errors, damayanFund)

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
        className=" [--border-radius:0.35rem] auto-height [--max-width:84rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Damayan Fund - Edit Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content max-h-[90%] h-full !p-6 flex flex-col">
          <ModalHeader disabled={loading} title="Damayan Fund - Edit Record" sub="Transaction" dismiss={dismiss} />
          <form onSubmit={form.handleSubmit(onSubmit)} className='mt-6'>
            <div className="mb-3">
              <DamayanFundForm form={form} loading={loading} />
            </div>
            <div className="text-end space-x-1 px-2 pb-2">
              <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                {loading ? 'Saving...' : 'Save'}
              </IonButton>
              <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                Cancel
              </IonButton>
            </div>
          </form>
          <div className="border-t border-t-slate-200 mx-2 pt-5 flex-1">
            <UpdateDFEntries isOpen={isOpen} damayanFund={damayanFund} entries={entries} setEntries={setEntries} deletedIds={deletedIds} setDeletedIds={setDeletedIds} setPrevEntries={setPrevEntries}  />
          </div>

          <Signatures open={isOpen} type={'damayan fund'}/>
          

            {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}

        </div>
      </IonModal>
    </>
  );
};

export default UpdateDamayanFund;
