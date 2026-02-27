import { IonButton, IonIcon, IonModal, useIonToast } from '@ionic/react';
import React, { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import kfiAxios from '../../../../utils/axios';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { formatDateTable } from '../../../../utils/date-utils';
import { ReleaseEntryFormData, ReleaseFormData } from '../../../../../validations/release.schema';
import ReleaseFormTableDoc from './ReleaseFormTableDoc';
import { arrowBack, arrowForward } from 'ionicons/icons';
import SelectionHeader from '../../../../ui/selections/SelectionHeader';
import ARSelection from '../../../../ui/selections/ARSelections';

type ReleaseFormTableProps = {
  form: UseFormReturn<ReleaseFormData>;
};

type EntryOption = {
  _id: string;
  cvNo: string;
  dueDate: string;
  noOfWeeks: number;
  name: string;
  centerNo: string;
};

type SelectClient = {
  _id: string,
  name: string   
}

const ReleaseFormTable = ({ form }: ReleaseFormTableProps) => {
  const [loading, setLoading] = useState(false);
  const [didLoad, setDidLoad] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [present] = useIonToast();
  
  

  const center = form.watch('center');

  const { fields, replace, remove, append } = useFieldArray({
    control: form.control,
    name: 'entries',
  });
   const limit = 15;
    const [client, setClient] = useState<SelectClient[]>([])
      const [selectedIds, setSelectedIds] = useState<string[]>([])
      const [clientpage, setClientPage] = useState(1)
    
      const totalPages = Math.ceil(client.length / limit)
    
    
      const handleClientNextPage = () => {
        if (clientpage < totalPages) {
          setClientPage((prev) => prev + 1)
        }
      }
    
      const handleClientPrevPage = () => {
        if (clientpage > 1) {
          setClientPage((prev) => prev - 1)
        }
      }
    
      const currentClientItems = useMemo(() => {
        return client.slice((clientpage - 1) * limit, clientpage * limit)
      }, [client, clientpage, limit])
    
      const handleToggle = (id: string) => {
        setSelectedIds((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
      }
  
    const handleSelectEntries = async () => {
    
      try {
        setLoading(true);
        const result = await kfiAxios.get(`/customer/by-center/${center}`,);
        const { success, entries } = result.data;
        if (success) {
          setClient(result.data.clients)
          
          return;
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
  
    // const handleLoadEntries = async () => {
    //   if (center === '') {
    //     form.setError('centerLabel', { message: 'Center is required' });
    //     return;
    //   }
  
    //   try {
    //     setLoading(true);
    //     const result = await kfiAxios.post(`transaction/load/entries`, { center, clients: selectedIds });
    //     const { success, entries } = result.data;
    //     if (success) {
    //        replace(entries);
    //        setDidLoad(true);
    //        setIsOpen(false)
    //       return;
    //     }
    //   } catch (error) {
    //      present({
    //       message: 'Failed to load entries',
    //       duration: 1000,
    //     });
    //   } finally {
    //     setLoading(false);
    //   }
    // };


    const handleLoadEntries = async () => {
    if (center === '') {
      form.setError('centerLabel', { message: 'Center is required' });
      return;
    }

    try {
      setLoading(true);
      const result = await kfiAxios.post(`transaction/entries/load`, { centerLabel: center });
      const { success, entries } = result.data;
      if (success) {
        replace(
          entries.map((entry: EntryOption) => ({
            loanReleaseEntryId: entry._id,
            cvNo: `CV#${entry.cvNo}`,
            dueDate: formatDateTable(entry.dueDate),
            noOfWeeks: `${entry.noOfWeeks}`,
            name: entry.name ? `${entry.name}` : '',
            particular: `${entry.centerNo} - ${entry.name}`,
            acctCodeId: '',
            acctCode: '',
            description: '',
            debit: '0',
            credit: '0',
          })),
        );
        setDidLoad(true);
        return;
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = () =>
    append({ loanReleaseEntryId: '', dueDate: '', noOfWeeks: '', name: '', particular: '', acctCodeId: '', acctCode: '', description: '', debit: '0', credit: '0' });

  function dismiss() {
    setIsOpen(false);
  }

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <div className="p-2">
      <div className="text-start my-2">
        {/* <IonButton
          disabled={!center || didLoad}
          onClick={handleLoadEntries}
          type="button"
          fill="clear"
          className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
          strong
        >
          {loading ? 'Loading Entries...' : 'Load Entries'}
        </IonButton> */}

        <ARSelection clearErrors={form.clearErrors} setValue={form.setValue} center={center}/>

        {/* <IonButton
                          disabled={loading || center === '' || didLoad}
                          onClick={() => {handleSelectEntries(), handleOpen()}}
                          type="button"
                          fill="clear"
                          className="max-h-10 min-h-6 bg-[#FA6C2F] w-40 text-white capitalize font-semibold rounded-md"
                          strong
                        >
                          Load
                  </IonButton> */}
                
                    <IonModal
                                isOpen={isOpen}
                                backdropDismiss={false}
                                className=" [--border-radius:0.35rem] auto-height [--max-width:32rem] [--width:95%]"
                              >
                              
                                <div className="inner-content !p-6  border-2 !border-slate-100">
                                    <SelectionHeader dismiss={dismiss} disabled={loading} title="Loan Type Selection" />
                        
                                  
                                  <div className="relative overflow-auto !mt-4">
                                     <Table>
                                    <TableHeader>
                                      <TableHeadRow className="border-b-0 bg-slate-100">
                                        <TableHead className="!py-2 w-12">
                                          {/* optional: select all */}
                                          <input
                                            type="checkbox"
                                            checked={client?.length > 0 && selectedIds.length === client?.length}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setSelectedIds(client.map((c) => c._id))
                                              } else {
                                                setSelectedIds([])
                                              }
                                            }}
                                          />
                                        </TableHead>
                                        <TableHead className="!py-2">Client Name</TableHead>
                                      </TableHeadRow>
                                    </TableHeader>
                                    <TableBody>
                                      {!loading && client?.length < 1 && (
                                        <TableRow><TableCell colSpan={2}>No loan type found</TableCell></TableRow>
                                      )}
                                      {!loading &&
                                        currentClientItems?.map((data) => (
                                          <TableRow key={data._id} className="border-b-0 [&>td]:!py-1">
                                            <TableCell className="w-12">
                                              <input
                                                type="checkbox"
                                                checked={selectedIds.includes(data._id)}
                                                onChange={() => handleToggle(data._id)}
                                              />
                                            </TableCell>
                                            <TableCell>{data.name}</TableCell>
                                          </TableRow>
                                        ))}
                                    </TableBody>
                                  </Table>
                                  </div>
                
                                      {loading && <p className=' w-full text-center'>Loading...</p>}
                
                                       <div className="flex items-center justify-center gap-2 py-1 px-5 rounded-md w-fit mx-auto">
                                        <div>
                                          <IonButton onClick={handleClientPrevPage} disabled={clientpage === 1} fill="clear" className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md">
                                            <IonIcon icon={arrowBack} />
                                          </IonButton>
                                        </div>
                                        <div>
                                          <div className="text-sm !font-semibold  px-3 py-1.5 rounded-lg text-slate-700">
                                            {clientpage} / {Math.ceil(client.length / limit)}
                                          </div>
                                        </div>
                                        <div>
                                          <IonButton
                                            onClick={handleClientNextPage}
                                            disabled={clientpage === Math.ceil(client.length / limit)}
                                            fill="clear"
                                            className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
                                          >
                                            <IonIcon icon={arrowForward} />
                                          </IonButton>
                                        </div>
                                      </div>
                
                                   {/* <div className="flex items-center justify-center gap-2 mt-6">
                                      <button
                                        className="px-3 py-1 border rounded disabled:opacity-50 bg-orange-600 text-black"
                                        onClick={handleClientPrevPage}
                                        disabled={clientpage === 1}
                                      >
                                        <ArrowLeft01Icon size={20}/>
                                      </button>
                                      
                                      <button
                                        className="px-3 py-1 border rounded disabled:opacity-50 bg-orange-600 text-black"
                                        onClick={handleClientNextPage}
                                        disabled={clientpage === totalPages}
                                      >
                                      <ArrowRight01Icon size={20}/>
                                      </button>
                                    </div> */}
                
                
                
                                  <div className=' w-full flex items-center justify-end !mt-6'>
                                    <IonButton
                                      onClick={dismiss}
                                      type="button"
                                      fill="clear"
                                      className="max-h-10 min-h-6 bg-zinc-100 w-40 text-black capitalize font-semibold rounded-md"
                                      strong
                                    >
                                      Cancel
                                    </IonButton>
                
                                    <IonButton
                                    disabled={selectedIds.length === 0}
                                      onClick={handleLoadEntries}
                                      type="button"
                                      fill="clear"
                                      className="max-h-10 min-h-6 bg-[#FA6C2F] w-40 text-white capitalize font-semibold rounded-md"
                                      strong
                                    >
                                      Load
                                    </IonButton>
                                  </div>
                                   
                                </div>
                    </IonModal>
      </div>
      <div className="relative overflow-auto flex">
         <Table className=' sticky left-0 hidden md:table z-50'>
          <TableHeader>
            <TableHeadRow className="border-2 bg-slate-100 [&>th]:border-2 [&>th]:!font-normal [&>th]:!py-1.5 [&>th]:!text-xs">
              <TableHead className="sticky left-0 min-w-[5rem] z-10 hidden md:table-cell">Line</TableHead>
              <TableHead className="min-w-56 max-w-56 whitespace-nowrap hidden md:table-cell">CV#</TableHead>
              <TableHead className="min-w-32 max-w-32 whitespace-nowrap hidden lg:table-cell">Due Date</TableHead>
              <TableHead className="min-w-20 max-w-20 whitespace-nowrap hidden lg:table-cell">Week</TableHead>
              <TableHead className="min-w-60 max-w-60 whitespace-nowrap hidden lg:table-cell">Name</TableHead>
              <TableHead className="min-w-48 max-w-48 whitespace-nowrap hidden lg:table-cell">Account Code</TableHead>
              
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {/* {fields.length < 1 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No Entries Yet
                </TableCell>
              </TableRow>
            )} */}
            {fields.map((entry: ReleaseEntryFormData & { id: string }, i: number) => (
              <ReleaseFormTableDoc key={`entry-${entry.id}`} entry={entry} index={i} remove={remove} form={form} sticky={true} />
            ))}
          </TableBody>
        </Table>
        <Table>
          <TableHeader>
            <TableHeadRow className="border-2 bg-slate-100 [&>th]:border-2 [&>th]:!font-normal [&>th]:!py-1.5 [&>th]:!text-xs">
              <TableHead className="sticky left-0 min-w-[5rem] z-10 table-cell md:hidden">Line</TableHead>
              <TableHead className="min-w-56 max-w-56 whitespace-nowrap table-cell md:hidden">CV#</TableHead>
              <TableHead className="min-w-32 max-w-32 whitespace-nowrap table-cell lg:hidden">Due Date</TableHead>
              <TableHead className="min-w-20 max-w-20 whitespace-nowrap table-cell lg:hidden">Week</TableHead>
              <TableHead className="min-w-60 max-w-60 whitespace-nowrap table-cell lg:hidden">Name</TableHead>
              <TableHead className="min-w-48 max-w-48 whitespace-nowrap table-cell lg:hidden">Account Code</TableHead>
              <TableHead className=' whitespace-nowrap'>Description</TableHead>
              <TableHead className=' whitespace-nowrap'>Debit</TableHead>
              <TableHead className=' whitespace-nowrap'>Credit</TableHead>
              <TableHead className="text-center whitespace-nowrap">Actions</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {fields.length < 1 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No Entries Yet
                </TableCell>
              </TableRow>
            )}
            {fields.map((entry: ReleaseEntryFormData & { id: string }, i: number) => (
              <ReleaseFormTableDoc key={`entry-${entry.id}`} entry={entry} index={i} remove={remove} form={form} />
            ))}
          </TableBody>
        </Table>
      </div>
       {fields.length < 1 && (
        <p className=' text-xs text-zinc-800 w-full text-center mt-4'>No Entries Yet</p>   
      )}
      {form.formState.errors.entries && <div className="text-red-600 text-xs text-center my-2">{form.formState.errors.entries.message}</div>}
      <div className="text-start my-2">
        <IonButton
          // disabled={!didLoad}
          onClick={handleAddEntry}
          type="button"
          fill="clear"
          className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
          strong
        >
          + Add Entries
        </IonButton>
      </div>
    </div>
  );
};

export default ReleaseFormTable;
