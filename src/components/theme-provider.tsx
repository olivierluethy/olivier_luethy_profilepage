"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

/**
 * Wraps next-themes. The provider injects a blocking script that sets the
 * theme class on <html> before paint, so there is no flash of the wrong theme.
 * <html> carries suppressHydrationWarning in the root layout to allow it.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
