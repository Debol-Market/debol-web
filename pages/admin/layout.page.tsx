import useApp from "@/services/appContext";
import { Client, TokenProvider } from "@pusher/push-notifications-web";
import React, { useEffect, ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const data = useApp();

  useEffect(() => {
    if (!data.user || !data.isAdmin) return;
    const tokenProvider = new TokenProvider({
      url: `${process.env.host}/api/pusher/beams-auth`,
      credentials: "include",
    });

    const beamsClient = new Client({
      instanceId: process.env.NEXT_PUBLIC_PUSHER_INSTANCE ?? "",
    });

    beamsClient.start().then(() => {
      beamsClient.setUserId(data.user!.uid, tokenProvider);
    });
  }, [data?.user?.uid]);

  return <>{children}</>;
}
