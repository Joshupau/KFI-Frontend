import { IonButton, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import CreateWeeklySavingTable from './modals/CreateWeeklySavingTable';
import WeeklySavingTableFilter from './components/WeeklySavingTableFilter';
import WeeklySavingTableActions from './components/WeeklySavingTableActions';
import { AccessToken, TTableFilter, WeeklySavings } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { formatNumber } from '../../../ui/utils/formatNumber';
import { jwtDecode } from 'jwt-decode';
import { canDoAction, haveActions } from '../../../utils/permissions';
import PrintAllWeeklySavingsTable from './modals/PrintAllWeeklySavingsTable';
import ExportAllWeeklySavingsTable from './modals/ExportAllWeeklySavingsTable';
import { useOnlineStore } from '../../../../store/onlineStore';
import { db } from '../../../../database/db';
import { filterAndSortSavings } from '../../../ui/utils/sort';
import { Upload } from 'lucide-react';

export type TWeeklySavingsTable = {
  savings: WeeklySavings[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const WeeklySavingTable = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const online = useOnlineStore((state) => state.online);
  const [uploading, setUploading] = useState<boolean>(false)

  const [data, setData] = useState<TWeeklySavingsTable>({
    savings: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getWeeklySavings = async (page: number, keyword: string = '', sort: string = '') => {
    if(online){
      setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      const result = await kfiAxios.get('/weekly-saving', { params: filter });
      const { success, weelySavings, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          savings: weelySavings,
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
        message: 'Failed to get weekly saving records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
    } else {
      setData(prev => ({ ...prev, loading: true }));
      try {
        const limit = TABLE_LIMIT;
        let data = await db.weeklySavings.toArray();
        const filteredData = data.filter(e => !e.deletedAt);
        let allData = filterAndSortSavings(filteredData, keyword, sort);
        const totalItems = allData.length;
        const totalPages = Math.ceil(totalItems / limit);
        const start = (page - 1) * limit;
        const end = start + limit;
        const finalData = allData.slice(start, end);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        console.log(finalData)
        setData(prev => ({
          ...prev,
          savings: finalData,
          totalPages,
          prevPage: hasPrevPage,
          nextPage: hasNextPage,
        }));
        setCurrentPage(page);
        setSearchKey(keyword);
        setSortKey(sort);
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
        const list = await db.weeklySavings.toArray();
        const offlineChanges = list.filter(e => e._synced === false);
        const result = await kfiAxios.put("sync/upload/weekly-savings", { weeklySavings: offlineChanges });
        const { success } = result.data;
        if (success) {
          setUploading(false)
           present({
              message: 'Offline changes saved!',
              duration: 1000,
            });
          getWeeklySavings(1);
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

  const handlePagination = (page: number) => getWeeklySavings(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getWeeklySavings(currentPage);
  });

  return (
    <IonPage className="w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F1F1F1] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <div>
            <PageTitle pages={['System', 'Weekly Savings']} />
          </div>
          <div className="px-3 pb-3 flex-1">
            

            <div className="px-3 pt-3 pb-5 bg-white rounded-xl flex-1 shadow-lg">
              <div className="flex flex-col lg:flex-row items-start justify-start gap-3 ">
                <div className=' flex flex-wrap gap-2'>
                  {canDoAction(token.role, token.permissions, 'weekly savings', 'print') && <PrintAllWeeklySavingsTable />}
                  {canDoAction(token.role, token.permissions, 'weekly savings', 'export') && <ExportAllWeeklySavingsTable />}
                  {online && (
                      <IonButton disabled={uploading} onClick={uploadChanges} fill="clear" id="create-center-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
                        <Upload size={15} className=' mr-1'/> {uploading ? 'Uploading...' : 'Upload'}
                      </IonButton>
                    )}
                </div>
                <WeeklySavingTableFilter getWeeklySavings={getWeeklySavings} />
              </div>
              <div className="relative overflow-auto rounded-xl mt-4">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>Range Amount From</TableHead>
                      <TableHead>Range Amount To</TableHead>
                      <TableHead>WSF</TableHead>
                      {haveActions(token.role, 'weekly savings', token.permissions, ['update', 'delete']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={4} />}
                    {!data.loading && data.savings.length < 1 && <TableNoRows label="No Weekly Saving Record Found" colspan={4} />}
                    {!data.loading &&
                      data.savings.length > 0 &&
                      data.savings.map((saving: WeeklySavings) => (
                        <TableRow key={saving._id}>
                          <TableCell>{formatNumber(saving.rangeAmountFrom)}</TableCell>
                          <TableCell>{formatNumber(saving.rangeAmountTo)}</TableCell>
                          <TableCell>{formatNumber(saving.weeklySavingsFund)}</TableCell>
                          {haveActions(token.role, 'weekly savings', token.permissions, ['update', 'delete']) && (
                            <TableCell>
                              <WeeklySavingTableActions
                                saving={saving}
                                setData={setData}
                                getWeeklySavings={getWeeklySavings}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                rowLength={data.savings.length}
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

export default WeeklySavingTable;
