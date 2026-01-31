import { IonButton, IonContent, IonPage, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectedCollectionSchema, ProjectedCollectionFormData } from '../../../../validations/projected-collection.schema';
import InputText from '../../../ui/forms/InputText';
import { TErrorData, TFormError } from '../../../../types/types';
import checkError from '../../../utils/check-error';
import formErrorHandler from '../../../utils/form-error-handler';
import kfiAxios from '../../../utils/axios';
import { FileExportIcon } from 'hugeicons-react';
import InputRadio from '../../../ui/forms/InputRadio';
import CenterSelection from '../../../ui/selections/CenterSelection';

const ProjectedCollection = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<ProjectedCollectionFormData>({
    resolver: zodResolver(projectedCollectionSchema) as any,
    defaultValues: {
      startDate: '',
      dueDateFrom: '',
      dueDateTo: '',
      centerNo: '',
      centerId: '',
      accountOfficer: '',
      groupBy: 'ao',
      type: 'print'
    },
  });

  async function onSubmit(data: ProjectedCollectionFormData) {
    setLoading(true);

    const queryData: any = {
      startDate: data.startDate,
      dueDateFrom: data.dueDateFrom,
      dueDateTo: data.dueDateTo,
      accountOfficer: data.accountOfficer,
      groupBy: data.groupBy,
    };

    // Include centerNo if provided
    if (data.centerId) {
      queryData.centerNo = data.centerId;
    }

    try {
      if (data.type === 'print') {
        const result = await kfiAxios.post('/transaction/print/projected-collection', queryData, {
          responseType: 'blob',
        });

        const pdfBlob = new Blob([result.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

        setLoading(false);
      } else if (data.type === 'export') {
        const result = await kfiAxios.post('/transaction/export/projected-collection', queryData, {
          responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([result.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'projected-collection.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);

        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);

      present({
        message: 'No data found.',
        duration: 1200,
      });

      const errs: TErrorData | string = error?.response?.data?.error || error?.response?.data?.msg || error.message;
      const errors: TFormError[] | string = checkError(errs);
      const fields: string[] = Object.keys(form.formState.defaultValues as Object);
      formErrorHandler(errors, form.setError, fields);
    }
  }

  return (
    <IonPage className="w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <PageTitle pages={['General Ledger', 'Projected Collection']} />
          <div className="px-3 pb-3 flex-1">
            <div className="relative overflow-auto">
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 bg-white p-4 w-full max-w-md rounded-md shadow-md">
                
                <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                  <p className="text-sm !font-semibold">Range</p>
                  <InputText
                    disabled={loading}
                    name="startDate"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    placeholder="Select start date"
                    type="date"
                    label="Start Date"
                    className="!px-2 !py-2 rounded-md"
                    labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                  />
                </div>

                <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                  <p className="text-sm !font-semibold">Duedate</p>
                  <InputText
                    disabled={loading}
                    name="dueDateFrom"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    placeholder="Select from date"
                    type="date"
                    label="From"
                    className="!px-2 !py-2 rounded-md"
                    labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                  />
                  <InputText
                    disabled={loading}
                    name="dueDateTo"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    placeholder="Select to date"
                    type="date"
                    label="To"
                    className="!px-2 !py-2 rounded-md"
                    labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                  />
                </div>

                <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                  <p className="text-sm !font-semibold">Center</p>
                  <div className="flex items-center gap-1">
                    <InputText
                      disabled={loading}
                      readOnly
                      name="centerNo"
                      control={form.control}
                      clearErrors={form.clearErrors}
                      placeholder="Click search to find center"
                      className="!px-2 !py-2 rounded-md"
                      label="From"
                      labelClassName="truncate !text-slate-600 min-w-28 text-end"
                    />
                    <CenterSelection setValue={form.setValue} clearErrors={form.clearErrors} centerLabel={'centerNo'} centerValue={'centerId'} />
                  </div>
                </div>

                <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                  <InputText
                    disabled={loading}
                    name="accountOfficer"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    placeholder="Enter account officer"
                    type="text"
                    label="Account Officer"
                    className="!px-2 !py-2 rounded-md"
                    labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                  />
                </div>

                <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                  <InputRadio
                    control={form.control}
                    name="groupBy"
                    disabled={loading}
                    clearErrors={form.clearErrors}
                    options={[
                      { label: 'Group By AO', value: 'ao' },
                      { label: 'Group By Center AO', value: 'centerAo' },
                    ]}
                  />
                </div>

                <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                  <p className="text-sm !font-semibold">Select</p>
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

                <div className="flex gap-2 mt-6">
                  <IonButton disabled={loading} type="submit" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]">
                    <FileExportIcon size={15} stroke=".8" className="mr-1" />
                    {loading ? 'Loading...' : `${form.watch('type') === 'print' ? 'Preview Report' : 'Export'}`}
                  </IonButton>
                  <IonButton disabled={loading} type="button" fill="outline" className="!text-sm capitalize rounded-[4px]">
                    Close
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

export default ProjectedCollection;
