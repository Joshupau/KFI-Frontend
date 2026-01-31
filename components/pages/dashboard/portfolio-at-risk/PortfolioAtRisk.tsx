import { IonButton, IonContent, IonPage, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { portfolioAtRiskSchema, PortfolioAtRiskFormData } from '../../../../validations/portfolio-at-risk.schema';
import InputText from '../../../ui/forms/InputText';
import { TErrorData, TFormError } from '../../../../types/types';
import checkError from '../../../utils/check-error';
import formErrorHandler from '../../../utils/form-error-handler';
import kfiAxios from '../../../utils/axios';
import { FileExportIcon, Search01Icon } from 'hugeicons-react';
import InputRadio from '../../../ui/forms/InputRadio';
import InputCheckbox from '../../../ui/forms/InputCheckbox';
import CenterSelection from '../../../ui/selections/CenterSelection';
import ClientSelection from '../../../ui/selections/ClientSelection';

const PortfolioAtRisk = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<PortfolioAtRiskFormData>({
    resolver: zodResolver(portfolioAtRiskSchema) as any,
    defaultValues: {
      customerNameFrom: '',
      customerIdFrom: '',
      customerNameTo: '',
      customerIdTo: '',
      centerNoFrom: '',
      centerIdFrom: '',
      centerNoTo: '',
      centerIdTo: '',
      loanReleaseDateFrom: '',
      loanReleaseDateTo: '',
      dateOfPaymentFrom: '',
      dateOfPaymentTo: '',
      centerOption: 'center',
      typeOfLoan: '',
      loanTypeId: '',
      parDateFrom: '',
      parDateTo: '',
      accountOfficer: '',
      accountOfficerId: '',
      lessThanAsOfDate: '',
      greaterThanAsOfDate: '',
      lessThanDays: '',
      greaterThanDays: '',
      weeklyCollection: false,
      withCBU: false,
      reportType: 'byCenter',
      type: 'print'
    },
  });

  async function onSubmit(data: PortfolioAtRiskFormData) {
    setLoading(true);

    const queryData: any = {
      customerNameFrom: data.customerNameFrom,
      customerIdFrom: data.customerIdFrom,
      customerNameTo: data.customerNameTo,
      customerIdTo: data.customerIdTo,
      centerNoFrom: data.centerNoFrom,
      centerIdFrom: data.centerIdFrom,
      centerNoTo: data.centerNoTo,
      centerIdTo: data.centerIdTo,
      loanReleaseDateFrom: data.loanReleaseDateFrom,
      loanReleaseDateTo: data.loanReleaseDateTo,
      dateOfPaymentFrom: data.dateOfPaymentFrom,
      dateOfPaymentTo: data.dateOfPaymentTo,
      centerOption: data.centerOption,
      typeOfLoan: data.typeOfLoan,
      loanTypeId: data.loanTypeId,
      parDateFrom: data.parDateFrom,
      parDateTo: data.parDateTo,
      accountOfficer: data.accountOfficer,
      accountOfficerId: data.accountOfficerId,
      lessThanAsOfDate: data.lessThanAsOfDate,
      greaterThanAsOfDate: data.greaterThanAsOfDate,
      lessThanDays: data.lessThanDays,
      greaterThanDays: data.greaterThanDays,
      weeklyCollection: data.weeklyCollection,
      withCBU: data.withCBU,
      reportType: data.reportType,
    };

    try {
      if (data.type === 'print') {
        const result = await kfiAxios.post('/transaction/print/portfolio-at-risk', queryData, {
          responseType: 'blob',
        });

        const pdfBlob = new Blob([result.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

        setLoading(false);
      } else if (data.type === 'export') {
        const result = await kfiAxios.post('/transaction/export/portfolio-at-risk', queryData, {
          responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([result.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio-at-risk.xlsx';
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
          <PageTitle pages={['General Ledger', 'Portfolio at Risk']} />
          <div className="px-3 pb-3 flex-1">
            <div className="relative overflow-auto">
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 bg-white p-6 w-full max-w-4xl rounded-md shadow-md">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="flex flex-col gap-4">
                    {/* Range - Customer */}
                    <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                      <p className="text-sm font-semibold mb-2">Range - Customer</p>
                      <div className="flex items-center gap-1">
                        <InputText
                          disabled={loading}
                          readOnly
                          name="customerNameFrom"
                          control={form.control}
                          clearErrors={form.clearErrors}
                          placeholder="From customer"
                          className="!px-2 !py-2 rounded-md"
                          label="From"
                          labelClassName="truncate !text-slate-600 min-w-20 text-end"
                        />
                        <ClientSelection 
                          setValue={form.setValue} 
                          clearErrors={form.clearErrors} 
                          clientLabel={'customerNameFrom'} 
                          clientValue={'customerIdFrom'} 
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <InputText
                          disabled={loading}
                          readOnly
                          name="customerNameTo"
                          control={form.control}
                          clearErrors={form.clearErrors}
                          placeholder="To customer"
                          className="!px-2 !py-2 rounded-md"
                          label="To"
                          labelClassName="truncate !text-slate-600 min-w-20 text-end"
                        />
                        <ClientSelection 
                          setValue={form.setValue} 
                          clearErrors={form.clearErrors} 
                          clientLabel={'customerNameTo'} 
                          clientValue={'customerIdTo'} 
                        />
                      </div>
                    </div>

                    {/* Center */}
                    <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                      <p className="text-sm font-semibold mb-2">Center</p>
                      <div className="flex items-center gap-1">
                        <InputText
                          disabled={loading}
                          readOnly
                          name="centerNoFrom"
                          control={form.control}
                          clearErrors={form.clearErrors}
                          placeholder="From center"
                          className="!px-2 !py-2 rounded-md"
                          label="From"
                          labelClassName="truncate !text-slate-600 min-w-20 text-end"
                        />
                        <CenterSelection 
                          setValue={form.setValue} 
                          clearErrors={form.clearErrors} 
                          centerLabel={'centerNoFrom'} 
                          centerValue={'centerIdFrom'} 
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <InputText
                          disabled={loading}
                          readOnly
                          name="centerNoTo"
                          control={form.control}
                          clearErrors={form.clearErrors}
                          placeholder="To center"
                          className="!px-2 !py-2 rounded-md"
                          label="To"
                          labelClassName="truncate !text-slate-600 min-w-20 text-end"
                        />
                        <CenterSelection 
                          setValue={form.setValue} 
                          clearErrors={form.clearErrors} 
                          centerLabel={'centerNoTo'} 
                          centerValue={'centerIdTo'} 
                        />
                      </div>
                    </div>

                    {/* Loan Release Date */}
                    <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                      <p className="text-sm font-semibold mb-2">Loan Release Date</p>
                      <InputText
                        disabled={loading}
                        name="loanReleaseDateFrom"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="From date"
                        type="date"
                        label="From"
                        className="!px-2 !py-2 rounded-md"
                        labelClassName="!text-slate-600 truncate min-w-20 !text-sm text-end"
                      />
                      <InputText
                        disabled={loading}
                        name="loanReleaseDateTo"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="To date"
                        type="date"
                        label="To"
                        className="!px-2 !py-2 rounded-md"
                        labelClassName="!text-slate-600 truncate min-w-20 !text-sm text-end"
                      />
                    </div>

                    {/* Date of Payment */}
                    <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                      <p className="text-sm font-semibold mb-2">Date of Payment</p>
                      <InputText
                        disabled={loading}
                        name="dateOfPaymentFrom"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="From date"
                        type="date"
                        label="From"
                        className="!px-2 !py-2 rounded-md"
                        labelClassName="!text-slate-600 truncate min-w-20 !text-sm text-end"
                      />
                      <InputText
                        disabled={loading}
                        name="dateOfPaymentTo"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="To date"
                        type="date"
                        label="To"
                        className="!px-2 !py-2 rounded-md"
                        labelClassName="!text-slate-600 truncate min-w-20 !text-sm text-end"
                      />
                    </div>

                    {/* Center Option */}
                    <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                      <InputRadio
                        control={form.control}
                        name="centerOption"
                        disabled={loading}
                        clearErrors={form.clearErrors}
                        options={[
                          { label: 'Center', value: 'center' },
                          { label: 'All', value: 'all' },
                        ]}
                      />
                    </div>

                    {/* Type of Loan */}
                    <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                      <div className="flex items-center gap-1">
                        <InputText
                          disabled={loading}
                          name="typeOfLoan"
                          control={form.control}
                          clearErrors={form.clearErrors}
                          placeholder="Type of loan"
                          className="!px-2 !py-2 rounded-md"
                          label="Type Of Loan"
                          labelClassName="truncate !text-slate-600 min-w-28 text-end"
                        />
                        <IonButton 
                          disabled={loading}
                          type="button" 
                          className="!text-xs !h-[38px] !min-w-[80px]"
                        >
                          <Search01Icon size={16} className="mr-1" />
                          Search
                        </IonButton>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col gap-4">
                    {/* PAR Date Range */}
                    <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                      <p className="text-sm font-semibold mb-2">PAR Date Range</p>
                      <InputText
                        disabled={loading}
                        name="parDateFrom"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="From date"
                        type="date"
                        label="From"
                        className="!px-2 !py-2 rounded-md"
                        labelClassName="!text-slate-600 truncate min-w-20 !text-sm text-end"
                      />
                      <InputText
                        disabled={loading}
                        name="parDateTo"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="To date"
                        type="date"
                        label="To"
                        className="!px-2 !py-2 rounded-md"
                        labelClassName="!text-slate-600 truncate min-w-20 !text-sm text-end"
                      />
                    </div>

                    {/* Account Officer */}
                    <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                      <InputText
                        disabled={loading}
                        name="accountOfficer"
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="Account officer"
                        className="!px-2 !py-2 rounded-md"
                        label="Account Officer"
                        labelClassName="truncate !text-slate-600 min-w-32 text-end"
                      />
                    </div>

                    {/* Less Than As Of Date */}
                    <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <InputText
                          disabled={loading}
                          name="lessThanAsOfDate"
                          control={form.control}
                          clearErrors={form.clearErrors}
                          placeholder="Select date"
                          type="date"
                          label="Less Than As Of Date"
                          className="!px-2 !py-2 rounded-md flex-1"
                          labelClassName="!text-slate-600 truncate min-w-40 !text-sm text-end"
                        />
                        <InputText
                          disabled={loading}
                          name="lessThanDays"
                          control={form.control}
                          clearErrors={form.clearErrors}
                          placeholder="#"
                          type="number"
                          className="!px-2 !py-2 rounded-md !w-20 text-center"
                        />
                      </div>
                    </div>

                    {/* Greater Than As of Date */}
                    <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <InputText
                          disabled={loading}
                          name="greaterThanAsOfDate"
                          control={form.control}
                          clearErrors={form.clearErrors}
                          placeholder="Select date"
                          type="date"
                          label="Greater Than As of Date"
                          className="!px-2 !py-2 rounded-md flex-1"
                          labelClassName="!text-slate-600 truncate min-w-40 !text-sm text-end"
                        />
                        <InputText
                          disabled={loading}
                          name="greaterThanDays"
                          control={form.control}
                          clearErrors={form.clearErrors}
                          placeholder="#"
                          type="number"
                          className="!px-2 !py-2 rounded-md !w-20 text-center"
                        />
                      </div>
                    </div>

                    {/* Weekly Collection */}
                    <div className="w-full flex flex-col gap-3 p-4 border border-zinc-200 rounded-md">
                      <div className="flex gap-2 items-center">
                        <InputCheckbox
                          control={form.control}
                          name="weeklyCollection"
                          disabled={loading}
                          className="!w-4"
                        />
                        <p className="text-sm">Weekly Collection</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <InputCheckbox
                          control={form.control}
                          name="withCBU"
                          disabled={loading || !form.watch('weeklyCollection')}
                          className="!w-4"
                        />
                        <p className="text-sm">w/ CBU</p>
                      </div>
                    </div>

                    {/* Report Type */}
                    <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
                      <InputRadio
                        control={form.control}
                        name="reportType"
                        disabled={loading}
                        clearErrors={form.clearErrors}
                        options={[
                          { label: 'By Center', value: 'byCenter' },
                          { label: 'By Center w/ Members', value: 'byCenterWithMembers' },
                        ]}
                      />
                    </div>

                    {/* Print/Export Type */}
                    <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
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
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <IonButton disabled={loading} type="button" className="!text-sm capitalize !bg-blue-600 text-white rounded-[4px]">
                    Printer Setup
                  </IonButton>
                  <IonButton disabled={loading} type="submit" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]">
                    <FileExportIcon size={15} stroke=".8" className="mr-1" />
                    {loading ? 'Loading...' : 'Preview Report'}
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

export default PortfolioAtRisk;
