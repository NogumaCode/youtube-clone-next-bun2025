
import {  createTRPCRouter } from '../init'; // tRPC の基本設定をインポート
import { categoriesRouter } from '@/modules/categories/server/procedures';

//カテゴリーを取得
export const appRouter = createTRPCRouter({
  categories:categoriesRouter


});

// API の型をエクスポート（フロントエンドで型安全に API を使えるようにする）
export type AppRouter = typeof appRouter;
