import React, { useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { NatureFormData, natureSchema } from '../../../../../validations/nature.schema';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';
import FinancialStatementForm from './begbalance-form';
import { fschema, FSFormData } from '../../../../../validations/financialstatement.schema';
import TBForm from './begbalance-form';
import { tbchema, TBFormData } from '../../../../../validations/trial-balance-schema';
import BegBalanceForm from './begbalance-form';
import { begbalancechema, BegBalanceFormData } from '../../../../../validations/beginningbalance.schema';
import FormTable from '../components/entry-table';
import { removeAmountComma } from '../../../../ui/utils/formatNumber';

type CreateProps = {
  getList: (page: number) => void;
};

const Create = ({ getList }: CreateProps) => {
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);
  const online = useOnlineStore((state) => state.online);
  const [present] = useIonToast();
  
  
  const form = useForm<BegBalanceFormData>({
    resolver: zodResolver(begbalancechema),
    defaultValues: {
    memo:"Memo"
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: BegBalanceFormData) {
      setLoading(true);

      const formattedEntries = data.entries.map((entry, index) => {
        return {
            line: index + 1,
            acctCodeId: entry.acctCodeId,
            debit: removeAmountComma(entry.debit),
            credit: removeAmountComma(entry.credit),
        };
        });
      try {
        const result = await kfiAxios.post('/beginning-balance', {...data, entries: formattedEntries,});
        const { success } = result.data;
        if (success) {
          getList(1);
           present({
          message: 'Record successfully created. ',
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
          present({
           message: error.response.data.error.formErrors[0].msgs,
           duration: 1200,
         });

        console.log(error)
      } finally {
        setLoading(false);
      }
    
  }

  return (
    <>
      <div className="text-end">
        <IonButton fill="clear" id="create-bb-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          + Add
        </IonButton>
      </div>
      <IonModal
        ref={modal}
        trigger="create-bb-modal"
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--width:95%] [--max-width:64rem]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Nature - Add Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="p-6 flex flex-col gap-6">
           <ModalHeader disabled={loading} title="Beggining Balance - Add Record" sub="Manage trial balance data." dismiss={dismiss} />
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

export default Create;
