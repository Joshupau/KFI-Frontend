import { IonButton, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import CreateCenter from './modals/CreateCenter';
import CenterFilter from './components/CenterFilter';
import CenterActions from './components/CenterActions';
import { AccessToken, Center as CenterType, TTableFilter } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { canDoAction, haveActions } from '../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';
import PrintAllCenter from './modals/PrintAllCenter';
import ExportAllCenter from './modals/ExportAllCenter';
import { useOnlineStore } from '../../../../store/onlineStore';
import { db } from '../../../../database/db';
import { filterAndSortCenter } from '../../../ui/utils/sort';
import { Upload } from 'lucide-react';

export type TCenter = {
  centers: CenterType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const Center = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false)
  const online = useOnlineStore((state) => state.online);
  

  const [data, setData] = useState<TCenter>({
    centers: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });


  const getCenters = async (page: number, keyword: string = '', sort: string = '') => {
    if(online){
       setData(prev => ({ ...prev, loading: true }));
      try {
        const filter: TTableFilter = { limit: TABLE_LIMIT, page };
        if (keyword) filter.search = keyword;
        if (sort) filter.sort = sort;
        const result = await kfiAxios.get('/center', { params: filter });
        const { success, centers, hasPrevPage, hasNextPage, totalPages } = result.data;
        if (success) {
          setData(prev => ({
            ...prev,
            centers: centers,
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
          message: 'Failed to get center records. Please try again',
          duration: 1000,
        });
      } finally {
        setData(prev => ({ ...prev, loading: false }));
      }
    }else{
      setData(prev => ({ ...prev, loading: true }));
      
          try {
            const limit = TABLE_LIMIT;
      
            let data = await db.centers.toArray();
            const filteredCenters = data.filter(e => !e.deletedAt);
            let allData = filterAndSortCenter(filteredCenters, keyword, sort);
      
            const totalItems = allData.length;
            const totalPages = Math.ceil(totalItems / limit);
      
            const start = (page - 1) * limit;
            const end = start + limit;
      
            const centers = allData.slice(start, end);
      
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
      
            setData(prev => ({
              ...prev,
              centers: centers,
              totalPages,
              prevPage: hasPrevPage,
              nextPage: hasNextPage,
            }));

            console.log(centers)
      
            setCurrentPage(page);
            setSearchKey(keyword);
            setSortKey(sort);
          } catch (error) {
            present({
              message: 'Failed to load offline records.',
              duration: 1000,
            });
          } finally {
            setData(prev => ({ ...prev, loading: false }));
          }
    }
   
  };

  const handlePagination = (page: number) => getCenters(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getCenters(currentPage);
  });

  const uploadCenters = async () => {
    setUploading(true)
    try {
      const centerLists = await db.centers.toArray();
      const offlineChanges = centerLists.filter(e => e._synced === false);
      const result = await kfiAxios.put("sync/upload/centers", { centers: offlineChanges });
      const { success } = result.data;
      if (success) {
        // alert("Offline changes saved!");
        present({
          message: 'Offline changes saved!',
          duration: 1000,
        });
      setUploading(false)
        getCenters(1);
      }
    } catch (error) {
      setUploading(false)

      present({
        message: 'Failed to saved changes',
        duration: 1000,
      });
    }
  };

  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <PageTitle pages={['System', 'Center']} />
          <div className="px-3 pb-3 flex-1 flex flex-col">
            

            <div className=" p-4 pb-5 bg-white rounded-xl flex-1 shadow-lg">
              <div className="flex lg:flex-row flex-col gap-3">
                <div className="flex items-center flex-wrap gap-2">
                  {canDoAction(token.role, token.permissions, 'center', 'create') && <CreateCenter getCenters={getCenters} />}
                  {canDoAction(token.role, token.permissions, 'center', 'print') && <PrintAllCenter />}
                  {canDoAction(token.role, token.permissions, 'center', 'export') && <ExportAllCenter />}
                  {!online && (
                    <IonButton disabled={uploading} onClick={uploadCenters} fill="clear" id="create-center-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
                      <Upload size={15} className=' mr-1'/> {uploading ? 'Uploading...' : 'Upload'}
                    </IonButton>
                  )}
                </div>
                <CenterFilter getCenters={getCenters} />
              </div>
              <div className="relative overflow-auto rounded-xl mt-4">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>Center No.</TableHead>
                      <TableHead>Center Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Center Chief</TableHead>
                      <TableHead>Treasurer</TableHead>
                      <TableHead>Account Officer</TableHead>
                      {haveActions(token.role, 'center', token.permissions, ['update', 'delete', 'visible']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={7} />}
                    {!data.loading && data.centers.length < 1 && <TableNoRows label="No Center Record Found" colspan={7} />}
                    {!data.loading &&
                      data.centers.length > 0 &&
                      data.centers.map((center: CenterType) => (
                        <TableRow key={center._id}>
                          <TableCell>{center.centerNo}</TableCell>
                          <TableCell>{center.description}</TableCell>
                          <TableCell>{center.location}</TableCell>
                          <TableCell>{center.centerChief}</TableCell>
                          <TableCell>{center.treasurer}</TableCell>
                          <TableCell>{center.acctOfficer}</TableCell>
                          {haveActions(token.role, 'center', token.permissions, ['update', 'delete', 'visible']) && (
                            <TableCell>
                              <CenterActions
                                center={center}
                                setData={setData}
                                getCenters={getCenters}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                rowLength={data.centers.length}
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

export default Center;
