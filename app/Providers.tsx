"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ConvexClientProvider } from "@/components/web/ConvexClientProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </ThemeProvider>
  );
}
