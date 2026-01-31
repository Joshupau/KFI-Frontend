import { IonButton, IonContent, IonPage, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { weeklyCollectionSchema, WeeklyCollectionFormData } from '../../../../validations/weekly-collection.schema';
import InputText from '../../../ui/forms/InputText';
import { TErrorData, TFormError } from '../../../../types/types';
import checkError from '../../../utils/check-error';
import formErrorHandler from '../../../utils/form-error-handler';
import kfiAxios from '../../../utils/axios';
import { FileExportIcon } from 'hugeicons-react';
import InputRadio from '../../../ui/forms/InputRadio';
import InputCheckbox from '../../../ui/forms/InputCheckbox';
import CenterSelection from '../../../ui/selections/CenterSelection';

const WeeklyCollection = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<WeeklyCollectionFormData>({
    resolver: zodResolver(weeklyCollectionSchema) as any,
    defaultValues: {
      centerNo: '',
      centerId: '',
      loanReleaseDate: '',
      dueDate: '',
      weekNoFrom: '',
      weekNoTo: '',
      multi: false,
      basedOn: 'actual',
      newFormat: true,
      cbuOption: 'gross',
      includeResigned: false,
      excludeDamayan: false,
      balanceBasis: 'selectedWeek',
      type: 'print'
    },
  });

  async function onSubmit(data: WeeklyCollectionFormData) {
    setLoading(true);

    const queryData: any = {
      loanReleaseDate: data.loanReleaseDate,
      dueDate: data.dueDate,
      weekNoFrom: data.weekNoFrom,
      weekNoTo: data.weekNoTo,
      multi: data.multi,
      basedOn: data.basedOn,
      newFormat: data.newFormat,
      cbuOption: data.cbuOption,
      includeResigned: data.includeResigned,
      excludeDamayan: data.excludeDamayan,
      balanceBasis: data.balanceBasis,
    };

    // Only include centerNo when multi is false
    if (!data.multi && data.centerNo) {
      queryData.centerNo = data.centerNo.trim().split(/\s+/)[0];
    }

    try {
      if (data.type === 'print') {
        const result = await kfiAxios.get('/transaction/print/weekly-collection', {
          params: queryData,
          responseType: 'blob',
        });

        const pdfBlob = new Blob([result.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

        setLoading(false);
      } else if (data.type === 'export') {
        const result = await kfiAxios.get('/transaction/export/weekly-collection', {
          params: queryData,
          responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([result.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'weekly-collection.xlsx';
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
          <PageTitle pages={['General Ledger', 'Weekly Collection']} />
          <div className="px-3 pb-3 flex-1">
            <div className="relative overflow-auto">
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 bg-white p-4 w-full max-w-md rounded-md shadow-md">
                
                  <div className="w-full flex gap-2 p-4 border border-zinc-200 rounded-md">
                    <InputCheckbox
                      control={form.control}
                      name="multi"
                      disabled={loading}
                      className="!w-4"
                    />
                    <p className="text-xs !w-full">Multi-Center Report</p>
                  </div>
                <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                  <div className="flex items-center gap-1">
                    <InputText
                      disabled={loading || form.watch('multi')}
                      readOnly
                      name="centerNo"
                      control={form.control}
                      clearErrors={form.clearErrors}
                      placeholder="Click find to search for center"
                      className="!px-2 !py-2 rounded-md"
                      label="Center No."
                      labelClassName="truncate !text-slate-600 min-w-28 text-end"
                    />
                    {!form.watch('multi') && (
                      <CenterSelection setValue={form.setValue} clearErrors={form.clearErrors} centerLabel={'centerNo'} centerValue={'centerId'} />
                    )}
                  </div>
                </div>

                <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                  <InputText
                    disabled={loading}
                    name="loanReleaseDate"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    placeholder="Select date"
                    type="date"
                    label="Loan Release Date"
                    className="!px-2 !py-2 rounded-md"
                    labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                  />
                  <InputText
                    disabled={loading}
                    name="dueDate"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    placeholder="Select date"
                    type="date"
                    label="Due date"
                    className="!px-2 !py-2 rounded-md"
                    labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                  />
                  <InputText
                    disabled={loading}
                    name="weekNoFrom"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    placeholder="From week number"
                    type="number"
                    label="Week No From"
                    className="!px-2 !py-2 rounded-md"
                    labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                  />
                  <InputText
                    disabled={loading}
                    name="weekNoTo"
                    control={form.control}
                    clearErrors={form.clearErrors}
                    placeholder="To week number"
                    type="number"
                    label="Week No To"
                    className="!px-2 !py-2 rounded-md"
                    labelClassName="!text-slate-600 truncate min-w-28 !text-sm text-end"
                  />
                </div>

                <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                  <InputRadio
                    control={form.control}
                    name="basedOn"
                    disabled={loading}
                    clearErrors={form.clearErrors}
                    options={[
                      { label: 'Based on Actual O.R.', value: 'actual' },
                      { label: 'Based on Projection', value: 'projection' },
                    ]}
                  />
                </div>

                <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                  <InputRadio
                    control={form.control}
                    name="cbuOption"
                    disabled={loading}
                    clearErrors={form.clearErrors}
                    options={[
                    //   { label: 'No CBU', value: 'none' },
                    //   { label: 'Include GROSS CBU and NET CBU', value: 'both' },
                      { label: 'Include GROSS CBU only', value: 'gross' },
                    //   { label: 'Include NET CBU only', value: 'net' },
                    ]}
                  />

                </div>

                <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                  <p className="text-sm !font-semibold">PREVIOUS BALANCE BASIS</p>
                  <InputRadio
                    control={form.control}
                    name="balanceBasis"
                    disabled={loading}
                    clearErrors={form.clearErrors}
                    options={[
                      { label: 'As of Selected Week', value: 'selectedWeek' },
                      { label: 'Current Balance', value: 'current' },
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
                    {loading ? 'Loading...' : `${form.watch('type') === 'print' ? 'Print' : 'Export'}`}
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

export default WeeklyCollection;