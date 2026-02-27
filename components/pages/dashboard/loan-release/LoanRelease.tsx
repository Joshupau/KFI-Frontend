import { IonButton, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import CreateLoanRelease from './modals/CreateLoanRelease';
import LoanReleaseActions from './components/LoanReleaseActions';
import LoanReleaseFilter from './components/LoanReleaseFilter';
import { jwtDecode } from 'jwt-decode';
import { AccessToken, Transaction, TTableFilter } from '../../../../types/types';
import { canDoAction, haveActions } from '../../../utils/permissions';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { formatDateTable } from '../../../utils/date-utils';
import { formatMoney } from '../../../utils/number';
import TablePagination from '../../../ui/forms/TablePagination';
import PrintAllLoanRelease from './modals/PrintAllLoanRelease';
import ExportAllLoanRelease from './modals/ExportAllLoanRelease';
import { useOnlineStore } from '../../../../store/onlineStore';
import { db } from '../../../../database/db';
import { filterAndSortLoanRelease } from '../../../ui/utils/sort';
import { formatLoanReleaseForUpload, formatLoanReleaseList } from '../../../ui/utils/fomatData';
import { Upload } from 'lucide-react';
import Reports from './modals/Reports';

export type TData = {
  transactions: Transaction[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const LoanRelease = () => {
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
    transactions: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getTransactions = async (page: number, keyword: string = '', sort: string = '', to: string = '', from: string = '') => {
    if(online){
      setData(prev => ({ ...prev, loading: true }));
      try {
        const filter: TTableFilter & { to?: string; from?: string } = { limit: TABLE_LIMIT, page };
        if (keyword) filter.search = keyword;
        if (sort) filter.sort = sort;
        if (to) filter.to = to;
        if (from) filter.from = from;

        const result = await kfiAxios.get('/transaction/loan-release', { params: filter });
        const { success, transactions, hasPrevPage, hasNextPage, totalPages } = result.data;
        if (success) {
          setData(prev => ({
            ...prev,
            transactions: transactions,
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
          message: 'Failed to get loan release records. Please try again',
          duration: 1000,
        });
      } finally {
        setData(prev => ({ ...prev, loading: false }));
      }
    } else {
       setData(prev => ({ ...prev, loading: true }));
       try {
         const limit = TABLE_LIMIT;
         let data = await db.loanReleases.toArray();
         const filteredData = data.filter(e => !e.deletedAt);
         let allData = filterAndSortLoanRelease(formatLoanReleaseList(filteredData), keyword, sort, from, to);
         const totalItems = allData.length;
         const totalPages = Math.ceil(totalItems / limit);
         const start = (page - 1) * limit;
         const end = start + limit;
         const finalData = allData.slice(start, end);
         const hasPrevPage = page > 1;
         const hasNextPage = page < totalPages;
         setData(prev => ({
           ...prev,
           transactions: finalData,
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
        const list = await db.loanReleases.toArray();
        const offlineChanges = list.filter(e => e._synced === false);
         const formatted = offlineChanges.map(formatLoanReleaseForUpload);

        const result = await kfiAxios.put("sync/upload/loan-releases", { loanReleases: formatted });
        const { success } = result.data;
        if (success) {
          setUploading(false)
           present({
              message: 'Offline changes saved!',
              duration: 1000,
            });
          getTransactions(currentPage);
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

  const handlePagination = (page: number) => getTransactions(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getTransactions(currentPage);
  });

  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 items-stretch justify-start py-6">
          <PageTitle pages={['Transaction', 'Loan Release']} />
          <div className="px-3 pb-3 flex-1 flex flex-col">
          

            <div className=" p-4 pb-5 bg-white rounded-xl flex-1 shadow-lg">
                <div className=" bg-white flex flex-col gap-4 flex-wrap">
                 
                  <div className="flex items-center flex-wrap">
                    <div>{canDoAction(token.role, token.permissions, 'loan release', 'create') && <CreateLoanRelease getTransactions={getTransactions} />}</div>
                    <div>{canDoAction(token.role, token.permissions, 'loan release', 'print') && <PrintAllLoanRelease />}</div>
                    <div>{canDoAction(token.role, token.permissions, 'loan release', 'export') && <ExportAllLoanRelease />}</div>
                    <div><Reports /></div>
                    {online && (
                      <IonButton disabled={uploading} onClick={uploadChanges} fill="clear" id="create-center-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
                        <Upload size={15} className=' mr-1'/> {uploading ? 'Uploading...' : 'Upload'}
                      </IonButton>
                    )}
                  </div>

                   <div className="w-full flex-1 flex">
                    <LoanReleaseFilter getTransactions={getTransactions} />
                  </div>
                </div>
              <div className="relative overflow-auto rounded-xl mt-4">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead className="min-w-44 max-w-44 sticky left-0">CV Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>CHK. No.</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Encoded By</TableHead>
                      {haveActions(token.role, 'loan release', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={8} />}
                    {!data.loading && data.transactions.length < 1 && <TableNoRows label="No Loan Release Record Found" colspan={8} />}
                    {!data.loading &&
                      data.transactions.length > 0 &&
                      data.transactions.map((transaction: Transaction, i: number) => (
                        <TableRow key={transaction._id}>
                          <TableCell className="min-w-44 max-w-44 sticky left-0 bg-white">{transaction.code}</TableCell>
                          <TableCell>{formatDateTable(transaction.date)}</TableCell>
                          <TableCell className="max-w-52 truncate">{transaction.bank?.description}</TableCell>
                          <TableCell>{transaction.checkNo}</TableCell>
                          <TableCell>{formatMoney(transaction.amount)}</TableCell>
                          <TableCell>{transaction.encodedBy?.username}</TableCell>
                          {haveActions(token.role, 'loan release', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && (
                            <TableCell>
                              <LoanReleaseActions
                                transaction={transaction}
                                getTransactions={getTransactions}
                                setData={setData}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                to={to}
                                from={from}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                rowLength={data.transactions.length}
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

export default LoanRelease;
