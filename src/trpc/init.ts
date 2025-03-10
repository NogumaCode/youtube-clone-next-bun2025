import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { cache } from "react";
import superjson from "superjson";
import {ratelimit} from '@/lib/ratelimit'

//サーバーに共通の情報を渡す準備
export const createTRPCContext = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    // console.warn("⚠️ Clerk のユーザーIDが取得できませんでした");
    return { clerkUserId: null }; // 明示的に `null` を返す
  }

  return { clerkUserId: userId };
});

//createTRPCContext() を実行したときの結果（ログインユーザーID）と同じ型を Context として定義する
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

//tRPCの基本設定を作る
// "t" という名前の変数をそのままエクスポートしないようにしている
// （理由：他のライブラリでも "t" という変数をよく使うため、わかりやすい名前を付ける）
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   *
   * データのやり取りのルールを決める設定。
   * 例えば、日付や特殊なデータをそのまま扱えるようにするための変換を追加できる。
   */
  transformer: superjson,
});

//  APIを作るための便利な関数を用意
export const createTRPCRouter = t.router; // ここからAPIの入り口（ルート）を作る
export const createCallerFactory = t.createCallerFactory; // サーバー側のコード内でAPIを直接呼び出せるようにする
export const baseProcedure = t.procedure; // 実際のAPIの処理を作るための基本の設定


export const protectedProcedure = t.procedure.use(async function isAuthed(
  opts
) {
  const { ctx } = opts;

  if (!ctx.clerkUserId) {
    console.error("🚨 Clerk の userId が取得できていません");
    return opts.next({
      ctx: {
        ...ctx,
        user: null, // `user` を `null` に設定し、フロント側で認証がないことを判断できるようにする
      },
    });
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, ctx.clerkUserId))
    .limit(1);

    // console.log("🛠️ DB user:", user);

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const {success} = await ratelimit.limit(user.id);

  if(!success){
    throw new TRPCError({code:"TOO_MANY_REQUESTS"})
  }

  return opts.next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
