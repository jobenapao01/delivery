import React from "react";
import QueryProvider from "./queryProvider";
import ModalProvider from "./modalProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { Toaster } from "sonner";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <ModalProvider />
      <Toaster position="top-center" richColors />
      <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />

      {children}
    </QueryProvider>
  );
};

export default Providers;
