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
import { Search01Icon } from 'hugeicons-react';
import { useOnlineStore } from '../../../store/onlineStore';
import { TABLE_LIMIT } from '../../utils/constants';
import { db } from '../../../database/db';

type Option = {
  _id: string;
  code: string;
  description: string;
};

type BankSelectionProps<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  bankLabel: Path<T>;
  bankValue: Path<T>;
  className?: string;
};

export type TBanks = {
  banks: Option[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const BankSelection = <T extends FieldValues>({ bankLabel, bankValue, setValue, clearErrors, className = '' }: BankSelectionProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ionInputRef = useRef<HTMLIonInputElement>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const online = useOnlineStore((state) => state.online);
  

  const [data, setData] = useState<TBanks>({
    banks: [],
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
    const value: any = ionInputRef.current?.value;
    if(online){
      setLoading(true);
      try {
        const filter: any = { keyword: value, page, limit: 10 };
        const result = await kfiAxios.get('/bank/selection', { params: filter });
        const { success, banks, totalPages, hasNextPage, hasPrevPage } = result.data;
        if (success) {
          setData(prev => ({
            ...prev,
            banks,
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
    } else {
       try {
        const limit = TABLE_LIMIT;
        let allData = await db.banks.toArray();
        let allOptions: Option[] = allData.map(item => ({
          _id: item._id,
          code: item.code || '',       
          description: item.description || '',
        }));
         if (value) {
          allOptions = allOptions.filter(
            opt =>
              opt.code.toLowerCase().includes(value) ||
              opt.description.includes(value)
          );
        }
       const totalItems = allOptions.length;
        const totalPages = Math.ceil(totalItems / limit);
        const start = (page - 1) * limit;
        const end = start + limit;
        const finalData = allOptions.slice(start, end);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        setData(prev => ({
           ...prev,
          banks: finalData,
          totalPages: totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
        }));
        setCurrentPage(page);
      } catch (error) {
        console.error("Erro while fetching data.", error);
      } finally {
        setData(prev => ({ ...prev, loading: false }));
      }
    }
  };

  const handleSelectBusinessType = (bank: Option) => {
    const typeValue = `${bank.code}` as PathValue<T, Path<T>>;
    const idValue = bank._id as PathValue<T, Path<T>>;
    setValue(bankLabel as Path<T>, typeValue as any);
    setValue(bankValue as Path<T>, idValue as any);
    clearErrors(bankLabel);
    clearErrors(bankValue);
    setData({
      banks: [],
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
      <IonButton onClick={handleOpen} fill="clear" className={classNames('max-h-9 min-h-9 btn-color text-white capitalize font-semibold rounded-md m-0 text-xs', className)} strong>
        <Search01Icon size={15} stroke='.8' className=' mr-1'/>
        Find
      </IonButton>

      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.7rem] auto-height [--max-width:42rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-10">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Bank Selection" />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6  border-2 !border-slate-100">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Bank Selection" />

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
                    disabled={loading}
                    className={classNames(
                      'text-sm !bg-white rounded-md !px-2 ![--highlight-color-focused:none] md:![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-slate-400 ![--min-height:1rem] !min-h-[1rem]',
                    )}
                  />
                </FormIonItem>
                <IonButton
                  onClick={() => handleSearch(1)}
                  type="button"
                  fill="clear"
                  className="max-h-10 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md text-xs"
                  strong
                >
                  <Search01Icon size={15} stroke='.8' className=' mr-1'/>
                  {loading ? 'Finding...' : 'Find'}
                </IonButton>
              </div>
            </div>
          </div>
          <div className="relative overflow-auto">
            <Table>
              <TableHeader>
                <TableHeadRow className="border-b-0 bg-slate-100">
                  <TableHead className="!py-2">Code</TableHead>
                  <TableHead className="!py-2">Description</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {loading && <TableLoadingRow colspan={2} />}
                {!loading && data.banks.length < 1 && <TableNoRows colspan={2} label="No bank found" />}
                {!loading &&
                  data.banks.map((data: Option) => (
                    <TableRow onClick={() => handleSelectBusinessType(data)} key={data._id} className="border-b-0 [&>td]:!py-1 cursor-pointer">
                      <TableCell className="">{data.code}</TableCell>
                      <TableCell className="">{data.description}</TableCell>
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

export default BankSelection;
