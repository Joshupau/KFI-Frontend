import { IonContent, IonPage, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import { BegBalance, FinancialStatements } from '../../../../types/types';
import Create from './modals/create';
import Delete from './modals/delete';
import Update from './modals/update';
import PrintExport from './modals/print&export';

export type TBS = {
  beginningBalances: BegBalance[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const BeginningBalance = () => {
  const [list, setList] = useState<any[]>([])
   const [currentPage, setCurrentPage] = useState<number>(1);
  
    const [data, setData] = useState<TBS>({
      beginningBalances: [],
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });

   const getList = async (page: number) => {
          try {
            const result = await kfiAxios.get(`/beginning-balance?limit=10&page=${currentPage}`);

            const { beginningBalances, success,hasPrevPage, hasNextPage, totalPages } = result.data

            if(success){
               setData(prev => ({
              ...prev,
              beginningBalances: beginningBalances,
              totalPages: totalPages,
              nextPage: hasNextPage,
              prevPage: hasPrevPage,
            }));
            }

          } catch (error) {
          } finally {
          }
        
    };

  const handlePagination = (page: number) => getList(page);

  useIonViewWillEnter(() => {
    getList(currentPage);
  });
  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100">
      <IonContent className="[--background:#F4F4F5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 py-6 items-stretch justify-start">
          <PageTitle pages={['General Ledger', 'Beginning Balance']} />
           <div className="px-3 pb-3 flex-1">

            <div className="flex items-center gap-2 flex-wrap">
              <Create getList={getList} />
              <PrintExport/>
              
            </div>
           
           
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Entry</TableHead>
                    <TableHead>Memo</TableHead>
                    <TableHead>Year</TableHead>
                    {/* <TableHead>Prepared By</TableHead> */}
                    <TableHead>Debit</TableHead>
                    <TableHead>Credit</TableHead>
               
                    <TableHead>Action</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {data.beginningBalances.length < 1 && <TableNoRows label="No Record Found" colspan={6} />}
                  {
                    data.beginningBalances.length > 0 &&
                    data.beginningBalances.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className=' capitalize'>{item.entryCount}</TableCell>
                        <TableCell className=' capitalize'>{item.memo}</TableCell>
                        <TableCell className=' capitalize'>{item.year}</TableCell>
                        <TableCell>{item.debit.toLocaleString()}</TableCell>
                        <TableCell>{item.credit.toLocaleString()}</TableCell>
                      
                        <TableCell className=' flex '>
                          <Update item={item} getList={getList} currentPage={currentPage}/>
                          <Delete item={item} getList={getList} currentPage={currentPage}/>

                        </TableCell>
                      
                      </TableRow>
                    ))}
                </TableBody>
              </Table>


              <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
              


          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BeginningBalance;
