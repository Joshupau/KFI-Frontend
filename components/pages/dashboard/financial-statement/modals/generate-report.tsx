import { zodResolver } from '@hookform/resolvers/zod';
import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import kfiAxios from '../../../../utils/axios';
import { PrinterIcon } from 'hugeicons-react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { BegBalanceDocumemtFormData, begbalancedocument } from '../../../../../validations/beginningbalance.schema';
import GenerateForm from '../components/generate-form';
import { financialstatementdocument, GenerateFSFormData } from '../../../../../validations/financialstatement.schema';


const GenerateReport = () => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  const [tabActive, setTabActive] = useState('print')
  

  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<GenerateFSFormData>({
      resolver: zodResolver(financialstatementdocument),
      defaultValues: {
       type:'print',
       
      },
    });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

 async function handleGenerate(data: GenerateFSFormData) {
  setLoading(true);

  try {
   if(data.type === 'print'){
           const result = await kfiAxios.get(`/report/print/gl/financial-statement`,
            {params: data, responseType: 'blob'}
           );

            const pdfBlob = new Blob([result.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
            setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

            setLoading(false)
        } else if(data.type === 'export'){
           const result = await kfiAxios.get(`/report/export/gl/financial-statement`,
            {params: data, responseType: 'blob'}
           );

             const url = window.URL.createObjectURL(new Blob([result.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'financial-statement.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);

            setLoading(false)
        }
  } catch (error) {
    console.error(error);
    present({
      message:
        "Failed to export the loan release records. Please try again.",
      duration: 1000,
    });
  } finally {
    setLoading(false);
  }
}

const type = form.watch('type')


  return (
    <>
      <IonButton fill="clear" id="fs-report" className="max-h-10 w-fit min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
        <PrinterIcon size={15} stroke='.8' className=' mr-1'/>
        
        Generate Report
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`fs-report`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:40%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Damayan Fund - Print All" sub="Transaction" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">
            <ModalHeader disabled={loading} title="Finacial Statement - Print & Export" sub="Manage financial statement records." dismiss={dismiss} />

        

          <form onSubmit={form.handleSubmit(handleGenerate)} className=' mt-4'>
            <GenerateForm form={form} loading={loading} type={tabActive} />
            <div className="mt-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="w-full capitalize bg-[#FA6C2F] text-white rounded-md font-semibold capitalize">
                
                  <PrinterIcon size={15} stroke='.8' className=' mr-1'/>
                {loading ? `Loading...` : `${type}`}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default GenerateReport;
