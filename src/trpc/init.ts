import { initTRPC } from '@trpc/server';
import { cache } from 'react';

//サーバーに共通の情報を渡す準備
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   *
   * tRPCでAPIを作るときに「リクエストごとに共通の情報（例：ログイン中のユーザーの情報）」を渡せるようにする設定。
   * ここでは仮のユーザーID "user_123" を返しているが、実際にはログイン中のユーザーIDを入れる。
   */
  return { userId: 'user_123' };
});

//tRPCの基本設定を作る
// "t" という名前の変数をそのままエクスポートしないようにしている
// （理由：他のライブラリでも "t" という変数をよく使うため、わかりやすい名前を付ける）
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   *
   * データのやり取りのルールを決める設定。
   * 例えば、日付や特殊なデータをそのまま扱えるようにするための変換を追加できる。
   */
  // transformer: superjson,
});

//  APIを作るための便利な関数を用意
export const createTRPCRouter = t.router; // ここからAPIの入り口（ルート）を作る
export const createCallerFactory = t.createCallerFactory; // サーバー側のコード内でAPIを直接呼び出せるようにする
export const baseProcedure = t.procedure; // 実際のAPIの処理を作るための基本の設定
