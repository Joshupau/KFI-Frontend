import { IonButton, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import ChartOfAccountFilter from './components/ChartOfAccountFilter';
import PageTitle from '../../../ui/page/PageTitle';
import { AccessToken, ChartOfAccount as ChartOfAccountType, TTableFilter } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { jwtDecode } from 'jwt-decode';
import PrintAllChartOfAccount from './modals/PrintAllChartOfAccount';
import ExportAllChartOfAccount from './modals/ExportAllChartOfAccount';
import ChartOfAccountActions from './components/ChartOfAccountActions';
import { canDoAction, haveActions } from '../../../utils/permissions';
import { useOnlineStore } from '../../../../store/onlineStore';
import { on } from 'events';
import { db } from '../../../../database/db';
import { filterAndSortCOA } from '../../../ui/utils/sort';
import { Upload } from 'lucide-react';

export type TChartOfAccount = {
  chartOfAccounts: ChartOfAccountType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const ChartOfAccount = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const online = useOnlineStore((state) => state.online);
  const [uploading, setUploading] = useState<boolean>(false)

  const [data, setData] = useState<TChartOfAccount>({
    chartOfAccounts: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getChartOfAccounts = async (page: number, keyword: string = '', sort: string = '') => {
   if(online){
     setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      const result = await kfiAxios.get('/chart-of-account', { params: filter });
      const { success, chartOfAccounts, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          chartOfAccounts: chartOfAccounts,
          totalPages: totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
        }));
        setCurrentPage(page);
        setSearchKey(keyword);
        setSortKey(sort);
        return;
      }
    } catch (error) {
      present({
        message: 'Failed to get chart of account records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
   } else {
     setData(prev => ({ ...prev, loading: true }));
    
                
                    try {
                      const limit = TABLE_LIMIT;
                
                      let data = await db.chartOfAccounts.toArray();
    
                      const filteredData = data.filter(e => !e.deletedAt);
                      let allData = filterAndSortCOA(filteredData, keyword, sort);
                
                      const totalItems = allData.length;
                      const totalPages = Math.ceil(totalItems / limit);
                
                      const start = (page - 1) * limit;
                      const end = start + limit;
                
                      const coa = allData.slice(start, end);
                
                      const hasPrevPage = page > 1;
                      const hasNextPage = page < totalPages;
                
                      setData(prev => ({
                        ...prev,
                        chartOfAccounts: coa,
                        totalPages,
                        prevPage: hasPrevPage,
                        nextPage: hasNextPage,
                      }));
          
                
                      setCurrentPage(page);
                      setSearchKey(keyword);
                      setSortKey(sort);
                    } catch (error) {
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
        const list = await db.chartOfAccounts.toArray();
        const offlineChanges = list.filter(e => e._synced === false);
        const result = await kfiAxios.put("sync/upload/chart-of-accounts", { groupAccounts: offlineChanges });
        const { success } = result.data;
        if (success) {
          setUploading(false)
           present({
              message: 'Offline changes saved!',
              duration: 1000,
            });
          getChartOfAccounts(1);
          setUploading(false)

        }
      } catch (error: any) {
          setUploading(false)

          present({
            message: `${error.response.data.error.message}`,
            duration: 1000,
          });
      }
  };

  const handlePagination = (page: number) => getChartOfAccounts(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getChartOfAccounts(currentPage);
  });

  return (
    <IonPage className="w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start gap-4 p-4">
          <div>
            <PageTitle pages={['System', 'Loan Products', 'Chart of Account']} />
          </div>
          <div className="px-3 pb-3 flex-1 flex flex-col">
          

            <div className="p-4 pb-5 bg-white rounded-xl flex-1 shadow-lg">
                <div className="flex lg:flex-row flex-col flex-wrap gap-2  ">
                  <div>
                    {canDoAction(token.role, token.permissions, 'chart of account', 'print') && <PrintAllChartOfAccount />}
                    {canDoAction(token.role, token.permissions, 'chart of account', 'export') && <ExportAllChartOfAccount />}
                    {/* {!online && (
                      <IonButton disabled={uploading} onClick={uploadChanges} fill="clear" id="create-center-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
                        <Upload size={15} className=' mr-1'/> {uploading ? 'Uploading...' : 'Upload'}
                      </IonButton>
                    )} */}
                  </div>
                  <ChartOfAccountFilter getChartOfAccounts={getChartOfAccounts} />
                </div>
              <div className="relative overflow-auto rounded-xl mt-4">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>Account Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Nature of Account</TableHead>
                      <TableHead>Classification</TableHead>
                      <TableHead>Department Status</TableHead>
                      {haveActions(token.role, 'chart of account', token.permissions, ['update']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={7} />}
                    {!data.loading && data.chartOfAccounts.length < 1 && <TableNoRows label="No Chart Of Account Record Found" colspan={7} />}
                    {!data.loading &&
                      data.chartOfAccounts.length > 0 &&
                      data.chartOfAccounts.map((chartAccount: ChartOfAccountType, i: number) => (
                        <TableRow key={i}>
                          <TableCell>{chartAccount.code}</TableCell>
                          <TableCell>{chartAccount.description}</TableCell>
                          <TableCell>{chartAccount.nature}</TableCell>
                          <TableCell>{chartAccount.classification}</TableCell>
                          <TableCell>{chartAccount.deptStatus}</TableCell>
                          {haveActions(token.role, 'chart of account', token.permissions, ['update']) && (
                            <TableCell>
                              <ChartOfAccountActions
                                chartAccount={chartAccount}
                                setData={setData}
                                getChartOfAccounts={getChartOfAccounts}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                rowLength={data.chartOfAccounts.length}
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

export default ChartOfAccount;
