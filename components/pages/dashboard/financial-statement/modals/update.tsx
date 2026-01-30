import React, { useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast, IonIcon } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { NatureFormData, natureSchema } from '../../../../../validations/nature.schema';
import kfiAxios from '../../../../utils/axios';
import { FinancialStatements, TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';
import FinancialStatementForm from './financial-statement-form';
import { fschema, FSFormData } from '../../../../../validations/financialstatement.schema';
import { TFS } from '../FinancialStatement';
import { createSharp } from 'ionicons/icons';

type UpdateProps = {
    item: FinancialStatements
    currentPage: number
    getList: (page: number) => void;
};

const UpdateFS = ({ getList, item, currentPage }: UpdateProps) => {
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);
  const online = useOnlineStore((state) => state.online);
  const [present] = useIonToast();
  
  
  const form = useForm<FSFormData>({
    resolver: zodResolver(fschema),
    defaultValues: {
    primaryYear: String(item.primary.year),
    primaryMonth: String(item.primary.month),
    type: item.type,
    secondaryMonth: String(item.secondary?.year ?? ''),
    secondaryYear: String(item.secondary?.year ?? ''),
    reportCode: item.reportCode,
    reportName: item.reportName
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: FSFormData) {
      setLoading(true);
      try {
        const result = await kfiAxios.put(`/financial-statement/${item._id}`, data);
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

  return (
    <>
      <div className="text-start">
        <IonButton fill="clear" id={`update-fs-modal-${item._id}`} 
        
       className="space-x-1 rounded-md w-24 min-h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0] bg-blue-100 text-blue-900 capitalize text-xs"
        >
        
                 <IonIcon icon={createSharp} className="text-[1rem] mr-1" /> Edit
        </IonButton>
      </div>
      <IonModal
        ref={modal}
        trigger={`update-fs-modal-${item._id}`} 
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--width:95%] [--max-width:32rem]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Nature - Add Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="p-6 flex flex-col gap-6">
           <ModalHeader disabled={loading} title="Financial Statement - Add Record" sub="Manage financial data." dismiss={dismiss} />
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FinancialStatementForm form={form} loading={loading} />
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

export default UpdateFS;
