import { IonButton, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import CreateExpenseVoucher from './modals/CreateExpenseVoucher';
import ExpenseVoucherFilter from './components/ExpenseVoucherFilter';
import ExpenseVoucherActions from './components/ExpenseVoucherActions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import { AccessToken, ExpenseVoucher as ExpenseVoucherType, TTableFilter } from '../../../../types/types';
import { jwtDecode } from 'jwt-decode';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import { formatDateTable } from '../../../utils/date-utils';
import { formatNumber } from '../../../ui/utils/formatNumber';
import { canDoAction, haveActions } from '../../../utils/permissions';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import TablePagination from '../../../ui/forms/TablePagination';
import PrintAllExpenseVoucher from './modals/prints/PrintAllExpenseVoucher';
import ExportAllExpenseVoucher from './modals/prints/ExportAllExpenseVoucher';
import { useOnlineStore } from '../../../../store/onlineStore';
import { db } from '../../../../database/db';
import { filterAndSortLoanRelease } from '../../../ui/utils/sort';
import { formatEVList, formatJV, formatJVForUpload } from '../../../ui/utils/fomatData';
import { Upload } from 'lucide-react';

export type TData = {
  expenseVouchers: ExpenseVoucherType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const ExpenseVoucher = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const online = useOnlineStore((state) => state.online);
  const [uploading, setUploading] = useState<boolean>(false)

  const [data, setData] = useState<TData>({
    expenseVouchers: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getExpenseVouchers = async (page: number, keyword: string = '', sort: string = '', to: string = '', from: string = '') => {
    if(online){
      setData(prev => ({ ...prev, loading: true }));
      try {
        const filter: TTableFilter & { to?: string; from?: string } = { limit: TABLE_LIMIT, page };
        if (keyword) filter.search = keyword;
        if (sort) filter.sort = sort;
        if (to) filter.to = to;
        if (from) filter.from = from;

        const result = await kfiAxios.get('/expense-voucher', { params: filter });
        const { success, expenseVouchers, hasPrevPage, hasNextPage, totalPages } = result.data;
        if (success) {
          setData(prev => ({
            ...prev,
            expenseVouchers: expenseVouchers,
            totalPages: totalPages,
            nextPage: hasNextPage,
            prevPage: hasPrevPage,
          }));
          setCurrentPage(page);
          setSearchKey(keyword);
          setSortKey(sort);
          setFrom(from);
          setTo(to);
          return;
        }
      } catch (error) {
        present({
          message: 'Failed to get expense voucher records. Please try again',
          duration: 1000,
        });
      } finally {
        setData(prev => ({ ...prev, loading: false }));
      }
    } else {
       setData(prev => ({ ...prev, loading: true }));
       try {
         const limit = TABLE_LIMIT;
         let data = await db.expenseVouchers.toArray();

         console.log(data)
         const filteredData = data.filter(e => !e.deletedAt);
        let allData = filterAndSortLoanRelease(formatEVList(filteredData), keyword, sort, from, to);
         const totalItems = allData.length;
         const totalPages = Math.ceil(totalItems / limit);
         const start = (page - 1) * limit;
         const end = start + limit;
         const finalData = allData.slice(start, end);
         const hasPrevPage = page > 1;
         const hasNextPage = page < totalPages;
          setData(prev => ({
            ...prev,
            expenseVouchers: finalData,
            totalPages,
            prevPage: hasPrevPage,
            nextPage: hasNextPage,
          }));
         setCurrentPage(page);
         setSearchKey(keyword);
         setSortKey(sort);
         setFrom(from);
         setTo(to);
       } catch (error) {
         console.log(error)
         present({
           message: 'Failed to load records.',
           duration: 1000,
         });
       } finally {
         setData(prev => ({ ...prev, loading: false }));
       }
    }
  };

   const uploadChanges = async () => {
          setUploading(true)
          try {
            const list = await db.expenseVouchers.toArray();
            const offlineChanges = list.filter(e => e._synced === false);
            console.log(offlineChanges)
          
    
            const result = await kfiAxios.put("sync/upload/expense-vouchers", { expenseVouchers: offlineChanges });
            const { success } = result.data;
            if (success) {
              setUploading(false)
               present({
                  message: 'Offline changes saved!',
                  duration: 1000,
                });
              getExpenseVouchers(currentPage);
              setUploading(false)
    
            }
          } catch (error: any) {
              setUploading(false)
              console.log(error)
    
              present({
                message: `${error.response.data.error.message}`,
                duration: 1000,
              });
          }
      };

  const handlePagination = (page: number) => getExpenseVouchers(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getExpenseVouchers(currentPage);
  });

  console.log(data)
  return (
    <IonPage className="w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 items-stretch justify-start py-6">
          <PageTitle pages={['Transaction', 'Expense Voucher']} />
          <div className="px-3 pb-3 flex-1 flex flex-col">
           

            <div className=" p-4 pb-5 bg-white rounded-xl flex-1 shadow-lg">
               <div className=" flex flex-col gap-4 flex-wrap">
              
                <div className="flex items-start flex-wrap w-fit">
                  <div>{canDoAction(token.role, token.permissions, 'expense voucher', 'create') && <CreateExpenseVoucher getExpenseVouchers={getExpenseVouchers} />}</div>
                  <div>{canDoAction(token.role, token.permissions, 'expense voucher', 'print') && <PrintAllExpenseVoucher />}</div>
                  <div>{canDoAction(token.role, token.permissions, 'expense voucher', 'export') && <ExportAllExpenseVoucher />}</div>
                  {online && (
                    <IonButton disabled={uploading} onClick={uploadChanges} fill="clear" id="create-center-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
                      <Upload size={15} className=' mr-1'/> {uploading ? 'Uploading...' : 'Upload'}
                    </IonButton>
                  )}
                </div>

                  <div className="w-full flex-1 flex">
                  <ExpenseVoucherFilter getExpenseVouchers={getExpenseVouchers} />
                </div>
              </div>
              <div className="relative overflow-auto rounded-xl mt-4">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>Doc. No.</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>CHK. No.</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Encoded By</TableHead>
                      {haveActions(token.role, 'expense voucher', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={8} />}
                    {!data.loading && data.expenseVouchers.length < 1 && <TableNoRows label="No Expense Voucher Record Found" colspan={8} />}
                    {!data.loading &&
                      data.expenseVouchers.map((expenseVoucher: ExpenseVoucherType, i: number) => (
                        <TableRow key={expenseVoucher._id}>
                          <TableCell>{expenseVoucher.code}</TableCell>
                          <TableCell>{formatDateTable(expenseVoucher.date)}</TableCell>
                          <TableCell>{expenseVoucher.bankCode.description}</TableCell>
                          <TableCell>{expenseVoucher.checkNo}</TableCell>
                          <TableCell>{formatNumber(expenseVoucher.amount)}</TableCell>
                          <TableCell>{expenseVoucher.encodedBy.username}</TableCell>
                          {haveActions(token.role, 'expense voucher', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && (
                            <TableCell>
                              <ExpenseVoucherActions
                                expenseVoucher={expenseVoucher}
                                getExpenseVouchers={getExpenseVouchers}
                                setData={setData}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                to={to}
                                from={from}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                rowLength={data.expenseVouchers.length}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ExpenseVoucher;
