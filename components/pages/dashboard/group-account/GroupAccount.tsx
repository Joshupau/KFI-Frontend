import { IonButton, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import CreateGroupAccount from './modals/CreateGroupAccount';
import GroupAccountFilter from './components/GroupAccountFilter';
import GroupAccountActions from './components/GroupAccountActions';
import { AccessToken, GroupAccount as GroupAccountType, TTableFilter } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { jwtDecode } from 'jwt-decode';
import { canDoAction, haveActions } from '../../../utils/permissions';
import { useOnlineStore } from '../../../../store/onlineStore';
import { db } from '../../../../database/db';
import { filterAndSortGOA } from '../../../ui/utils/sort';
import { Upload } from 'lucide-react';

export type TGroupAccount = {
  groupAccounts: GroupAccountType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const GroupAccount = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const online = useOnlineStore((state) => state.online);
  const [uploading, setUploading] = useState<boolean>(false)
  
  

  const [data, setData] = useState<TGroupAccount>({
    groupAccounts: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getGroupAccounts = async (page: number, keyword: string = '', sort: string = '') => {
    if(online){
      setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      const result = await kfiAxios.get('/group-account', { params: filter });
      const { success, groupAccounts, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          groupAccounts: groupAccounts,
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
        message: 'Failed to get group account records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
    } else {
       setData(prev => ({ ...prev, loading: true }));

            
                try {
                  const limit = TABLE_LIMIT;
            
                  let data = await db.groupOfAccounts.toArray();

                  const filteredData = data.filter(e => !e.deletedAt);
                  let allData = filterAndSortGOA(filteredData, keyword, sort);
            
                  const totalItems = allData.length;
                  const totalPages = Math.ceil(totalItems / limit);
            
                  const start = (page - 1) * limit;
                  const end = start + limit;
            
                  const goa = allData.slice(start, end);
            
                  const hasPrevPage = page > 1;
                  const hasNextPage = page < totalPages;
            
                  setData(prev => ({
                    ...prev,
                    groupAccounts: goa,
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

    const uploadGroups = async () => {
      setUploading(true)
      try {
        const groupAccountLists = await db.groupOfAccounts.toArray();
        const offlineChanges = groupAccountLists.filter(e => e._synced === false);
        const result = await kfiAxios.put("sync/upload/group-of-accounts", { groupAccounts: offlineChanges });
        const { success } = result.data;
        if (success) {
          setUploading(false)
           present({
              message: 'Offline changes saved!',
              duration: 1000,
            });
          getGroupAccounts(1);
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

  const handlePagination = (page: number) => getGroupAccounts(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getGroupAccounts(currentPage);
  });


  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <PageTitle pages={['System', 'Loan Products', 'Group Account']} />
          <div className="px-3 pb-3 flex-1 flex flex-col">
            

            <div className=" p-4 pb-5 bg-white rounded-xl flex-1 shadow-lg">

              <div className=" flex lg:flex-row flex-col items-start justify-start">
                <div className=' flex flex-wrap items-center gap-2'>
                  {canDoAction(token.role, token.permissions, 'group of account', 'create') && <CreateGroupAccount getGroupAccounts={getGroupAccounts} />}
                 {!online && (
                    <IonButton disabled={uploading} onClick={uploadGroups} fill="clear" id="create-center-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
                      <Upload size={15} className=' mr-1'/> {uploading ? 'Uploading...' : 'Upload'}
                    </IonButton>
                  )}
                </div>
                <GroupAccountFilter getGroupAccounts={getGroupAccounts} />
              </div>
              <div className="relative overflow-auto rounded-xl mt-4">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>Group Account</TableHead>
                      {haveActions(token.role, 'group of account', token.permissions, ['update', 'delete']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={2} />}
                    {!data.loading && data.groupAccounts.length < 1 && <TableNoRows label="No Group Account Record Found" colspan={2} />}
                    {!data.loading &&
                      data.groupAccounts.length > 0 &&
                      data.groupAccounts.map((groupAccount: GroupAccountType) => (
                        <TableRow key={groupAccount._id}>
                          <TableCell>{groupAccount.code}</TableCell>
                          {haveActions(token.role, 'group of account', token.permissions, ['update', 'delete']) && (
                            <TableCell>
                              <GroupAccountActions
                                groupAccount={groupAccount}
                                setData={setData}
                                getGroupAccounts={getGroupAccounts}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                rowLength={data.groupAccounts.length}
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

export default GroupAccount;
