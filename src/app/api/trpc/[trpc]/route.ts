import { fetchRequestHandler } from '@trpc/server/adapters/fetch'; // tRPCのリクエストを処理する準備
import { createTRPCContext } from '@/trpc/init'; // tRPCのコンテキスト（ユーザー情報など）を取得する関数をインポート
import { appRouter } from '@/trpc/routers/_app'; // tRPCのルーター（APIのルート）をインポート

// APIリクエストを処理する関数（handler）を作成
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc', // APIのエンドポイント（URL）
    req, // クライアントから送られてきたリクエスト
    router: appRouter, // APIのルート情報（どんなAPIがあるか）
    createContext: createTRPCContext, // リクエストごとにコンテキスト（ユーザー情報など）を作成する関数
  });

// Next.js のAPIルートとして、GETとPOSTリクエストを受け付けるように設定
export { handler as GET, handler as POST };
