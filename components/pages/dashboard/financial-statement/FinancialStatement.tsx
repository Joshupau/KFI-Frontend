import { IonContent, IonPage, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import UpdateSystemParameters from '../systemparameters/modals/UpdateParams';
import kfiAxios from '../../../utils/axios';
import CreateFS from './modals/create';
import TablePagination from '../../../ui/forms/TablePagination';
import { FinancialStatements } from '../../../../types/types';
import UpdateFS from './modals/update';
import DeleteFS from './modals/delete';
import UpdateFSEntries from './modals/entries';
import GenerateReport from './modals/generate-report';

export type TFS = {
  financialStatements: FinancialStatements[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const FinancialStatement = () => {
  const [list, setList] = useState<any[]>([])
   const [currentPage, setCurrentPage] = useState<number>(1);
  
    const [data, setData] = useState<TFS>({
      financialStatements: [],
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });

   const getList = async (page: number) => {
          try {
            const result = await kfiAxios.get('/financial-statement');

            const { financialStatements, success,hasPrevPage, hasNextPage, totalPages } = result.data

            if(success){
               setData(prev => ({
              ...prev,
              financialStatements: financialStatements,
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
          <PageTitle pages={['General Ledger', 'Financial Statement']} />
           <div className="px-3 pb-3 flex-1">

            <div className="flex items-center gap-2 flex-wrap">
              <CreateFS getList={getList} />

              <GenerateReport/>
              
            </div>
           
           
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Report Code</TableHead>
                    {/* <TableHead>Prepared By</TableHead> */}
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Subtitle</TableHead>
                    <TableHead>Action</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {data.financialStatements.length < 1 && <TableNoRows label="No Record Found" colspan={6} />}
                  {
                    data.financialStatements.length > 0 &&
                    data.financialStatements.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className=' capitalize'>{item.reportCode}</TableCell>
                        <TableCell>{item.reportName}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.subTitle}</TableCell>
                        <TableCell className=' flex '>
                          <UpdateFS item={item} getList={getList} currentPage={currentPage}/>
                          <DeleteFS item={item} getList={getList} currentPage={currentPage}/>
                          <UpdateFSEntries item={item} getList={getList} currentPage={currentPage}/>

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

export default FinancialStatement;
