import PushNotifications from "@pusher/push-notifications-server";

export const pusherClient = new PushNotifications({
  secretKey: process.env.PUSHER_SECRET ?? "",
  instanceId: process.env.NEXT_PUBLIC_PUSHER_INSTANCE ?? "",
});

