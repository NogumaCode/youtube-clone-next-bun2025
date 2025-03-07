import 'server-only'; // server-only をインポートして、このファイルを「サーバー専用」にする
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cache } from 'react';
import { createCallerFactory, createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';
// getQueryClient を作成（サーバーのデータキャッシュ管理）
//キャッシュ機能を使って、サーバーのリクエストごとに同じ QueryClient を使う 同じリクエストの間は、毎回APIを呼ばずにデータを覚えておくメモを使う
export const getQueryClient = cache(makeQueryClient);
//createCallerFactory を使って、サーバー側からtRPC APIを直接呼び出せるようにする
const caller = createCallerFactory(appRouter)(createTRPCContext);
//createHydrationHelpers を使って、サーバーで取得したデータをクライアントに渡せるようにする
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient,
);
