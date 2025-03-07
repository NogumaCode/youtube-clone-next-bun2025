import { z } from 'zod'; // 入力データの型チェックをするライブラリ
import { baseProcedure, createTRPCRouter } from '../init'; // tRPC の基本設定をインポート
// import { TRPCError } from '@trpc/server';

//helloというAPIを作る
export const appRouter = createTRPCRouter({

  hello: baseProcedure
    .input(
      z.object({
        text: z.string(), // `text` は必ず文字列でなければならない
      }),
    )
    // クライアントからのリクエストを処理する
    .query((opts) => {
      // throw new TRPCError({code:"BAD_REQUEST"} )
      return {
        greeting: `hello ${opts.input.text}`, // 受け取った `text` に "hello" をつけて返す
      };
    }),
});

// API の型をエクスポート（フロントエンドで型安全に API を使えるようにする）
export type AppRouter = typeof appRouter;
