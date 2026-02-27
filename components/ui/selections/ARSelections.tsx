import { IonButton, IonHeader, IonInput, IonModal, IonSelect, IonSelectOption, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import SelectionHeader from './SelectionHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../table/Table';
import FormIonItem from '../utils/FormIonItem';
import classNames from 'classnames';
import kfiAxios from '../../utils/axios';
import TableLoadingRow from '../forms/TableLoadingRow';
import TableNoRows from '../forms/TableNoRows';
import { FieldValues, Path, PathValue, UseFormClearErrors, UseFormSetValue, Control } from 'react-hook-form';
import TablePagination from '../forms/TablePagination';
import { Search01Icon } from 'hugeicons-react';
import InputSelect from '../forms/InputSelect';

type Option = {
  _id: string;
  code: string;
};

export type TAcknowledgement = {
  acknowledgements: { _id: string; code: string }[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

type AcknowledgementSelectionProps<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  acknowledgementLabel?: Path<T>;
  acknowledgementValue?: Path<T>;
  className?: string;
  center?: string
};

const ARSelection = <T extends FieldValues>({
  acknowledgementLabel,
  acknowledgementValue,
  setValue,
  clearErrors,
  className = '',
  center,
}: AcknowledgementSelectionProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ionInputRef = useRef<HTMLIonInputElement>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dueDateId, setDueDateId] = useState('') 
  const [type, setType] = useState('seasonal') 
  const [category, setCategory] = useState('payments') 
  const [duedates, setDuedates] = useState<any[]>([])

  const [data, setData] = useState<TAcknowledgement>({
    acknowledgements: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  function dismiss() {
    setIsOpen(false);
  }

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleSearch = async (page: number) => {
    const value = ionInputRef.current?.value || '';
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: any = { dueDateId: dueDateId, type: type, category: category};
      const result = await kfiAxios.get('/release/load-entries', { params: filter });
      const { success, acknowledgements, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          acknowledgements,
          totalPages: totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
        }));
        setCurrentPage(page);
        return;
      }
    } catch (error) {
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDueDates = async () => {
  
      try {
        setLoading(true);
        const result = await kfiAxios.get(`/transaction/due-dates/${center}`);
        const { success, dueDates } = result.data;

        setDuedates(dueDates)
     
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
  

  const handleSelectExpenseVoucher = (acknowledgement: Option) => {
    const code = acknowledgement.code as PathValue<T, Path<T>>;
    const id = acknowledgement._id as PathValue<T, Path<T>>;

    setValue(acknowledgementLabel as Path<T>, code as any);
    setValue(acknowledgementValue as Path<T>, id as any);
    clearErrors(acknowledgementLabel);
    clearErrors(acknowledgementValue);
    setData({
      acknowledgements: [],
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });
    dismiss();
  };

  const handlePagination = (page: number) => handleSearch(page);

  useEffect(() => {
    if (isOpen) handlePagination(1), handleDueDates();
  }, [isOpen]);

  return (
    <>
      <div className="">
        <IonButton onClick={handleOpen} fill="clear" className={classNames('max-h-9 min-h-9 btn-color text-white capitalize font-semibold rounded-md m-0 text-xs', className)} strong>
         Load Entries
        </IonButton>
      </div>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:70%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-10">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Official Receipt Selection" />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6  border-2 !border-slate-200">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Acknowledgement Receipt Selection" />

          <div className="">
            <div className="flex items-center flex-wrap justify-start gap-2">
              <div className="flex items-center min-w-20 gap-2">
                {/* <FormIonItem className="flex-1">
                  <IonInput
                    ref={ionInputRef}
                    clearInput
                    type="search"
                    aria-label="Type here"
                    placeholder="Type here"
                    disabled={data.loading}
                    className={classNames(
                      'text-sm !bg-white rounded-md !px-2 ![--highlight-color-focused:none] md:![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-slate-400 ![--min-height:1rem] !min-h-[1rem]',
                    )}
                  />
                </FormIonItem> */}

                   <FormIonItem>

                  <IonSelect
                  placeholder='Due dates'
                  labelPlacement="stacked"
                  value={dueDateId}
                  onIonChange={e => {
                      setDueDateId(e.detail.value);
                    }}
                   className={classNames(
                      '!border border-zinc-300 [--highlight-color-focused:none] !px-2 !py-1 text-xs !overflow-y-auto !max-h-[18rem] !min-h-[0.5rem] !min-w-[8rem]',
                    )}
                    >
                      {duedates.map((item, index) => (
                        <IonSelectOption key={index}  value={item.id} className="text-xs [--min-height:0.5rem]">
                          {item.duedate}
                        </IonSelectOption>
                      ))}
                        
                      
                    </IonSelect>
                  
                  </FormIonItem>


                  <FormIonItem>
                    <IonSelect
                    placeholder='Type'
                    labelPlacement="stacked"
                    value={type}
                      onIonChange={e => {
                      setType(e.detail.value);
                    }}
                    className={classNames(
                        '!border border-zinc-300 [--highlight-color-focused:none] !px-2 !py-1 text-xs !min-h-[0.5rem] !min-w-[8rem]',
                      )}
                      >
                          <IonSelectOption  value={'seasonal'} className="text-xs [--min-height:0.5rem]">
                            Seasonal
                          </IonSelectOption>
                          <IonSelectOption  value={'group'} className="text-xs [--min-height:0.5rem]">
                            Group
                          </IonSelectOption>
                          <IonSelectOption  value={'individual'} className="text-xs [--min-height:0.5rem]">
                            Individual
                          </IonSelectOption>
                    </IonSelect>
                  </FormIonItem>

                    <FormIonItem>

                  <IonSelect
                  placeholder='Category'
                  labelPlacement="stacked"
                  value={category}
                  onIonChange={e => {
                      setCategory(e.detail.value);
                    }}
                   className={classNames(
                      '!border border-zinc-300 [--highlight-color-focused:none] !px-2 !py-1 text-xs !overflow-y-auto !max-h-[18rem] !min-h-[0.5rem] !min-w-[8rem]',
                    )}
                    >
                          <IonSelectOption  value={'payments'} className="text-xs [--min-height:0.5rem]">
                            Payments
                          </IonSelectOption>
                          <IonSelectOption  value={'cgt'} className="text-xs [--min-height:0.5rem]">
                            CGT
                          </IonSelectOption>
                       
                      
                    </IonSelect>
                  
                  </FormIonItem>


               

              

                <IonButton
                  disabled={data.loading}
                  onClick={() => handleSearch(1)}
                  type="button"
                  fill="clear"
                  className="max-h-10 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md text-xs"
                  strong
                >
                  <Search01Icon size={15} stroke='.8' className=' mr-1'/>
                  {data.loading ? 'Finding...' : 'Find'}
                </IonButton>
              </div>
            </div>
          </div>
          <div className="relative overflow-auto">
            <Table>
              <TableHeader>
                <TableHeadRow className="border-b-0 bg-slate-100">
                  <TableHead className="!py-2">Cv#</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {data.loading && <TableLoadingRow colspan={1} />}
                {!data.loading && data.acknowledgements.length < 1 && <TableNoRows colspan={1} label="No data found" />}
                {!data.loading &&
                  data.acknowledgements.map((data: Option) => (
                    <TableRow onClick={() => handleSelectExpenseVoucher(data)} key={data._id} className="border-b-0 [&>td]:!py-1 cursor-pointer">
                      <TableCell className="">{data.code}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          {/* <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} /> */}
        </div>
      </IonModal>
    </>
  );
};

export default ARSelection;
