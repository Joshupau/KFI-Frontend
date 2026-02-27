import React, { useEffect, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { createSharp } from 'ionicons/icons';
import { Acknowledgement, AcknowledgementEntry, TErrorData, TFormError } from '../../../../../types/types';
import { formatDateInput } from '../../../../utils/date-utils';
import kfiAxios from '../../../../utils/axios';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { TData } from '../Acknowledgement';
import { AcknowledgementFormData, acknowledgementSchema } from '../../../../../validations/acknowledgement.schema';
import AcknowledgementForm from '../components/AcknowledgementForm';
import UpdateAcknowledgementEntries from '../components/UpdateAcknowledgementEntries';
import { formatAmount, removeAmountComma } from '../../../../ui/utils/formatNumber';
import Signatures from '../../../../ui/common/Signatures';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';

type UpdateAcknowledgementProps = {
  acknowledgement: Acknowledgement;
  setData: React.Dispatch<React.SetStateAction<TData>>;
   currentPage: number,
  getAcknowledgement: (page: number, keyword?: string, sort?: string) => void;
};

const UpdateAcknowledgement = ({ acknowledgement, setData, currentPage, getAcknowledgement }: UpdateAcknowledgementProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<AcknowledgementEntry[]>(acknowledgement.entries || []);
  const [preventries, setPrevEntries] = useState<AcknowledgementEntry[]>(acknowledgement.entries || []);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const online = useOnlineStore((state) => state.online);
  
  

  const form = useForm<AcknowledgementFormData>({
    resolver: zodResolver(acknowledgementSchema),
    defaultValues: {
      code: '',
      center: '',
      centerLabel: '',
      centerName: '',
      refNo: '',
      remarks: '',
      date: formatDateInput(new Date().toISOString()),
      acctMonth: `${new Date().getMonth() + 1}`,
      acctYear: `${new Date().getFullYear()}`,
      acctOfficer: '',
      checkNo: '',
      checkDate: '',
      type: '',
      bankCode: '',
      bankCodeLabel: '',
      amount: '',
      cashCollection: '',
      mode: 'update',
    },
  });

  useEffect(() => {
    if (acknowledgement) {
      form.reset({
        code: acknowledgement.code,
        center: acknowledgement.center._id,
        centerLabel: acknowledgement.center.centerNo,
        centerName: acknowledgement.center.description,
        refNo: acknowledgement.refNo,
        remarks: acknowledgement.remarks,
        date: formatDateInput(acknowledgement.date),
        acctMonth: `${acknowledgement.acctMonth}`,
        acctYear: `${acknowledgement.acctYear}`,
        acctOfficer: acknowledgement.acctOfficer,
        checkNo: acknowledgement.checkNo,
        checkDate: formatDateInput(acknowledgement.checkDate),
        type: acknowledgement.type,
        bankCode: acknowledgement.bankCode._id,
        bankCodeLabel: `${acknowledgement.bankCode.code}`,
        amount: `${formatAmount(acknowledgement.amount)}`,
        cashCollection: `${acknowledgement.cashCollectionAmount || 0}`,
        mode: 'update',
      });
    }
  }, [acknowledgement, form]);

  function dismiss() {
    form.reset();
    setIsOpen(false);
    setDeletedIds([])
  }

  function normalizeCVNumber(cv: string): string {
  if (!cv) return "";

  return cv.replace(/^(CV#)+/, "CV#");
}

function removeCVTag(cv: string): string {
  if (!cv) return "";
  return cv.replace(/CV#/g, "");
}




  async function onSubmit(data: AcknowledgementFormData) {
     const finalDeletedIds = deletedIds.filter((id) =>
        preventries.some((e) => e._id === id)
        );

        const prevIds = new Set(preventries.map((e) => e._id));

        const formattedEntries = entries.map((entry, index) => {
          const isExisting = prevIds.has(entry._id);
          return {
              _id: isExisting ? entry._id : undefined,
              loanReleaseEntryId: entry.loanReleaseEntryId._id,
              cvNo: normalizeCVNumber(entry.cvNo),
              dueDate: acknowledgement.date,
              noOfWeeks: entry.loanReleaseEntryId.transaction.noOfWeeks,
              name: entry.loanReleaseEntryId.client.name,
              particular: entry.particular,
              acctCodeId: entry.acctCode._id,
              acctCode: entry.acctCode.code ?? '',
              description: entry.acctCode.description ?? '',
              debit: entry.debit?.toString() ?? "",
              credit: entry.credit?.toString() ?? "",
              line: index + 1,
            
          };
        });
        data.amount = removeAmountComma(data.amount);
        data.cashCollection = data.cashCollection !== '' ? removeAmountComma(data.cashCollection as string) : data.cashCollection;
    if(online){
      setLoading(true);
      try {

       
        const result = await kfiAxios.put(`/acknowledgement/${acknowledgement._id}`, {...data, entries: formattedEntries, deletedIds: finalDeletedIds});
        const { success, acknowledgement: updatedAcknowledgement } = result.data;
        if (success) {
          setData(prev => {
            const index = prev.acknowledgements.findIndex(acknowledgement => acknowledgement._id === updatedAcknowledgement._id);
            if (index < 0) return prev;
            prev.acknowledgements[index] = { ...updatedAcknowledgement };
            return { ...prev };
          });
          present({
            message: 'Official Receipt successfully updated.',
            duration: 1000,
          });
          dismiss()
          return;
        }
        present({
          message: 'Failed to update the official receipt',
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
       const existing = await db.officialReceipts.get(acknowledgement.id);
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
        await db.officialReceipts.update(acknowledgement.id, updated);
        getAcknowledgement(currentPage)
       

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

  console.log(form.formState.errors)

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
        className=" [--border-radius:0.35rem] auto-height [--max-width:74rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Official Receipt - Edit Record" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content max-h-[90%] h-full !p-6 flex flex-col">
            <ModalHeader title="Official Receipt - Edit Record" sub="Manage official reciept." dismiss={dismiss} />

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <AcknowledgementForm form={form} loading={loading} />
            </div>
            <div className="text-end space-x-1 px-2 pb-2">
              <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                {loading ? 'Saving...' : 'Save Changes'}
              </IonButton>
            </div>
          </form>

            {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}

          <div className="border-t border-t-slate-400 mx-2 pt-5 flex-1">
            <UpdateAcknowledgementEntries isOpen={isOpen} acknowledgement={acknowledgement} entries={entries} setEntries={setEntries} deletedIds={deletedIds} setDeletedIds={setDeletedIds} setPrevEntries={setPrevEntries} />
          </div>

          <Signatures open={isOpen} type={'official receipt'}/>
          
        </div>
      </IonModal>
    </>
  );
};

export default UpdateAcknowledgement;
