import { IonButton, IonContent, IonIcon, IonPage, IonSpinner, isPlatform, useIonRouter } from '@ionic/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../ui/utils/FormIonItem';
import InputText from '../../../ui/forms/InputText';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, loginSchema } from '../../../../validations/login.schema';
import kfiAxios from '../../../utils/axios';
import checkError from '../../../utils/check-error';
import { AccessToken, TErrorData, TFormError } from '../../../../types/types';
import formErrorHandler from '../../../utils/form-error-handler';
import InputPassword from '../../../ui/forms/InputPassword';
import logo from '../../../assets/images/logo-nobg.png';
import Image from 'next/image';
import { Capacitor } from '@capacitor/core';
import { lockClosed, person } from 'ionicons/icons';
import { jwtDecode } from 'jwt-decode';
import { arrangedResource } from '../../../utils/constants';
import { UserIcon, LogoutSquare01Icon, CircleIcon  } from 'hugeicons-react';


const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useIonRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      deviceName: 'My PC',
      deviceType: 'dekstop',

    },
  });

  // const getDeviceName = async (): string => {
  //   if (!Capacitor.isNativePlatform()) return 'Web Browser';

  //   if (Capacitor.getPlatform() === 'electron') {
  //     if (typeof window !== 'undefined' && window.require) {
  //       const { hostname } = window.require('os');
  //       return hostname();
  //     }
  //     return 'Unknown PC';
  //   }

  //   const {} = await import("@capaitor/device")

  // };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const result = await kfiAxios.post('/auth/login',{username: data.username, password: data.password, deviceName: 'My PC Name', deviceType: 'desktop'});
      const { success, access } = result.data;
      if (success) {
        const token = jwtDecode(access) as AccessToken;
        const permissions = token.permissions;

        console.log(token)
        let path = '';
        if (token.role === 'superadmin') {
          path = '/dashboard/home';
        } else {
          let i = 0;
          while (i <= arrangedResource.length && !path) {
            const resource = permissions.find(e => e.resource === arrangedResource[i].resource);
            if (resource?.actions.visible) {
              path = arrangedResource[i].path;
            }
            i++;
          }
        }
        localStorage.setItem('auth', access);
        localStorage.setItem('user', token.username)
        localStorage.setItem('role', token.role)
        router.push(path);
        if (isPlatform('capacitor')) {
          (window as any).location.reload(true);
        } else if (isPlatform('electron')) {
          (window as any).ipcRenderer.send('reload-window');
        } else {
          (window as any).location.reload();
        }
      }
    } catch (error: any) {
      const errs: TErrorData | string = error?.response?.data?.error || error?.response?.data?.msg || error.message;
      const errors: TFormError[] | string = checkError(errs);
      const fields: string[] = Object.keys(form.formState.defaultValues as Object);
      formErrorHandler(errors, form.setError, fields);
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="w-full h-full bg-[#FFF0E3] bg-desktop bg-no-repeat bg-bottom bg-contain">
          <div className="h-full flex">
            
            <div className=" bg-white shadow-lg w-full grid grid-cols-1 md:grid-cols-[40%_1fr] h-full rounded-xl mx-auto">
              <div className=" relative w-full space-y-8 flex flex-col items-start justify-center rounded-r-2xl bg-orange-700 p-16 bg-gradient-to-tr from-orange-500 to-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className=' absolute w-full top-0 left-0  '>
                 <path fill="#f97316" fill-opacity="1" d="M0,64L0,192L180,192L180,64L360,64L360,192L540,192L540,64L720,64L720,320L900,320L900,160L1080,160L1080,256L1260,256L1260,64L1440,64L1440,0L1260,0L1260,0L1080,0L1080,0L900,0L900,0L720,0L720,0L540,0L540,0L360,0L360,0L180,0L180,0L0,0L0,0Z"></path>
                </svg>

                <svg className=' absolute bottom-0 left-0' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#f97316" fill-opacity="1" d="M0,64L0,64L180,64L180,192L360,192L360,320L540,320L540,96L720,96L720,160L900,160L900,288L1080,288L1080,128L1260,128L1260,0L1440,0L1440,320L1260,320L1260,320L1080,320L1080,320L900,320L900,320L720,320L720,320L540,320L540,320L360,320L360,320L180,320L180,320L0,320L0,320Z"></path></svg>
                <div className="text-start">
                  <div className="mb-3 w-fit p-2 rounded-lg bg-[FFF0E3] bg-orange-50">
                    <Image alt="logo" src={logo} className="h-20 w-auto mx-auto filter drop-shadow-[1px_1px_0px_white]" />
                  </div>
                  <div className="space-y-6">
                    <h6 className=" text-white text-[2.5rem] m-0 max-w-[400px] font-[600]">Manage your loans with ease</h6>
                    <h6 className=" text-orange-50 text-[1rem] m-0">Streamlined loan management system designed for efficiency and security.</h6>

                    <div className=' flex flex-col gap-4 mt-12'>
                       <p className="text-orange-200 text-[1rem]  flex items-center gap-2">
                          <CircleIcon size={12} fill="white" /> Data Protection
                        </p>
                        <p className="text-orange-200 text-[1rem]  flex items-center gap-2">
                          <CircleIcon size={12} fill="white" /> Flexible Financing
                        </p>
                        <p className="text-orange-200 text-[1rem] flex items-center gap-2">
                          <CircleIcon size={12} fill="white" /> Detailed Analytics
                        </p>
                    </div>
                   

                    {/* <p className="text-slate-600 text-sm ">Login to your account</p> */}
                  </div>
                </div>
               
              </div>

              <div className=' bg-orange-50  w-full h-full flex items-center justify-center relative'>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className=' absolute w-full top-0 left-0  '>
                 <path fill="#ffffff" fill-opacity="1" d="M0,64L0,192L180,192L180,64L360,64L360,192L540,192L540,64L720,64L720,320L900,320L900,160L1080,160L1080,256L1260,256L1260,64L1440,64L1440,0L1260,0L1260,0L1080,0L1080,0L900,0L900,0L720,0L720,0L540,0L540,0L360,0L360,0L180,0L180,0L0,0L0,0Z"></path>
                </svg>

                <svg className=' absolute bottom-0 left-0' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ffffff" fill-opacity="1" d="M0,64L0,64L180,64L180,192L360,192L360,320L540,320L540,96L720,96L720,160L900,160L900,288L1080,288L1080,128L1260,128L1260,0L1440,0L1440,320L1260,320L1260,320L1080,320L1080,320L900,320L900,320L720,320L720,320L540,320L540,320L360,320L360,320L180,320L180,320L0,320L0,320Z"></path></svg>
                 <div className=" flex flex-col items-center justify-center space-y-8 bg-white w-fit p-16 rounded-xl shadow-lg relative z-50">
                  <div className="text-center">
                    {/* <div className="mb-5 w-fit mx-auto p-2 rounded-lg bg-[FFF0E3]">
                      <Image alt="logo" src={logo} className="h-20 w-auto mx-auto filter drop-shadow-[1px_1px_0px_white]" />
                    </div> */}
                    <div className="space-y-2">
                      <h6 className="text-orange-600 text-[1.7rem] !font-[600] m-0">Welcome Back!</h6>
                      <p className="text-slate-500 text-sm ">Login to your account</p>
                    </div>
                  </div>
                  <div>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1 ">
                    <p  className=' text-xs'>User Code</p>
                    <FormIonItem >
                      <InputText
                        disabled={loading}
                        name="username"
                        required
                        control={form.control}
                        clearErrors={form.clearErrors}
                        // label="User Code"
                        placeholder="Enter your user's code"
                        className="!px-3 !py-3 rounded-lg !border-orange-200 w-[300px] bg-white"
                        containerClassnames="flex flex-col"
                        labelClassName="!text-xs !text-zinc-500 text-start "
                        // icon={person}
                      />
                    </FormIonItem>

                    <p  className=' text-xs !mt-4'>Password</p>

                    <FormIonItem>
                      <InputPassword
                        disabled={loading}
                        name="password"
                        placeholder="Enter your password"
                        required
                        control={form.control}
                        clearErrors={form.clearErrors}
                        // label="Password"
                        className="!px-3 !py-3 rounded-lg !border-orange-200"
                        containerClassNames="flex flex-col"
                        labelClassname="!text-xs !text-zinc-500  text-start"
                        // icon={lockClosed}
                      />
                    </FormIonItem>
                    {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}
                    <div className="text-end !mt-4">
                      <IonButton
                        disabled={loading}
                        slot="end"
                        fill="clear"
                        type="submit"
                        className="min-h-10 w-full !text-sm bg-[linear-gradient(90deg,rgba(245,157,13,1)30%,rgba(250,117,22,1)100%)] text-white capitalize border-1 border-orange-200 !rounded-lg"
                        strong={true}
                      >
                        {loading ? (
                          <IonSpinner name="lines-small" color="light" />
                        ) : (
                          <span className="flex items-center gap-1">
                            <LogoutSquare01Icon stroke='.8' size={15} className="text-sm" />
                            Login
                          </span>
                        )}
                      </IonButton>
                    </div>

                    {/* <div className=' w-full flex items-center justify-center pt-8'>
                      <p className=' text-xs  max-w-[12rem] text-center text-zinc-500'>Need assistance? Contact your system administrator</p>
                    </div> */}

                  </form>
                </div>
                  </div>
              </div>

              
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
