import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical, link, print } from 'ionicons/icons';
import { AccessToken, ChartOfAccount } from '../../../../../types/types';
import { TChartOfAccount } from '../ChartOfAccount';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../../utils/permissions';
import LinkChartOfAccount from '../modals/LinkChartOfAccount';

type ChartOfAccountActionsProps = {
  chartAccount: ChartOfAccount;
  setData: React.Dispatch<React.SetStateAction<TChartOfAccount>>;
  getChartOfAccounts: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const ChartOfAccountActions = ({ chartAccount, setData, getChartOfAccounts, currentPage, setCurrentPage, searchKey, sortKey, rowLength }: ChartOfAccountActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  return (
    <div>{canDoAction(token.role, token.permissions, 'chart of account', 'update') && <LinkChartOfAccount chartAccount={chartAccount} setData={setData} />}</div>
    // <>
    //   <IonButton fill="clear" id={`coa-${chartAccount._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
    //     <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
    //   </IonButton>
    //   <IonPopover showBackdrop={false} trigger={`coa-${chartAccount._id}`} triggerAction="click" className="[--max-width:13rem]">
    //     <IonContent>{canDoAction(token.role, token.permissions, 'chart of account', 'update') && <LinkChartOfAccount chartAccount={chartAccount} setData={setData} />}</IonContent>
    //   </IonPopover>
    // </>
  );
};

export default ChartOfAccountActions;
