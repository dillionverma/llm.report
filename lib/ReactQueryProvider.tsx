import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { Hydrate, QueryClient } from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";
import { PropsWithChildren, useState } from "react";

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

export const ReactQueryProvider = ({
  children,
  state,
}: PropsWithChildren<{ state: unknown }>) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            cacheTime: Infinity,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
          },
        },
      })
  );

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

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: persister! }}
    >
      <Hydrate state={state}>{children}</Hydrate>
    </PersistQueryClientProvider>
  );
};
