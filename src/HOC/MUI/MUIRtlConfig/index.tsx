import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { ReactNode } from "react";

// Create rtl cache
const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

function MUIRtlConfig({ children }: { children: ReactNode }) {
  return <CacheProvider value={rtlCache}>{children}</CacheProvider>;
}

export default MUIRtlConfig;
