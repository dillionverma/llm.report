"use client";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { Hydrate, QueryClient, dehydrate } from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";
import { PropsWithChildren, useState } from "react";

export function blankIDBPersister() {
  return {
    persistClient: async (client: PersistedClient) => {},
    restoreClient: async () => {},
    removeClient: async () => {},
  } as Persister;
}

export function createIDBPersister(idbValidKey: IDBValidKey = "reactQuery") {
  return {
    persistClient: async (client: PersistedClient) => {
      try {
        await set(idbValidKey, client);
      } catch (error) {
        console.error("Error persisting client: ", error);
      }
    },
    restoreClient: async () => {
      try {
        const persistedClient = await get<PersistedClient>(idbValidKey);
        return persistedClient;
      } catch (error) {
        console.error("Error restoring client: ", error);
      }
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  } as Persister;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: true,
    },
  },
});
export const ReactQueryProvider = ({ children }: PropsWithChildren) => {
  const [client] = useState(queryClient);

  const [persister] = useState(() => {
    if (typeof window === "undefined") return;
    if ("indexedDB" in window) return createIDBPersister();
    else if ("localStorage" in window) {
      let _window = window as any;
      return createSyncStoragePersister({
        storage: _window?.localStorage,
      });
    }

    return;
  });

  const dehydratedState = dehydrate(client, {
    shouldDehydrateQuery: () => true,
  });

  return (
    <PersistQueryClientProvider
      client={client}
      persistOptions={{
        persister: persister!,
      }}
    >
      <Hydrate state={dehydratedState}>{children}</Hydrate>
    </PersistQueryClientProvider>
  );
};
