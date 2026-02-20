'use client';

import { ReactNode, useState } from 'react';
import createCache, { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

type EmotionCacheWithFlush = EmotionCache & {
  inserted: Record<string, string | true>;
  flush: () => string[];
};

const createRtlCache = (): EmotionCacheWithFlush => {
  const cache = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  }) as EmotionCacheWithFlush;

  cache.compat = true;

  const prevInsert = cache.insert;
  let inserted: string[] = [];

  cache.insert = (...args) => {
    const serialized = args[1];

    if (!cache.inserted[serialized.name]) {
      inserted.push(serialized.name);
    }

    return prevInsert(...args);
  };

  cache.flush = () => {
    const prevInserted = inserted;
    inserted = [];
    return prevInserted;
  };

  return cache;
};

const MUIRtlConfig = ({ children }: { children: ReactNode }) => {
  const [cache] = useState(createRtlCache);

  useServerInsertedHTML(() => {
    const names = cache.flush();

    if (!names.length) {
      return null;
    }

    let styles = '';

    names.forEach((name) => {
      const style = cache.inserted[name];
      if (typeof style === 'string') {
        styles += style;
      }
    });

    return (
      <style
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
};

export default MUIRtlConfig;
