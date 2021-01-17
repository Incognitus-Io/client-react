import {
  IncognitusConfig,
  IncognitusService,
} from '@incognitus/client-web-core';
import { useEffect, useMemo, useRef, useState } from 'react';

let service: IncognitusService | null;

export const useInitIncognitus = (config: IncognitusConfig) => {
  const [svc, setSvc] = useState<IncognitusService | null>(null);
  service = svc;

  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      let isStopped = false;
      if (!isStopped) {
        const init = async () => {
          const svc = await IncognitusService.initialize(config);
          if (!isStopped) {
            setSvc(svc);
          }
        };

        init();
      }
      didMountRef.current = true;

      return () => {
        isStopped = true;
      };
    }
  });
};

export const useIncognitus = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isReady = useMemo(() => service != null, [service]);

  return {
    service,
    isReady,
  };
};
