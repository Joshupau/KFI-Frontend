import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { LoanReleaseFormData } from '../../../../../validations/loan-release.schema';
import CenterSelection from '../../../../ui/selections/CenterSelection';
import useGetCenterDescription from '../../../../utils/custom/useGetCenterDescription';
import InputTextarea from '../../../../ui/forms/InputTextarea';
import classNames from 'classnames';
import BankSelection from '../../../../ui/selections/BankSelection';
import LoanSelection from '../../../../ui/selections/LoanSelection';
import InputCheckbox from '../../../../ui/forms/InputCheckbox';

type TForm = {
  form: UseFormReturn<LoanReleaseFormData>;
  loading?: boolean;
};

const LoanReleaseForm = ({ form, loading = false }: TForm) => {
  const centerId = form.watch('center');
  const { center, loading: centerLoads } = useGetCenterDescription({ id: centerId });
  const watchDate = form.watch('date')

  useEffect(() => {
    if (center) {
      form.setValue('name', center);
      form.clearErrors('name');
    }
    form.setValue('checkDate',watchDate )
  }, [center, form, watchDate]);

  return (
    <div className=" space-y-1 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2 w-full">
          <FormIonItem className="[--min-height:0]">
            <InputText
              disabled={loading}
              name="cvNo"
              control={form.control}
              clearErrors={form.clearErrors}
              label="CV#"
              type='text'
              placeholder="Type here"
              className="!p-2 rounded-md !text-xs w-full"
              labelClassName="truncate min-w-20 !text-xs !text-slate-600 text-end"
            />
          </FormIonItem>

          <div className="flex items-center gap-2 flex-nowrap">
            <FormIonItem className="flex-1">
              <InputText
                disabled={loading}
                readOnly
                name="centerLabel"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Center Code"
                placeholder="Click find to search for center code"
                className=" !p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-20 !text-[0.7rem] !text-slate-600 text-end"
              />
            </FormIonItem>
            <CenterSelection centerLabel="centerLabel" centerValue="center" clearErrors={form.clearErrors} setValue={form.setValue} className="text-xs" />
          </div>

          <FormIonItem className="[--min-height:0]">
            <InputText
              disabled={loading}
              readOnly
              name="name"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Name"
              placeholder={`${centerLoads ? 'Loading...' : 'Type here'}`}
              className="!p-2 rounded-md !text-[0.7rem]"
              labelClassName="truncate min-w-20 !text-[0.7rem] !text-slate-600 text-end"
            />
          </FormIonItem>
        </div>
        <div className="space-y-2">
          <FormIonItem className="w-full [--min-height:0]">
            <InputText
              disabled={loading}
              name="date"
              type="date"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Date"
              placeholder="Type here"
              max="9999-12-31"
              className="!p-2 rounded-md !text-[0.7rem] "
              labelClassName="truncate min-w-[7.5rem] !text-[0.7rem]  !text-slate-600 text-end"
              // readOnly
              
            />
          </FormIonItem>
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <FormIonItem className="w-full [--min-height:0]">
              <InputText
                disabled={loading}
                name="acctMonth"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Account Month"
                placeholder="Type here"
                className="!p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-[7.5rem] !text-[0.7rem]  !text-slate-600 text-end"
                readOnly
              />
            </FormIonItem>

            <FormIonItem className="w-full [--min-height:0]">
              <InputText
                disabled={loading}
                name="acctYear"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Account Year"
                placeholder="Type here"
                className="!p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-[7.5rem] !text-[0.7rem]  !text-slate-600 text-end"
                readOnly
              />
            </FormIonItem>
          </div> */}
           <FormIonItem className="w-full [--min-height:0]">
              <InputText
                disabled={loading}
                name="acctMonth"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Account Month"
                placeholder="Type here"
                className="!p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-[7.5rem] !text-[0.7rem]  !text-slate-600 text-end"
              />
            </FormIonItem>

            <FormIonItem className="w-full [--min-height:0]">
              <InputText
                disabled={loading}
                name="acctYear"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Account Year"
                placeholder="Type here"
                className="!p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-[7.5rem] !text-[0.7rem]  !text-slate-600 text-end"
              />
            </FormIonItem>
          <FormIonItem className="w-full [--min-height:0]">
            <InputText
              disabled={loading}
              name="noOfWeeks"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Number of Weeks"
              placeholder="Type here"
              className="!p-2 rounded-md !text-[0.7rem]"
              labelClassName="truncate min-w-[7.5rem] !text-[0.7rem]  !text-slate-600 text-end"
            />
          </FormIonItem>
          <div className="flex items-end gap-2">
            <FormIonItem className="w-full [--min-height:0]">
              <InputText
                readOnly
                disabled={loading}
                name="typeOfLoanLabel"
                control={form.control}
                clearErrors={form.clearErrors}
                label="Type of Loan"
                placeholder="Click find to search for type of loan"
                className="!p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-[7.5rem] !text-[0.7rem]  !text-slate-600 text-end"
              />
            </FormIonItem>
            <LoanSelection loanLabel="typeOfLoanLabel" loanValue="typeOfLoan" clearErrors={form.clearErrors} setValue={form.setValue} className="" />
          </div>
        </div>
        <div className="space-y-2">
          <FormIonItem className="w-full [--min-height:0]">
            <InputText
              disabled={loading}
              name="checkNo"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Check Number"
              placeholder="Type here"
              className="!p-2 rounded-md !text-[0.7rem]"
              labelClassName="truncate min-w-24 !text-[0.7rem] !text-slate-600 text-end"
            />
          </FormIonItem>
          <FormIonItem className="w-full [--min-height:0]">
            <InputText
              disabled={loading}
              name="checkDate"
              type="date"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Check Date"
              placeholder="Type here"
              className="!p-2 rounded-md !text-[0.7rem]"
              labelClassName="truncate min-w-24 !text-[0.7rem]  !text-slate-600 text-end"
              max="9999-12-31"
              readOnly
            />
          </FormIonItem>

          <div className="flex items-end gap-2 flex-nowrap">
            <FormIonItem className="w-full [--min-height:0]">
              <InputText
                disabled={loading}
                name="bankCodeLabel"
                readOnly
                control={form.control}
                clearErrors={form.clearErrors}
                label="Bank Code"
                placeholder="Click find to search for bank code"
                className="!p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-24 !text-[0.7rem]  !text-slate-600 text-end"
              />
            </FormIonItem>
            <BankSelection bankLabel="bankCodeLabel" bankValue="bankCode" setValue={form.setValue} clearErrors={form.clearErrors} className="" />
          </div>

          <FormIonItem className="w-full [--min-height:0]">
            <InputText
              disabled={loading}
              name="amount"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Amount"
              placeholder="Type here"
              className="!p-2 rounded-md !text-[0.7rem] lg:max-w-40"
              labelClassName="truncate min-w-24 !text-[0.7rem]  !text-slate-600 text-end"
              isAmount
            />
          </FormIonItem>
        </div>

        <div className="lg:hidden md:flex flex-col space-y-2">
          <FormIonItem className=" [--min-height:0]">
            <InputText
              disabled={loading}
              name="remarks"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Particular"
              placeholder="Type here"
              className="!p-2 rounded-md !text-[0.7rem]"
              labelClassName="truncate min-w-24 !text-[0.7rem] !text-slate-600 text-end"
            />
          </FormIonItem>

          <FormIonItem className="[--min-height:0]">
            <InputText
              disabled={loading}
              name="cycle"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Cycle"
              placeholder="Type here"
              className="!p-2 rounded-md !text-[0.7rem]"
              labelClassName="truncate min-w-24 !text-[0.7rem] !text-slate-600 text-end"
            />
          </FormIonItem>

          <FormIonItem className=" [--min-height:0]">
            <InputText
              disabled={loading}
              name="interestRate"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Interest Rate"
              placeholder="Type here"
              className="!p-2 rounded-md !text-[0.7rem]"
              labelClassName="truncate min-w-24 !text-[0.7rem]  !text-slate-600 text-end"
            />
          </FormIonItem>
        </div>

          
          {/* <FormIonItem className="w-full [--min-height:0] ps-[6.5rem]">
            <InputCheckbox disabled={loading} name="isEduc" control={form.control} label="EDUC" className="!h-6 text-xs" />
          </FormIonItem> */}
      </div>

      <div className=" grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 hidden lg:grid">
        <div className="col-span-2">
          <FormIonItem className="w-full [--min-height:0]">
            <InputText
              disabled={loading}
              name="remarks"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Particular"
              placeholder="Type here"
              className="!p-2 rounded-md !text-[0.7rem]"
              labelClassName="truncate min-w-24 !text-[0.7rem] !text-slate-600 text-end"
            />
          </FormIonItem>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <FormIonItem className="[--min-height:0]">
            <InputText
              disabled={loading}
              name="cycle"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Cycle"
              placeholder="Type here"
              className="!p-2 rounded-md !text-[0.7rem]"
              labelClassName="truncate min-w-24 !text-[0.7rem] !text-slate-600 text-end"
            />
          </FormIonItem>

          <FormIonItem className="w-full [--min-height:0]">
            <InputText
              disabled={loading}
              name="interestRate"
              control={form.control}
              clearErrors={form.clearErrors}
              label="Interest Rate"
              placeholder="Type here"
              className="!p-2 rounded-md !text-[0.7rem]"
              labelClassName="truncate min-w-24 !text-[0.7rem]  !text-slate-600 text-end"
            />
          </FormIonItem>
          {/* <FormIonItem className="w-full [--min-height:0] ps-[6.5rem]">
            <InputCheckbox disabled={loading} name="isEduc" control={form.control} label="EDUC" className="!h-6 text-xs" />
          </FormIonItem> */}
        </div>
      </div>
    </div>
  );
};

export default LoanReleaseForm;
