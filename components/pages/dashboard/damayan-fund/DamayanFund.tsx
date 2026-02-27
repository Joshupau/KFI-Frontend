import { IonButton, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import { canDoAction, haveActions } from '../../../utils/permissions';
import { AccessToken, DamayanFund as DamayanFundType, TTableFilter } from '../../../../types/types';
import { jwtDecode } from 'jwt-decode';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { formatDateTable } from '../../../utils/date-utils';
import { formatMoney } from '../../../utils/number';
import TablePagination from '../../../ui/forms/TablePagination';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import DamayanFundFilter from './components/DamayanFundFilter';
import CreateDamayanFund from './modals/CreateDamayanFund';
import PrintAllDamayanFund from './modals/prints/PrintAllDamayanFund';
import ExportAllDamayanFund from './modals/prints/ExportAllDamayanFund';
import DamayanFundActions from './components/DamayanFundActions';
import { useOnlineStore } from '../../../../store/onlineStore';
import { filterAndSortLoanRelease } from '../../../ui/utils/sort';
import { formatDFForUpload, formatELList } from '../../../ui/utils/fomatData';
import { db } from '../../../../database/db';
import { Upload } from 'lucide-react';

export type TData = {
  damayanFunds: DamayanFundType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const DamayanFund = () => {
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
    damayanFunds: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getDamayanFunds = async (page: number, keyword: string = '', sort: string = '', to: string = '', from: string = '') => {
    if(online){
      setData(prev => ({ ...prev, loading: true }));
      try {
        const filter: TTableFilter & { to?: string; from?: string } = { limit: TABLE_LIMIT, page };
        if (keyword) filter.search = keyword;
        if (sort) filter.sort = sort;
        if (to) filter.to = to;
        if (from) filter.from = from;

        const result = await kfiAxios.get('/damayan-fund', { params: filter });
        const { success, damayanFunds, hasPrevPage, hasNextPage, totalPages } = result.data;
        if (success) {
          setData(prev => ({
            ...prev,
            damayanFunds,
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
          message: 'Failed to get damayan fund records. Please try again',
          duration: 1000,
        });
      } finally {
        setData(prev => ({ ...prev, loading: false }));
      }
    } else {
      setData(prev => ({ ...prev, loading: true }));
       try {
         const limit = TABLE_LIMIT;
         let data = await db.damayanFunds.toArray();
         const filteredData = data.filter(e => !e.deletedAt);
        let allData = filterAndSortLoanRelease(formatELList(filteredData), keyword, sort, from, to);
         console.log(data)
         const totalItems = allData.length;
         const totalPages = Math.ceil(totalItems / limit);
         const start = (page - 1) * limit;
         const end = start + limit;
         const finalData = allData.slice(start, end);
         const hasPrevPage = page > 1;
         const hasNextPage = page < totalPages;
          setData(prev => ({
            ...prev,
            damayanFunds: finalData,
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
            const list = await db.damayanFunds.toArray();
            const offlineChanges = list.filter(e => e._synced === false);
            const finalData = formatDFForUpload(offlineChanges)

            console.log(finalData)
          
    
            const result = await kfiAxios.put("sync/upload/damayan-funds", { damayanFunds: finalData });
            const { success } = result.data;
            if (success) {
              setUploading(false)
               present({
                  message: 'Offline changes saved!',
                  duration: 1000,
                });
              getDamayanFunds(currentPage);
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

  const handlePagination = (page: number) => getDamayanFunds(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getDamayanFunds(currentPage);
  });

  return (
    <IonPage className="  w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <PageTitle pages={['Transaction', 'Damayan Fund']} />
          <div className="px-3 pb-3 flex-1 flex flex-col">
           

            <div className="px-3 pt-3 pb-5 bg-white rounded-xl flex-1 shadow-lg">

               <div className=" flex flex-col gap-4 flex-wrap">
                
                <div className="flex items-start flex-wrap">
                  <div>{canDoAction(token.role, token.permissions, 'damayan fund', 'create') && <CreateDamayanFund getDamayanFunds={getDamayanFunds} />}</div>
                  <div>{canDoAction(token.role, token.permissions, 'damayan fund', 'print') && <PrintAllDamayanFund />}</div>
                  <div>{canDoAction(token.role, token.permissions, 'damayan fund', 'export') && <ExportAllDamayanFund />}</div>
                  {online && (
                    <IonButton disabled={uploading} onClick={uploadChanges} fill="clear" id="create-center-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
                      <Upload size={15} className=' mr-1'/> {uploading ? 'Uploading...' : 'Upload'}
                    </IonButton>
                  )}
                </div>

                <div className="w-full flex-1 flex ">
                  <DamayanFundFilter getDamayanFunds={getDamayanFunds} />
                </div>
              </div>
              <div className="relative overflow-auto rounded-xl mt-4">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>JV Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>CHK. No.</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Encoded By</TableHead>
                      {haveActions(token.role, 'damayan fund', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={8} />}
                    {!data.loading && data.damayanFunds.length < 1 && <TableNoRows label="No Damayan Fund Record Found" colspan={8} />}
                    {!data.loading &&
                      data.damayanFunds.length > 0 &&
                      data.damayanFunds.map((damayanFund: DamayanFundType, i: number) => (
                        <TableRow key={damayanFund._id}>
                          <TableCell>{damayanFund.code}</TableCell>
                          <TableCell>{formatDateTable(damayanFund.date)}</TableCell>
                          <TableCell>{damayanFund.bankCode.description}</TableCell>
                          <TableCell>{damayanFund.checkNo}</TableCell>
                          <TableCell>{formatMoney(damayanFund.amount)}</TableCell>
                          <TableCell>{damayanFund.encodedBy.username}</TableCell>
                          {haveActions(token.role, 'damayan fund', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && (
                            <TableCell>
                              <DamayanFundActions
                                damayanFund={damayanFund}
                                getDamayanFunds={getDamayanFunds}
                                setData={setData}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                to={to}
                                from={from}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                rowLength={data.damayanFunds.length}
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

export default DamayanFund;
