import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import { canDoAction, haveActions } from '../../../utils/permissions';
import { AccessToken, Release as ReleaseType, TTableFilter } from '../../../../types/types';
import { jwtDecode } from 'jwt-decode';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { formatMoney } from '../../../utils/number';
import { formatDateTable } from '../../../utils/date-utils';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import AcknowledgementActions from './components/ReleaseActions';
import TablePagination from '../../../ui/forms/TablePagination';
import ReleaseFilter from './components/ReleaseFilter';
import CreateRelease from './modals/CreateRelease';
import PrintAllRelease from './modals/prints/PrintAllRelease';
import ExportAllRelease from './modals/prints/ExportAllRelease';
import ReleaseActions from './components/ReleaseActions';
import { useOnlineStore } from '../../../../store/onlineStore';
import { db } from '../../../../database/db';
import { filterAndSortLoanRelease } from '../../../ui/utils/sort';
import { formatELList } from '../../../ui/utils/fomatData';

export type TData = {
  releases: ReleaseType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const Release = () => {
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
    releases: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getReleases = async (page: number, keyword: string = '', sort: string = '', to: string = '', from: string = '') => {
    if(online){
      setData(prev => ({ ...prev, loading: true }));
      try {
        const filter: TTableFilter & { to?: string; from?: string } = { limit: TABLE_LIMIT, page };
        if (keyword) filter.search = keyword;
        if (sort) filter.sort = sort;
        if (to) filter.to = to;
        if (from) filter.from = from;

        const result = await kfiAxios.get('/release', { params: filter });
        const { success, releases, hasPrevPage, hasNextPage, totalPages } = result.data;
        if (success) {
          setData(prev => ({
            ...prev,
            releases,
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
          message: 'Failed to get release records. Please try again',
          duration: 1000,
        });
      } finally {
        setData(prev => ({ ...prev, loading: false }));
      }
    } else {
      setData(prev => ({ ...prev, loading: true }));
           try {
             const limit = TABLE_LIMIT;
            let data = await db.acknowledgementReceipts.toArray();
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
                releases: finalData,
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

  const handlePagination = (page: number) => getReleases(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getReleases(currentPage);
  });

  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 items-stretch justify-start py-6">
          <PageTitle pages={['Transaction', 'Acknowledgement Receipt']} />
          <div className="px-3 pb-3 flex-1 flex flex-col">
          

            <div className=" p-4 pb-5 bg-white rounded-xl flex-1 shadow-lg">
                <div className=" flex flex-col gap-4 flex-wrap">
               
                <div className="flex items-start flex-wrap">
                  <div>{canDoAction(token.role, token.permissions, 'release', 'create') && <CreateRelease getReleases={getReleases} />}</div>
                  <div>{canDoAction(token.role, token.permissions, 'release', 'print') && <PrintAllRelease />}</div>
                  <div>{canDoAction(token.role, token.permissions, 'release', 'export') && <ExportAllRelease />}</div>
                </div>

                 <div className="w-full flex-1 flex ">
                  <ReleaseFilter getReleases={getReleases} />
                </div>
              </div>
              <div className="relative overflow-auto rounded-xl mt-4">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>AR Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>CHK. No.</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Encoded By</TableHead>
                      {haveActions(token.role, 'release', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && <TableHead>Actions</TableHead>}
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={8} />}
                    {!data.loading && data.releases.length < 1 && <TableNoRows label="No Acknowledgement Record Found" colspan={8} />}
                    {!data.loading &&
                      data.releases.length > 0 &&
                      data.releases.map((release: ReleaseType) => (
                        <TableRow key={release._id}>
                          <TableCell>{release.code}</TableCell>
                          <TableCell>{formatDateTable(release.date)}</TableCell>
                          <TableCell>{release.bankCode.description}</TableCell>
                          <TableCell>{release.checkNo}</TableCell>
                          <TableCell>{formatMoney(release.amount)}</TableCell>
                          <TableCell>{release.encodedBy.username}</TableCell>
                          {haveActions(token.role, 'release', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && (
                            <TableCell>
                              <ReleaseActions
                                release={release}
                                getReleases={getReleases}
                                setData={setData}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                to={to}
                                from={from}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                rowLength={data.releases.length}
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

export default Release;
