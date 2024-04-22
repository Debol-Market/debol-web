import useApp from "@/services/appContext";
import { Client, TokenProvider } from "@pusher/push-notifications-web";
import { ReactNode, useEffect } from "react";

export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const data = useApp();

  useEffect(() => {
    if (!data.user || !data.isAdmin) return;
    data.user!.getIdToken(true).then((token) => {
      const tokenProvider = new TokenProvider({
        url: `/api/pusher/beams-auth`,
        headers: {
          authorization: `bearer ${token}`,
        },
        credentials: "include",
      });

      const beamsClient = new Client({
        instanceId: process.env.NEXT_PUBLIC_PUSHER_INSTANCE ?? "",
      });

      beamsClient.start().then(() => {
        beamsClient.setUserId(data.user!.uid, tokenProvider);
        beamsClient.addDeviceInterest("Admin");
      });
    });
  }, [data?.user?.uid]);

  return <>{children}</>;
}
