import React from "react";

export type RoleName = "Candidate" | "Recruitment Firm" | "Admin" | "SuperAdmin";

export interface selectionOption {
  key?: number | string;
  value: number | string;
  label: string;
}

export interface SelectionResponse {
  id: string,
  name: string,
}

export interface UserSession {
  id?: string;
  isAuth: boolean;
  roleId?: string,
  roleName?: RoleName,
  name?: string,
  maxAge: number,
  email?: string,
  profileURL: null | string,
}

export type ProtectedRouteProps = {
  Component: React.ComponentType;
};


