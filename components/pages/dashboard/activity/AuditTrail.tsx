import { IonButton, IonContent, IonPage, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GLFormData, glSchema } from '../../../../validations/gl.schema';
import InputText from '../../../ui/forms/InputText';
import { TErrorData, TFormError } from '../../../../types/types';
import checkError from '../../../utils/check-error';
import formErrorHandler from '../../../utils/form-error-handler';
import kfiAxios from '../../../utils/axios';
import { FileExportIcon } from 'hugeicons-react';
import InputRadio from '../../../ui/forms/InputRadio';
import ChartOfAccountSelection from '../../../ui/selections/ChartOfAccountSelection';
import InputCheckbox from '../../../ui/forms/InputCheckbox';

const Activity = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
   const form = useForm<GLFormData>({
      resolver: zodResolver(glSchema),
      defaultValues: {
        dateFrom:'',
        dateTo: '',
        codeFrom: '',
        codeTo: '',
        withBeginningBalance: false,
        type:'print'
      },
    });


    async function onSubmit(data: GLFormData) {
      setLoading(true)

      const queryData = {
        dateFrom: data.dateFrom,
        dateTo: data.dateTo,
        withBeginningBalance: data.withBeginningBalance,
        codeFrom: data.codeFrom.trim().split(/\s+/)[0],
        codeTo:  data.codeTo.trim().split(/\s+/)[0],
        year: new Date(data.dateFrom).getFullYear()
      }
       try {
        if(data.type === 'print'){
           const result = await kfiAxios.get('/report/print/gl/activity',
            {params: queryData, responseType: 'blob'}
           );

            const pdfBlob = new Blob([result.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
            setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

            setLoading(false)
        } else if(data.type === 'export'){
           const result = await kfiAxios.get('/report/export/gl/activity',
            {params: queryData, responseType: 'blob'}
           );

             const url = window.URL.createObjectURL(new Blob([result.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'activity.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);

            setLoading(false)
        }
          

        } catch (error: any) {
          setLoading(false)

          present({
            message: "No data found.",
            duration: 1200,
          });

          

          const errs: TErrorData | string = error?.response?.data?.error || error?.response?.data?.msg || error.message;
          const errors: TFormError[] | string = checkError(errs);
          const fields: string[] = Object.keys(form.formState.defaultValues as Object);
          formErrorHandler(errors, form.setError, fields);
        } finally {
        }
      }
  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <PageTitle pages={['General Ledger', 'Activity']} />
          <div className="px-3 pb-3 flex-1">
            <div className="relative overflow-auto">

              <form onSubmit={form.handleSubmit(onSubmit)} className=' flex flex-col gap-2 bg-white p-4 w-full max-w-md rounded-md shadow-md'>
                <p className=' text-lg !font-semibold'>Generate Report</p>
                <div className=' w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md'>
                  <p className=' text-sm !font-semibold'>Date</p>

                  <div className=' w-full flex items-center gap-2'>
                     <div className='flex flex-col gap-1 w-full'>
                      <p className=' text-xs !font-medium'>From</p>
                      <InputText
                        disabled={false}
                        name="dateFrom"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="Type here"
                        type='date'
                        className="!px-2 !py-2 rounded-md"
                        labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                      />

                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                      <p className=' text-xs !font-medium'>To</p>
                      <InputText
                        disabled={false}
                        name="dateTo"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="Type here"
                        type='date'
                        className="!px-2 !py-2 rounded-md"
                        labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                      />

                    </div>
                  </div>
                 
                </div>
                <div className=' w-full flex gap-2 p-4 border border-zinc-200 rounded-md'>

                  
                  <InputCheckbox
                      control={form.control}
                      name="withBeginningBalance"
                      disabled={loading}
                      className=' !w-4'
                      
                    
                    />
                  <p className=' text-xs !w-full'>Include Beg. Balance from totals</p>

                 
                </div>

                <div className=' w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md'>
                  <p className=' text-sm !font-semibold'>Code</p>

                  <div className=' w-full flex flex-col gap-2'>
                     <div className='flex flex-col gap-1 w-full'>
                      <p className=' text-xs !font-medium'>From</p>
                      <div className=' flex items-center gap-1'>
                        <InputText
                         disabled={loading}
                         readOnly
                         name="codeFrom"
                         control={form.control}
                         clearErrors={form.clearErrors}
                         placeholder="Click find to search for account code"
                         className="!px-2 !py-2 rounded-md"
                         labelClassName="truncate !text-slate-600 min-w-24 text-end"
                       />
                        <ChartOfAccountSelection setValue={form.setValue} clearErrors={form.clearErrors} chartOfAccountLabel={'codeFrom'} chartOfAccountValue={'acctCodeId'}                      
                        />
                      </div>
                     
                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                      <p className=' text-xs !font-medium'>To</p>
                      <div className=' flex items-center gap-1'>
                        <InputText
                         disabled={loading}
                         readOnly
                         name="codeTo"
                         control={form.control}
                         clearErrors={form.clearErrors}
                         placeholder="Click find to search for account code"
                         className="!px-2 !py-2 rounded-md"
                         labelClassName="truncate !text-slate-600 min-w-24 text-end"
                       />
                        <ChartOfAccountSelection setValue={form.setValue} clearErrors={form.clearErrors} chartOfAccountLabel={'codeTo'} chartOfAccountValue={'acctCodeId'}                      
                        />
                      </div>
                     
                    </div>
                  </div>
                 
                </div>

                <div className=' w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md'>
                  <p className=' text-sm !font-semibold'>Select</p>

                  <InputRadio
                    control={form.control}
                    name="type"
                    disabled={loading}
                    clearErrors={form.clearErrors}
                    options={[
                      { label: 'Print', value: 'print' },
                      { label: 'Export', value: 'export' },
                    ]}
                  />
                 
                </div>

                

                 

                <div className="text-end mt-6 space-x-2">
                  <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                    <FileExportIcon size={15} stroke='.8' className=' mr-1'/>
                    {loading ? 'Loading...' : `${form.watch('type') === 'print' ? 'Print' : 'Export'}`}
                  </IonButton>

                 
                
                </div>



              </form>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Activity;
