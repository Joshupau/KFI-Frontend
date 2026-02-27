import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import TablePagination from '../../../ui/forms/TablePagination';
import { AccessToken, Status as StatusType, TTableFilter } from '../../../../types/types';
import CreateStatus from './modals/CreateStatus';
import StatusFilter from './components/StatusFilter';
import StatusActions from './components/StatusActions';
import { canDoAction, haveActions } from '../../../utils/permissions';
import { jwtDecode } from 'jwt-decode';

export type TStatus = {
  statuses: StatusType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const Status = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');

  const [data, setData] = useState<TStatus>({
    statuses: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getStatuses = async (page: number, keyword: string = '', sort: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      const result = await kfiAxios.get('/status', { params: filter });
      const { success, statuses, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          statuses: statuses,
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
        message: 'Failed to get status records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getStatuses(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getStatuses(currentPage);
  });

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['All Files', 'Status']} />
          <div className="px-3 pb-3 flex-1">
            <div className="flex items-center justify-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-lg mt-3 mb-4">
              <div>{canDoAction(token.role, token.permissions, 'loans', 'create') && <CreateStatus getStatuses={getStatuses} />}</div>
              <StatusFilter getStatuses={getStatuses} />
            </div>
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    {haveActions(token.role, 'loans', token.permissions, ['update', 'delete']) && <TableHead>Actions</TableHead>}
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {data.loading && <TableLoadingRow colspan={3} />}
                  {!data.loading && data.statuses.length < 1 && <TableNoRows label="No Status Record Found" colspan={3} />}
                  {!data.loading &&
                    data.statuses.length > 0 &&
                    data.statuses.map((status: StatusType) => (
                      <TableRow key={status._id}>
                        <TableCell>{status.code}</TableCell>
                        <TableCell>{status.description}</TableCell>
                        {haveActions(token.role, 'loans', token.permissions, ['update', 'delete']) && (
                          <TableCell>
                            <StatusActions
                              status={status}
                              setData={setData}
                              getStatuses={getStatuses}
                              currentPage={currentPage}
                              setCurrentPage={setCurrentPage}
                              searchKey={searchKey}
                              sortKey={sortKey}
                              rowLength={data.statuses.length}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Status;
