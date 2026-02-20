import { ReactNode, useState } from 'react';
import createCache, { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

type EmotionCacheWithFlush = EmotionCache & {
  inserted: Record<string, string | true>;
};

const createRtlCache = (): EmotionCacheWithFlush => {
  const cache = createCache({
    key: 'muirtl',
  }) as EmotionCacheWithFlush;

  cache.compat = true;

  const prevInsert = cache.insert;

  cache.insert = (...args) => {
    return prevInsert(...args);
  };

  return cache;
};

const MUIRtlConfig = ({ children }: { children: ReactNode }) => {
  const [cache] = useState(createRtlCache);

  return <CacheProvider value={cache}>{children}</CacheProvider>;
};

export default MUIRtlConfig;
