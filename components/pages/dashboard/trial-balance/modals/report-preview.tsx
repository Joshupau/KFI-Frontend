import React, { useRef, useState } from 'react';
import { IonButton, IonModal, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { trialBalanceReportSchema, TrialBalanceReportFormData } from '../../../../../validations/trial-balance-report.schema';
import InputText from '../../../../ui/forms/InputText';
import InputCheckbox from '../../../../ui/forms/InputCheckbox';
import InputTextarea from '../../../../ui/forms/InputTextarea';
import InputSelect from '../../../../ui/forms/InputSelect';
import { FileExportIcon, PrinterIcon } from 'hugeicons-react';
import { FinancialStatements } from '../../../../../types/types';

type ReportPreviewProps = {
  trialBalances?: FinancialStatements[];
};

const ReportPreview = ({ trialBalances = [] }: ReportPreviewProps) => {
  const [loading, setLoading] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);
  const [present] = useIonToast();

  const reportCodeOptions = trialBalances.map(tb => ({
    label: `${tb.reportCode} - ${tb.reportName}`,
    value: tb.reportCode,
  }));

  const form = useForm<TrialBalanceReportFormData>({
    resolver: zodResolver(trialBalanceReportSchema) as any,
    defaultValues: {
      dateFrom: '',
      dateTo: '',
      displayZeroValues: false,
      acctgYear: '',
      reportCode: '',
      summarizeBeginningAndEndingBalance: false,
      includeBeginningAndEndingBalance: false,
      message: '',
      type: 'print',
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: TrialBalanceReportFormData) {
    setLoading(true);

    const requestData = {
      dateFrom: data.dateFrom,
      dateTo: data.dateTo,
      displayZeroValues: data.displayZeroValues,
      acctgYear: data.acctgYear,
      reportCode: data.reportCode,
      summarizeBeginningAndEndingBalance: data.summarizeBeginningAndEndingBalance,
      includeBeginningAndEndingBalance: data.includeBeginningAndEndingBalance,
      message: data.message,
    };

    try {
      if (data.type === 'print') {
        const result = await kfiAxios.post('/trial-balance/print-report', requestData, {
          responseType: 'blob',
        });

        const pdfBlob = new Blob([result.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

        setLoading(false);
      } else if (data.type === 'export') {
        const result = await kfiAxios.post('/trial-balance/export-report', requestData, {
          responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([result.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'trial-balance.xlsx';
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

  const handlePrint = () => {
    form.setValue('type', 'print');
    form.handleSubmit(onSubmit)();
  };

  const handleExport = () => {
    form.setValue('type', 'export');
    form.handleSubmit(onSubmit)();
  };

  return (
    <>
      <IonButton
        fill="clear"
        id="report-preview-modal"
        className="max-h-10 min-h-6 bg-blue-600 text-white capitalize font-semibold rounded-md"
        strong
      >
        Preview Report
      </IonButton>

      <IonModal
        ref={modal}
        trigger="report-preview-modal"
        backdropDismiss={false}
        className="[--border-radius:0.35rem] auto-height [--width:95%] [--max-width:42rem]"
      >
        <div className="p-6 flex flex-col gap-6">
          <ModalHeader disabled={loading} title="Trial Balance" sub="Preview and generate trial balance reports." dismiss={dismiss} />

          <form className="flex flex-col gap-4 w-full">
            {/* Date Section */}
            <div className="w-full flex flex-col gap-3 p-4 border border-zinc-200 rounded-md">
              <p className="text-sm font-semibold mb-1">Date</p>
              
              <div className="flex items-center gap-2">
                <InputText
                  disabled={loading}
                  name="dateFrom"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  placeholder="Select date"
                  type="date"
                  label="From"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="!text-slate-600 min-w-16 text-end"
                />
              </div>

              <div className="flex items-center gap-2">
                <InputText
                  disabled={loading}
                  name="dateTo"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  placeholder="Select date"
                  type="date"
                  label="To"
                  className="!px-2 !py-2 rounded-md"
                  labelClassName="!text-slate-600 min-w-16 text-end"
                />
              </div>

              <div className="flex items-center gap-2 mt-1">
                <InputCheckbox
                  control={form.control}
                  name="displayZeroValues"
                  disabled={loading}
                  className="!w-4"
                />
                <p className="text-sm">Display Zero values</p>
              </div>
            </div>

            {/* Acctg. Year */}
            <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
              <InputText
                disabled={loading}
                name="acctgYear"
                control={form.control}
                clearErrors={form.clearErrors}
                placeholder="Enter year"
                type="text"
                label="Acctg. Year"
                className="!px-2 !py-2 rounded-md"
                labelClassName="!text-slate-600 min-w-24 text-end"
              />
            </div>

            {/* Report Code */}
            <div className="w-full flex flex-col gap-3 p-4 border border-zinc-200 rounded-md">
              <InputSelect
                disabled={loading}
                name="reportCode"
                control={form.control}
                clearErrors={form.clearErrors}
                placeholder="Select report code"
                label="Report Code"
                options={reportCodeOptions}
                className="!px-2 !py-2 rounded-md"
                labelClassName="!text-slate-600 min-w-24 text-end"
              />

              <div className="flex flex-col gap-2 ml-28">
                <div className="flex items-center gap-2">
                  <InputCheckbox
                    control={form.control}
                    name="summarizeBeginningAndEndingBalance"
                    disabled={loading}
                    className="!w-4"
                  />
                  <p className="text-sm">Summarize Beg. and End. Balance</p>
                </div>
                <div className="flex items-center gap-2">
                  <InputCheckbox
                    control={form.control}
                    name="includeBeginningAndEndingBalance"
                    disabled={loading}
                    className="!w-4"
                  />
                  <p className="text-sm">Include Beginning and Ending Balance</p>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="w-full flex flex-col gap-2 p-4 border border-zinc-200 rounded-md">
              <p className="text-sm font-semibold mb-1">Message</p>
              <InputTextarea
                disabled={loading}
                name="message"
                control={form.control}
                clearErrors={form.clearErrors}
                placeholder="Enter message (optional)"
                className="!px-2 !py-2 rounded-md min-h-[100px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <IonButton
                type="button"
                disabled={loading}
                onClick={handlePrint}
                className="!h-10 capitalize font-semibold flex-1"
                color="medium"
              >
                <PrinterIcon className="mr-2" size={18} />
                Print
              </IonButton>

              <IonButton
                type="button"
                disabled={loading}
                onClick={handleExport}
                className="!h-10 capitalize font-semibold flex-1"
                color="success"
              >
                <FileExportIcon className="mr-2" size={18} />
                Export
              </IonButton>

              <IonButton
                type="button"
                disabled={loading}
                onClick={dismiss}
                className="!h-10 capitalize font-semibold flex-1"
                color="danger"
                fill="outline"
              >
                Close
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default ReportPreview;
