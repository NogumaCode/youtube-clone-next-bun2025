import {
  defaultShouldDehydrateQuery, // デフォルトの「キャッシュを保持するべきかどうか」の判定関数
  QueryClient, // React Query でデータを管理するためのクライアント
} from '@tanstack/react-query';
import superjson from 'superjson'; // データを JSON として安全に保存・復元するライブラリ

// QueryClient（React Query のデータ管理オブジェクト）を作成する関数
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // データが「古い」とみなされるまでの時間（30秒）
      },
      dehydrate: {
        /**
         * サーバー側でデータを保存（シリアライズ）する場合の設定
         * superjson を使うと、Date 型などの特殊なデータも JSON として正しく保存できる
         */
        serializeData: superjson.serialize,

        /**
         * キャッシュを保持するべきかどうかを判定する関数
         * - `defaultShouldDehydrateQuery(query)` → 通常のキャッシュ判定
         * - `query.state.status === 'pending'` → リクエスト中（未完了）のデータもキャッシュする
         */
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
      hydrate: {
        /**
         * サーバー側で保存したデータを復元（デシリアライズ）する場合の設定
         * superjson を使うと、元のデータ型を正しく復元できる
         */
        deserializeData: superjson.deserialize,
      },
    },
  });
}
