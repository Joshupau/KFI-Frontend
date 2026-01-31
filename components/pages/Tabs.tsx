import { Redirect, Route, useLocation } from 'react-router-dom';
import {
  IonRouterOutlet,
  IonHeader,
  IonContent,
  IonPage,
  IonButton,
  IonPopover,
  IonIcon,
  isPlatform,
  IonItem,
  IonLabel,
  IonMenu,
  IonMenuToggle,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonItemDivider,
  IonItemGroup,
  IonList,
  IonAccordion,
  IonAccordionGroup,
  
} from '@ionic/react';
import ChartOfAccount from './dashboard/chart-of-account/ChartOfAccount';
import Center from './dashboard/center/Center';
import ClientMasterFile from './dashboard/client-master-file/ClientMasterFile';
import Loans from './dashboard/loans/Loans';
import Bank from './dashboard/bank/Bank';
import WeeklySavingTable from './dashboard/weekly-saving-table/WeeklySavingTable';
import Supplier from './dashboard/supplier/Supplier';
import BusinessType from './dashboard/business-type/BusinessType';
import GroupAccount from './dashboard/group-account/GroupAccount';
import logoNoBg from '../assets/images/logo-nobg.png';
import Image from 'next/image';
import {
  homeOutline,
  keyOutline,
  logOut,
  menuOutline
} from 'ionicons/icons';
import Admin from './dashboard/admin/Admin';
import { jwtDecode } from 'jwt-decode';
import { AccessToken } from '../../types/types';
import Dashboard from './dashboard/home/Dashboard';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Acknowledgement from './dashboard/acknowledgement/Acknowledgement';
import Release from './dashboard/release/Release';
import AuditTrail from './dashboard/audit-trail/AuditTrail';
import FinancialStatement from './dashboard/financial-statement/FinancialStatement';
import TrialBalance from './dashboard/trial-balance/TrialBalance';
import UnbalanceEntries from './dashboard/unbalance-entries/UnbalanceEntries';
import LoginLogs from './dashboard/login-logs/LoginLogs';
import ActionLogs from './dashboard/action-logs/ActionLogs';
import LoanRelease from './dashboard/loan-release/LoanRelease';
import ExpenseVoucher from './dashboard/expense-voucher/ExpenseVoucher';
import JournalVoucher from './dashboard/journal-voucher/JournalVoucher';
import EmergencyLoan from './dashboard/emergency-loan/EmergencyLoan';
import DamayanFund from './dashboard/damayan-fund/DamayanFund';
import TopNavigation from '../ui/page/TopNavigation';
import ChangeOwnPassword from './dashboard/settings/change-password/ChangeOwnPassword';
import classNames from 'classnames';
import { menuController } from "@ionic/core";
import {

  DashboardSquare01Icon,
  UserMultiple02Icon,
  Task02Icon,
  Settings02Icon,
  CollectionsBookmarkIcon,
  ToolsIcon,
  ListViewIcon
} from "hugeicons-react";
import ListDetail from './ListDetail';
import Nature from './dashboard/nature/Nature';
import SystemParameters from './dashboard/systemparameters/SystemParameters';
import Databases from './dashboard/databases/databases';
import { useOnlineStore } from '../../store/onlineStore';
import Activity from './dashboard/activity/AuditTrail';
import BeginningBalance from './dashboard/beginning-balance/BeginningBalance';
import WeeklyCollection from './dashboard/weekly-collection/WeeklyCollection';
import ProjectedCollection from './dashboard/projected-collection/ProjectedCollection';
import PortfolioAtRisk from './dashboard/portfolio-at-risk/PortfolioAtRisk';

type NavLink = {
  path?: string;
  label: string;
  resource: string | string[];
  icon?: React.ReactNode; 
  children?: NavLink[];
};





const navLinks: NavLink[] = [
  { path: "/dashboard/home", label: "Dashboard", resource: "home", icon: <DashboardSquare01Icon size={18} /> },
  { path: "/dashboard/admin", label: "Manage Account", resource: "manage account", icon: <UserMultiple02Icon size={18} /> },

  {
    label: "Transaction",
    resource: ["loan release", "expense voucher", "journal voucher", "acknowledgement", "release"],
    icon: <Task02Icon size={18} />,
    children: [
      { path: "/dashboard/loan-release", label: "Loan Release", resource: "loan release" },
      {
        label: "Voucher",
        resource: ["expense voucher", "journal voucher"],
        children: [
          { path: "/dashboard/expense-voucher", label: "Expense Voucher", resource: "expense voucher" },
          { path: "/dashboard/journal-voucher", label: "Journal Voucher", resource: "journal voucher" },
        ],
      },
      {
        label: "Receipt",
        resource: ["acknowledgement", "release"],
        children: [
          { path: "/dashboard/official-receipt", label: "Official Receipt", resource: "acknowledgement" },
          { path: "/dashboard/acknowledgement", label: "Acknowledgement Receipt", resource: "release" },
        ],
      },
      { path: "/dashboard/emergency-loan", label: "Emergency Loan", resource: "emergency loan" },
      { path: "/dashboard/damayan-fund", label: "Damayan Fund", resource: "damayan fund" },
    ],
  },
  { path: "/dashboard/nature", label: "Nature", resource: "nature", icon: <ListViewIcon size={18} /> },
  {
    label: "General Ledgers",
    resource: ["audit trail","activity", "financial statement", "trial balance", "weekly collection", "projected collection", "portfolio at risk"],
    icon: < CollectionsBookmarkIcon size={18} />,
    children: [
      { path: "/dashboard/audit-trail", label: "Audit Trail", resource: "audit trail" },
      { path: "/dashboard/activity", label: "Activity", resource: "activity" },
      { path: "/dashboard/financial-statement", label: "Financial Statement", resource: "financial statement" },
      { path: "/dashboard/trial-balance", label: "Trial Balance", resource: "trial balance" },
      { path: "/dashboard/beginning-balance", label: "Beginning Balance", resource: "beginning balance" },
      { path: "/dashboard/weekly-collection", label: "Weekly Collection", resource: "weekly collection" },
      { path: "/dashboard/projected-collection", label: "Projected Collection", resource: "projected collection" },
      { path: "/dashboard/portfolio-at-risk", label: "Portfolio at Risk", resource: "portfolio at risk" },
    ],
  },

   {
    label: "System",
    resource: ["loan product", "center", "bank", "weekly savings", "business"],
    icon: <Settings02Icon size={18} />,
    children: [
      {
        label: "Loan Product",
        resource: ["group of account", "chart of account", "product"],
        children: [
          { path: "/dashboard/group-of-account", label: "Group Of Account", resource: "group of account" },
          { path: "/dashboard/chart-of-account", label: "Chart Of Account", resource: "chart of account" },
          { path: "/dashboard/product", label: "Product", resource: "product" },
        ],
      },
      { path: "/dashboard/center", label: "Center", resource: "center" },
      { path: "/dashboard/bank", label: "Bank", resource: "bank" },
      { path: "/dashboard/weekly-savings", label: "Weekly Savings", resource: "weekly savings" },
      {
        label: "Business",
        resource: ["business type", "business supplier"],
        children: [
          { path: "/dashboard/business-type", label: "Type", resource: "business type" },
          { path: "/dashboard/business-supplier", label: "Supplier", resource: "business supplier" },
        ],
      },
    { path: '/dashboard/nature', label: 'Nature', resource: 'nature' },
    { path: '/dashboard/systemparameters', label: 'System Parameters', resource: 'system parameters' },

    ],
  },

  {
    label: "Diagnostic",
    resource: ["unbalance entries", "login logs", "action logs"],
    icon: <ToolsIcon size={18} />,
    children: [
      { path: "/dashboard/unbalance-entries", label: "Unbalance Entries", resource: "unbalance entries" },
      { path: "/dashboard/login-logs", label: "Login Logs", resource: "login logs" },
      { path: "/dashboard/action-logs", label: "Action Logs", resource: "action logs" },
    ],
  },
];





const Tabs = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const pathname = usePathname();
  const location = useLocation();

  const online = useOnlineStore((state) => state.online);
  

  const logout = () => {
    localStorage.removeItem('auth');
    if (isPlatform('capacitor')) {
      (window as any).location.reload(true);
    } else if (isPlatform('electron')) {
      (window as any).ipcRenderer.send('reload-window');
    } else {
      (window as any).location.reload();
    }
  };

  const openMenu = async () => {
    await menuController.open("main-menu");
  };

  return (
    <>
      <IonMenu menuId="main-menu" contentId="main-content" side="start">
     
      <IonContent className=' !p-6'>
        <div className="w-full  p-6 rounded-md">
            <Image alt="logo" src={logoNoBg} className="h-12 w-auto" />
          </div>
        <IonAccordionGroup multiple={true} className="border-collapse">
      {navLinks.map((link, idx) =>
        link.children ? (
          <IonAccordion key={idx} value={link.label}>
            <IonItem
              slot="header"
              style={{
                "--border-width": "0",
                "--inner-border-width": "0",
              }}
            >
              {link.icon && (
                <div className="bg-orange-50 p-1 rounded-md text-orange-600 mr-2">
                  {link.icon}
                </div>
              )}
              <IonLabel
                className={`!text-xs ${
                  location.pathname === link.path ? "!text-orange-600" : ""
                }`}
              >
                {link.label}
              </IonLabel>
            </IonItem>
            <IonList slot="content">
              <IonAccordionGroup multiple={true}>
                {link.children.map((child, cIdx) =>
                  child.children ? (
                    <IonAccordion key={cIdx} value={child.label}>
                      <IonItem
                        slot="header"
                        style={{
                          "--border-width": "0",
                          "--inner-border-width": "0",
                        }}
                      >
                        <IonLabel
                          className={`!ml-8 !text-xs ${
                            location.pathname === child.path
                              ? "!text-orange-600"
                              : ""
                          }`}
                        >
                          {child.label}
                        </IonLabel>
                      </IonItem>
                      <IonList slot="content">
                        {child.children.map((grandChild, gIdx) => (
                          <IonItem
                            key={gIdx}
                            button
                            routerLink={grandChild.path}
                            onClick={() => menuController.close("main-menu")}
                            detail={false}
                            style={{
                              "--border-width": "0",
                              "--inner-border-width": "0",
                            }}
                          >
                            <IonLabel
                              className={`!ml-12 !text-xs ${
                                location.pathname === grandChild.path
                                  ? "!text-orange-600"
                                  : ""
                              }`}
                            >
                              {grandChild.label}
                            </IonLabel>
                          </IonItem>
                        ))}
                      </IonList>
                    </IonAccordion>
                  ) : (
                    <IonItem
                      key={cIdx}
                      button
                      routerLink={child.path}
                      onClick={() => menuController.close("main-menu")}
                      detail={false}
                      style={{
                        "--border-width": "0",
                        "--inner-border-width": "0",
                      }}
                    >
                      <IonLabel
                        className={`!pl-8 !text-xs ${
                          location.pathname === child.path
                            ? "!text-orange-600"
                            : ""
                        }`}
                      >
                        {child.label}
                      </IonLabel>
                    </IonItem>
                  )
                )}
              </IonAccordionGroup>
            </IonList>
          </IonAccordion>
        ) : (
          <IonItem
            key={idx}
            button
            routerLink={link.path}
            onClick={() => menuController.close("main-menu")}
            detail={false}
            style={{
              "--border-width": "0",
              "--inner-border-width": "0",
            }}
          >
            {link.icon && (
              <div className="bg-orange-50 p-1 rounded-md text-orange-600 mr-2">
                {link.icon}
              </div>
            )}
            <IonLabel
              className={`!text-xs ${
                location.pathname === link.path ? "!text-orange-600" : ""
              }`}
            >
              {link.label}
            </IonLabel>
          </IonItem>
        )
      )}
    </IonAccordionGroup>

      </IonContent>
    </IonMenu>

    
      {/* ✅ Main Page */}
      <IonPage id="main-content">
        <IonHeader class="ion-no-border border-b flex items-center justify-center">
           
          <div className='flex items-center justify-between max-w-[1920px] w-full gap-4 py-2 lg:py-6 px-2'>
            <div className='flex items-center gap-2'>
              <div className="h-6 border-b bg-cover ps-2 flex items-center">
                <div className="w-full bg-orange-50 p-3 rounded-md">
                  <Image alt="logo" src={logoNoBg} className="h-6 w-auto" />
                </div>
              </div>
              <TopNavigation />
            </div>

            <div className="flex items-center justify-center py-1 rounded-md">
              <div className="flex items-center justify-center gap-2 capitalize ">
                <span className="hidden lg:flex text-[0.8rem] font-semibold">{token.username}</span>
                <IonButton
                  fill="clear"
                  className="min-h-[3.5rem] border-[#FA6C2F] !m-0 [--color:black]"
                  id="click-trigger"
                >
                  <div className="w-10 h-10 bg-[#FFF0E3] rounded-full uppercase grid place-items-center relative">

                    <div className={`${online ? ' bg-green-400' : ' bg-red-600'} h-4 w-4 rounded-full absolute bottom-0 right-0 translate-y-1`}>

                    </div>
                    {token.username.substring(0, 2)}
                  </div>
                </IonButton>
              </div>

              <IonToolbar className=' lg:hidden '>
                <IonButtons slot="start"  className=' '>
                  <IonMenuButton ></IonMenuButton>
                </IonButtons>
              </IonToolbar>

              <IonPopover
                showBackdrop={false}
                trigger="click-trigger"
                triggerAction="click"
                className="[--max-width:12rem]"
              >
                <IonContent class="[--padding-top:0.25rem] [--padding-bottom:0.25rem]">
                  <ChangeOwnPassword />
                  <div
                    onClick={logout}
                    className="flex items-center gap-2 text-[0.8rem] text-slate-700 font-semibold hover:bg-slate-100 py-1 px-3 cursor-pointer active:bg-slate-200"
                  >
                    <IonIcon icon={logOut} /> Logout
                  </div>
                </IonContent>
              </IonPopover>

               {/* <IonButton
                fill="clear"
                className="lg:hidden"
                onClick={openMenu}
              >
                <IonIcon icon={menuOutline} slot="icon-only" />
              </IonButton> */}
            </div>
          </div>
        </IonHeader>

        <IonContent>
          <IonRouterOutlet id="main-content">
            <Route path="/dashboard" render={() => <Redirect to={'/dashboard/home'} />} exact={true} />
            <Route path="/dashboard/home" render={() => <Dashboard />} exact={true} />
            <Route path="/dashboard/admin" render={() => <Admin />} exact={true} />
            <Route path="/dashboard/client" render={() => <ClientMasterFile />} exact={true} />
            <Route path="/dashboard/loan-release" render={() => <LoanRelease />} exact={true} />
            <Route path="/dashboard/expense-voucher" render={() => <ExpenseVoucher />} exact={true} />
            <Route path="/dashboard/journal-voucher" render={() => <JournalVoucher />} exact={true} />
            <Route path="/dashboard/official-receipt" render={() => <Acknowledgement />} exact={true} />
            <Route path="/dashboard/acknowledgement" render={() => <Release />} exact={true} />
            <Route path="/dashboard/emergency-loan" render={() => <EmergencyLoan />} exact={true} />
            <Route path="/dashboard/damayan-fund" render={() => <DamayanFund />} exact={true} />
            <Route path="/dashboard/audit-trail" render={() => <AuditTrail />} exact={true} />
            <Route path="/dashboard/activity" render={() => <Activity />} exact={true} />
            <Route path="/dashboard/financial-statement" render={() => <FinancialStatement />} exact={true} />
            <Route path="/dashboard/trial-balance" render={() => <TrialBalance />} exact={true} />
            <Route path="/dashboard/beginning-balance" render={() => <BeginningBalance />} exact={true} />
            <Route path="/dashboard/weekly-collection" render={() => <WeeklyCollection />} exact={true} />
            <Route path="/dashboard/projected-collection" render={() => <ProjectedCollection />} exact={true} />
            <Route path="/dashboard/portfolio-at-risk" render={() => <PortfolioAtRisk />} exact={true} />
            <Route path="/dashboard/group-of-account" render={() => <GroupAccount />} exact={true} />
            <Route path="/dashboard/chart-of-account" render={() => <ChartOfAccount />} exact={true} />
            <Route path="/dashboard/product" render={() => <Loans />} exact={true} />
            <Route path="/dashboard/center" render={() => <Center />} exact={true} />
            <Route path="/dashboard/bank" render={() => <Bank />} exact={true} />
            <Route path="/dashboard/weekly-savings" render={() => <WeeklySavingTable />} exact={true} />
            <Route path="/dashboard/business-type" render={() => <BusinessType />} exact={true} />
            <Route path="/dashboard/business-supplier" render={() => <Supplier />} exact={true} />
            <Route path="/dashboard/unbalance-entries" render={() => <UnbalanceEntries />} exact={true} />
            <Route path="/dashboard/login-logs" render={() => <LoginLogs />} exact={true} />
            <Route path="/dashboard/action-logs" render={() => <ActionLogs />} exact={true} />
            <Route path="/dashboard/nature" render={() => <Nature />} exact={true} />
            <Route path="/dashboard/systemparameters" render={() => <SystemParameters />} exact={true} />
            <Route path="/dashboard/databases" render={() => <Databases />} exact={true} />
          </IonRouterOutlet>
        </IonContent>
      </IonPage>

   
    </>
    
  );
};

export default Tabs;
