"use client"

import { createContext } from "react";

function noop() { }
function login(accessToken: any, userId: any, isAdminLogin: boolean) {}

const AuthContext = createContext({
  token: '' as string | null,
  userId: null as string | number | null,
  login: login,
  logout: noop,
  isAuthenticated: false,
  isAdmin: false,
})
export default AuthContext;
