import React from 'react';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputText from '../../../../ui/forms/InputText';
import { UseFormReturn } from 'react-hook-form';
import InputRadio from '../../../../ui/forms/InputRadio';
import { IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';
import { AccountSetting02Icon, Calendar01Icon, DocumentAttachmentIcon, House01Icon } from 'hugeicons-react';
import { BegBalanceDocumemtFormData } from '../../../../../validations/beginningbalance.schema';
import { GenerateFSFormData } from '../../../../../validations/financialstatement.schema';

type PrintExportFilterFormProps = {
  loading: boolean;
  form: UseFormReturn<GenerateFSFormData>;
  type?: string
};

const GenerateForm = ({ form, loading, type }: PrintExportFilterFormProps) => {

    console.log(form.watch('year'), form.formState.errors)




  return (
    <div className="space-y-1 mt-4">
      <div className="border p-3 rounded-md border-slate-300">
      
        <div className="flex flex-col gap-1 flex-wrap">
          <div className="flex items-start flex-wrap gap-2">
            <div className="flex-1 relative">
              <p className=' text-xs'>Month</p>

              <FormIonItem className="flex-1">
               <InputText
                  type='number'
                  disabled={loading}
                  name="month"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  max={String(new Date().getFullYear())}
                
                />
              </FormIonItem>
           
            </div>

             <div className="flex-1 relative">
              <p className=' text-xs'>Year</p>

              <FormIonItem className="flex-1">
               <InputText
                  type='number'
                  disabled={loading}
                  name="year"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  max={String(new Date().getFullYear())}
                
                />
              </FormIonItem>
           
            </div>
           
          </div>

          <div className="flex-1 relative">
              <p className=' text-xs'>Title</p>

              <FormIonItem className="flex-1">
               <InputText
                  type='text'
                  disabled={loading}
                  name="title"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                
                />
              </FormIonItem>
           
            </div>

          <div className="border p-3 rounded-md border-slate-300">
                  <p className=" mb-2 text-sm !font-semibold">Options</p>
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

    </div>
  );
};

export default GenerateForm;
