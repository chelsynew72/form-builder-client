"use client";

export const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

export const setAccessToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', token);
};

export const removeAccessToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
};
export const isAuthenticated = () => {
  return !!getAccessToken();
};