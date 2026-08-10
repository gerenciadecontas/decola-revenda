'use client';

import React from 'react';
import { RoleProvider } from "./context/RoleContext";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return React.createElement(RoleProvider, null, children);
}
