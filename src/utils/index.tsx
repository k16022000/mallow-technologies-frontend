import React from "react";
import Cookies from 'js-cookie';
import { useLocation, Navigate } from "react-router";
import { ProtectedRouteProps } from "./types";
import RestAPI from "./RestAPI";
import useSession from "@globals/hooks/useSession";
import { store } from "@redux/store";
import { clearSessionData, setSessionData } from "@redux/sessionSlice";

const decodeToken = (token: string): Record<string, number | string> => {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

const RedirectComponent: React.FC<ProtectedRouteProps> = ({ Component }) => {
  const location = useLocation();
  const { sessionData } = useSession();
  const isAuth: boolean = sessionData.isAuth;

  if (!isAuth) {
    return (
      <Navigate
        to="/"
        state={{
          redirectPath: location?.pathname,
          search: location?.search,
        }}
      />
    );
  }

  return <Component />;
}

const validateAuth = (Component: React.ComponentType) => {
  return <RedirectComponent Component={Component} />;
}

const clearCookiesAndLogout = () => {
  RestAPI
    .POST('logout', { user_id: store.getState().session.id })
    .then((resp) => {
      if (resp.data.logout) {
        store.dispatch(clearSessionData());
        sessionStorage.clear();
        Cookies.remove('__secure_v2');
        localStorage.removeItem('__secure_v2');
        document.cookie = '__secure_v2=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.location.href = '/auth';
      }
    });
}

const processCookiesAndUpdateSession = (tokenFromCookie: string | null = null) => {
  let token: string | null = tokenFromCookie;
  const tokenFromLocalStorage = Cookies.get('__secure_v2');

  if (tokenFromLocalStorage) {
    token = tokenFromLocalStorage;
  } else if (tokenFromCookie) {
    const cookie = decodeToken(tokenFromCookie);
    const now = new Date();
    const cookieObj = {
      data: tokenFromCookie,
      expiry: now.getTime() + Number(cookie.max_age),
    };
    localStorage.setItem('__secure_v2', JSON.stringify(cookieObj));
  }

  if (!token) {
    const cookieObj = JSON.parse(localStorage.getItem('__secure_v2') as string);
    if (cookieObj) {
      const cookie = decodeToken(cookieObj.data);
      const now = new Date();

      if (Math.floor(now.getTime() / 1000) <= cookieObj.expiry) {
        token = cookieObj.data;
        cookieObj.expiry = Math.floor(now.getTime() / 1000) + Number(cookie.max_age);
        localStorage.setItem('__secure_v2', JSON.stringify(cookieObj));
      } else {
        if (document.location.pathname !== '/signin') {
          clearCookiesAndLogout();
        }
      }
    }
  }

  if (token) {
    const decodedToken = decodeToken(token);
    store.dispatch(setSessionData({ ...decodedToken, isAuth: true }));
  } else {
    // eslint-disable-next-line no-console
    console.warn('Cookie not found');
  }
}

const restoreSessionFromCookie = (): void => {
  let isSessionRestored = false;

  if (isSessionRestored) return;
  processCookiesAndUpdateSession();
  isSessionRestored = true;
}

const getHomePage = (): string => {
  const roleName = store.getState().session.roleName;
  if (roleName === 'Candidate') return '/candidate';
  if (roleName === 'Recruitment Firm') return '/postjob';
  return '/home';
};

const RestoreSessionAndNavigate = (): React.ReactElement => {
  const location = useLocation();
  const state = location.state || {};
  const { sessionData } = useSession();

  const getUserHomeRoute = (): string => {
    if (sessionData.isAuth) return getHomePage();
    return '/signin';
  };

  return <Navigate to={getUserHomeRoute()} state={{ ...state }} replace />;
}

const extendCookieValidity = (): void => {
  const tokenFromLocalStorage: string | null = localStorage.getItem('__secure_v2');

  if (tokenFromLocalStorage === null) {
    clearCookiesAndLogout();
    return;
  }

  const cookieObj = JSON.parse(tokenFromLocalStorage);
  const now = new Date();

  if (cookieObj && Math.floor(now.getTime() / 1000) <= cookieObj.expiry) {
    const cookie = decodeToken(cookieObj.data);
    cookieObj.expiry = Math.floor(now.getTime() / 1000) + Number(cookie.max_age);
    localStorage.setItem('__secure_v2', JSON.stringify(cookieObj));
  } else clearCookiesAndLogout();
}

export {
  clearCookiesAndLogout,
  decodeToken,
  extendCookieValidity,
  getHomePage,
  processCookiesAndUpdateSession,
  RestoreSessionAndNavigate,
  restoreSessionFromCookie,
  validateAuth,
};
