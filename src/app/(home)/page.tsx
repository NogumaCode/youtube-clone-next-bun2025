import { HydrateClient, trpc } from "@/trpc/server";
import { PageClient } from "./clinet";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
  void trpc.hello.prefetch({ text: "noguma" });
  return (
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>error...</p>}>
        <PageClient />
      </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}
