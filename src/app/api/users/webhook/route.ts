import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error:ダッシュボードのCLERK_SIGNING_SECRETを.envまたは.env.localに追加してください。"
    );
  }

  // 新しいSvixインスタンスを作成する
  const wh = new Webhook(SIGNING_SECRET);

  // メッセージの情報を取得
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // 必要な情報がない場合、エラーを返す
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // メッセージの内容（ボディ）を受け取る
  const payload = await req.json();
  const body = JSON.stringify(payload);

  //メッセージが本物かチェックする
  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: ウェブフックを検証できませんでした:", err);
    return new Response("Error: 検証エラー", {
      status: 400,
    });
  }

  // メッセージの種類を調べる
  const eventType = evt.type;

  //ユーザーが作られたときの処理
  if (eventType === "user.created") {
    const { data } = evt;

    await db.insert(users).values({
      clerkId: data.id,
      name: `${data.first_name} ${data.last_name}`,
      imageUrl: data.image_url,
    });
  }

  //ユーザーが削除されたときの処理

  if (eventType === "user.deleted") {
    const { data } = evt;

    if (!data.id) {
      return new Response("Missing user id", { status: 400 });
    }
    await db.delete(users).where(eq(users.clerkId, data.id));
  }

  //ユーザー情報が更新されたときの処理
  if (eventType === "user.updated") {
    const { data } = evt;

    await db
      .update(users)
      .set({
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.image_url,
      })
      .where(eq(users.clerkId, data.id));
  }

  return new Response("Webhook received", { status: 200 });
}

// GET リクエストをブロック
export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
