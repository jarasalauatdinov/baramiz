import { Suspense, lazy, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react';
import { Center, Loader } from '@mantine/core';

export const PageLoader = () => (
  <Center h="min(55vh, 420px)">
    <Loader color="sun" size="lg" />
  </Center>
);

export const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

export const lazyPage = <TModule, TComponent extends ComponentType<any>>(
  loader: () => Promise<TModule>,
  pick: (module: TModule) => TComponent,
): LazyExoticComponent<TComponent> =>
  lazy(async () => ({
    default: pick(await loader()),
  }));

