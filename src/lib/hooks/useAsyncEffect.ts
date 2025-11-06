import { useEffect } from 'react';

type AsyncEffectCallback = () => Promise<void | (() => void)>;

type DependencyList = readonly unknown[];

export const useAsyncEffect = (
  callback: AsyncEffectCallback,
  deps: DependencyList = []
): void => {
  useEffect(() => {
    let dispose: void | (() => void);
    let active = true;

    const run = async () => {
      try {
        const cleanup = await callback();
        if (active) {
          dispose = cleanup ?? dispose;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[useAsyncEffect] Unhandled promise rejection', error);
      }
    };

    run();

    return () => {
      active = false;
      if (dispose) {
        dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useAsyncEffect;
