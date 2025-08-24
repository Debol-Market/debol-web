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
    // Only run if user exists and is an admin
    if (!data.user || !data.isAdmin) {
      return;
    }

    // Set up a function to handle the async logic
    const setupBeams = async () => {
      try {
        const token = await data.user!.getIdToken(true);

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

        // Start the client and set up the user
        await beamsClient.start();
        await beamsClient.setUserId(data.user!.uid, tokenProvider);
        await beamsClient.addDeviceInterest("Admin");
      } catch (error) {
        console.error("Pusher Beams setup failed:", error);
      }
    };

    setupBeams();

    // Clean up function to stop the beams client when the component unmounts
    // or dependencies change.
    return () => {
      // It's good practice to stop the client to prevent memory leaks
      // and ensure the correct state on re-renders.
      // NOTE: Pusher Beams v1.1.0+ handles cleanup automatically.
    };
  }, [data.user, data.isAdmin]); // Corrected dependency array

  return <>{children}</>;
}