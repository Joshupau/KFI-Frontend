import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast, IonIcon } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { NatureFormData, natureSchema } from '../../../../../validations/nature.schema';
import kfiAxios from '../../../../utils/axios';
import { BegBalance, FinancialStatements, TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';
import FinancialStatementForm from './begbalance-form';
import { fschema, FSFormData } from '../../../../../validations/financialstatement.schema';
import { createSharp } from 'ionicons/icons';
import { tbchema, TBFormData } from '../../../../../validations/trial-balance-schema';
import TBForm from './begbalance-form';
import BegBalanceForm from './begbalance-form';
import { begbalancechema, BegBalanceFormData } from '../../../../../validations/beginningbalance.schema';
import FormTable from '../components/entry-table';
import { removeAmountComma } from '../../../../ui/utils/formatNumber';
import { watch } from 'fs';

type UpdateProps = {
    item: BegBalance
    currentPage: number
    getList: (page: number) => void;
};

const Update = ({ getList, item, currentPage }: UpdateProps) => {
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);
  const online = useOnlineStore((state) => state.online);
  const [present] = useIonToast();
  const [prevEntries, setPrevEntries] = useState<any[]>([]);
  
  
  
  const form = useForm<BegBalanceFormData>({
    resolver: zodResolver(begbalancechema),
    defaultValues: {
      memo: item.memo,
      
    },
  });

  function dismiss() {
    modal.current?.dismiss();
  }

  async function onSubmit(data: BegBalanceFormData) {
      setLoading(true);

       const currentIds = new Set(
        data.entries.map(e => e._id).filter(Boolean)
        );

        const finalDeletedIds: string[] = prevEntries
        .map(e => typeof e === 'string' ? e : e._id)
        .filter(id => !currentIds.has(id));

        const formattedEntries = data.entries.map((entry, index) => {
                return {
                    _id: entry._id ?? undefined,
                    line: index + 1,
                    acctCodeId: entry.acctCodeId,
                    debit: removeAmountComma(entry.debit),
                    credit: removeAmountComma(entry.credit),
                };
                });
      try {
        const result = await kfiAxios.put(`/beginning-balance/${item._id}`, {...data, deletedIds: finalDeletedIds, entries: formattedEntries});
        const { success } = result.data;
        if (success) {
            getList(currentPage)
             present({
          message: 'Record successfully updated. ',
          duration: 1000,
        });
          dismiss();
          return;
        }
      } catch (error: any) {
        const errs: TErrorData | string = error?.response?.data?.error || error.message;
        const errors: TFormError[] | string = checkError(errs);
        const fields: string[] = Object.keys(form.formState.defaultValues as Object);
        formErrorHandler(errors, form.setError, fields);
      } finally {
        setLoading(false);
      }
    
  }


   const getEntries = async () => {
            try {
              const result = await kfiAxios.get(`/beginning-balance/entries/${item._id}`);
  
              const { beginningBalanceEntries, success } = result.data as any
               const formattedEntries = beginningBalanceEntries.map((entry: any, index: number) => {
                  return {
                      _id: entry._id,
                      line:String(entry.line),
                      debit: String(entry.debit),
                      credit: String(entry.credit),
                      acctCodeId: entry.acctCode._id,
                      acctCodeLabel: entry.acctCode.code,
                      acctCodeDescription: `${entry.acctCode.code} - ${entry.acctCode.description}`,
                     
                  };
                  });
  
              form.setValue('entries',formattedEntries)
              setPrevEntries(formattedEntries)
            } catch (error) {
            } finally {
            }
          
      };

      useEffect(() => {
        form.setValue('year', String(item.year))
      },[item])

      console.log('from bb')


  return (
    <>
      <div className="text-start">
        <IonButton fill="clear"  id={`edit-bb-modal-${item._id}`}
        type='button'
        
       className="space-x-1 rounded-md w-24 min-h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0] bg-blue-100 text-blue-900 capitalize text-xs"
        >
        
          <IonIcon icon={createSharp} className="text-[1rem] mr-1" /> Edit
        </IonButton>
      </div>
      <IonModal
        ref={modal}
        trigger={`edit-bb-modal-${item._id}`}
        backdropDismiss={false}
        onWillPresent={getEntries}

        className=" [--border-radius:0.35rem] auto-height [--width:95%] [--max-width:64rem]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Nature - Add Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="p-6 flex flex-col gap-6">
           <ModalHeader disabled={loading} title="Beggining Balance - Edit Record" sub="Manage beggining balance data." dismiss={dismiss} />
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <BegBalanceForm form={form} loading={loading} />
              <FormTable form={form}/>
              
              <div className="text-end border-t mt-2 pt-1 space-x-2">
                <IonButton disabled={loading} color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
                  {loading ? 'Saving...' : 'Save'}
                </IonButton>
                <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                  Cancel
                </IonButton>
              </div>
            </form>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default Update;
