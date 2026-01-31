import { IonButton, IonHeader, IonInput, IonModal, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import SelectionHeader from './SelectionHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../table/Table';
import FormIonItem from '../utils/FormIonItem';
import classNames from 'classnames';
import kfiAxios from '../../utils/axios';
import TableLoadingRow from '../forms/TableLoadingRow';
import TableNoRows from '../forms/TableNoRows';
import { FieldValues, Path, PathValue, UseFormClearErrors, UseFormSetValue } from 'react-hook-form';
import TablePagination from '../forms/TablePagination';
import { formatDateTable } from '../../utils/date-utils';
import { Search01Icon } from 'hugeicons-react';

type Option = {
  _id: string;
  cvNo: string;
  dueDate: string;
  noOfWeeks: number;
  name: string;
  centerNo: string;
};

export type TLoanReleaseEntries = {
  loanEntries: Option[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

type LoanReleaseEntrySelectionProps<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  loanReleaseEntryId: Path<T>;
  cvNo: Path<T>;
  dueDate: Path<T>;
  noOfWeeks: Path<T>;
  name: Path<T>;
  particular: Path<T>;
  className?: string;
};

const LoanReleaseEntrySelection = <T extends FieldValues>({
  loanReleaseEntryId,
  cvNo,
  dueDate,
  noOfWeeks,
  name,
  particular,
  setValue,
  clearErrors,
  className = '',
}: LoanReleaseEntrySelectionProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ionInputRef = useRef<HTMLIonInputElement>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [data, setData] = useState<TLoanReleaseEntries>({
    loanEntries: [],
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
    setLoading(true);
    try {
      const filter: any = { keyword: value, page, limit: 10 };
      const result = await kfiAxios.get('transaction/entries/selection', { params: filter });
      const { success, loanEntries, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          loanEntries,
          totalPages: totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
        }));
        setCurrentPage(page);
        return;
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExpenseVoucher = (loanEntry: Option) => {
    setValue(loanReleaseEntryId as Path<T>, loanEntry._id as PathValue<T, Path<T>> as any);
    setValue(cvNo as Path<T>, `${loanEntry.cvNo}` as PathValue<T, Path<T>> as any);
    setValue(dueDate as Path<T>, formatDateTable(loanEntry.dueDate) as PathValue<T, Path<T>> as any);
    setValue(noOfWeeks as Path<T>, `${loanEntry.noOfWeeks}` as PathValue<T, Path<T>> as any);
    setValue(name as Path<T>, loanEntry.name as PathValue<T, Path<T>> as any);
    setValue(particular as Path<T>, `${loanEntry.centerNo} - ${loanEntry.name}` as PathValue<T, Path<T>> as any);

    clearErrors(loanReleaseEntryId);
    clearErrors(cvNo);
    clearErrors(dueDate);
    clearErrors(noOfWeeks);
    clearErrors(name);
    clearErrors(particular);

    setData({
      loanEntries: [],
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });
    dismiss();
  };

  const handlePagination = (page: number) => handleSearch(page);

  useEffect(() => {
    isOpen && handleSearch(1);
  }, [isOpen]);

  return (
    <>
      <div className="text-end">
        <IonButton onClick={handleOpen} fill="clear" className={classNames('max-h-9 min-h-9 btn-color text-white capitalize font-semibold rounded-md m-0 text-xs', className)} strong>
          <Search01Icon size={15} stroke='.8' className=' mr-1'/>
          Find
        </IonButton>
      </div>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.7rem] auto-height md:[--max-width:70%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-10">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Loan Release Entry Selection" />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6  border-2 !border-slate-200">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Loan Release Entry Selection" />

          <div className="">
            <div className="flex items-center flex-wrap justify-start gap-2">
              <div className="flex items-center min-w-20">
                <FormIonItem className="flex-1">
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
                  <TableHead className="!py-2">CV#</TableHead>
                  <TableHead className="!py-2">Due Date</TableHead>
                  <TableHead className="!py-2">No. Of Weeks</TableHead>
                  <TableHead className="!py-2">Name</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {loading && <TableLoadingRow colspan={4} />}
                {!loading && data.loanEntries.length < 1 && <TableNoRows colspan={4} label="No Loan Release Entry Found" />}
                {!loading &&
                  data.loanEntries.map((data: Option) => (
                    <TableRow onClick={() => handleSelectExpenseVoucher(data)} key={data._id} className="border-b-0 [&>td]:!py-1 cursor-pointer">
                      <TableCell className="">{data.cvNo}</TableCell>
                      <TableCell className="">{formatDateTable(data.dueDate)}</TableCell>
                      <TableCell className="">{data.noOfWeeks}</TableCell>
                      <TableCell className="">{data.name}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
        </div>
      </IonModal>
    </>
  );
};

export default LoanReleaseEntrySelection;
