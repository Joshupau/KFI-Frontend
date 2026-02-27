import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const kfiAxios: AxiosInstance = axios.create({
  // baseURL: 'http://localhost:5005/api/v1',

  baseURL: 'https://kfiapi.axcela-ph.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const Request = async (request: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const token = localStorage.getItem('auth');
  if (token && request.headers) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
};

const RequestError = async (error: AxiosError): Promise<never> => {
  return Promise.reject(error);
};

const Response = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const ResponseError = async (error: AxiosError): Promise<never> => {
  if (error.response?.data === 'Unauthorized' && error.response?.status === 401) {
    localStorage.removeItem('auth');
    window.location.reload();
  }
  return Promise.reject(error);
};

kfiAxios.interceptors.request.use(Request, RequestError);
kfiAxios.interceptors.response.use(Response, ResponseError);

export default kfiAxios;
