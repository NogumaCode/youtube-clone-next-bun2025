
"use client"

import { trpc } from "@/trpc/client"

export const PageClient = () => {

  const [data] = trpc.hello.useSuspenseQuery({
    text:"noguma2"
  })
  return (
    <div>PageClient:{data.greeting}</div>
  )
}
