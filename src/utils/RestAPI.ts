import axios, { AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { baseURL } from "./constants";
import {
  API_PATH,
  cookieIgnoredURLs,
  cookieUpdateURLs,
  urlName,
  urls,
} from "./urls";
import { extendCookieValidity, processCookiesAndUpdateSession } from ".";

interface DownloadMethodArgs {
  callback?: () => void;
  fileName: string,
  // eslint-disable-next-line no-undef
  fileOptions?: BlobPropertyBag;
  params?: Record<string, string | number | boolean>;
  url: urlName;
}

const axiosConfig: CreateAxiosDefaults = {
  baseURL,
  withCredentials: true,
};

const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(
  (config) => {
    return {
      ...config,
      url: urls[config.url as urlName],
    };
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (cookieUpdateURLs.includes(response.config.url as API_PATH)) {
      const { __secure_v2 } = response.data;
      if (response.data.data?.valid) processCookiesAndUpdateSession(__secure_v2);
    } else if (!cookieIgnoredURLs.includes(response.config.url as API_PATH)) {
      extendCookieValidity();
    }

    return response.data;
  },
  (error) => {
    // redirections
    return Promise.reject(error);
  }
);

const sendRequest = async (config: AxiosRequestConfig) => {
  return await axiosInstance.request(config);
};

const GET = async (url: urlName, params?: Record<string, string | number | boolean>) => {
  return await axiosInstance.get(url, { params });
};

const POST = async (url: urlName, data: FormData | Record<string, unknown>) => {
  return await axiosInstance.post(url, data);
};

const DELETE = async (url: urlName, id: number | string) => {
  return await axiosInstance.delete(url, { params: { id } });
};

const PUT = async (url: urlName, id: number | string, data: Record<string, unknown>) => {
  return await axiosInstance.put(url, data, { params: { id } });
};

const DOWNLOAD = async (props: DownloadMethodArgs) => {
  const {
    callback = () => {},
    fileName,
    fileOptions = {},
    params = {},
    url,
  } = props;

  await axiosInstance
    .get<Blob>(url, { params, responseType: "arraybuffer" })
    .then((resp) => {
      const blob = new Blob([resp.data], fileOptions);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      callback();
    });
}

export default {
  DELETE,
  DOWNLOAD,
  GET,
  POST,
  PUT,
  sendRequest,
};
