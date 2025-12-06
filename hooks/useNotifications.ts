import { useCallback, useEffect, useState } from "react";

export interface Notification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  tag: string; // For deduplication and replacement
  timestamp: number;
  action?: {
    title: string;
    url: string;
  };
}

/**
 * Hook for managing browser push notifications
 * Handles:
 * - Permission requests
 * - Notification display
 * - Deduplication (max 1-2 per 12 hours per type)
 */
export function useNotifications() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [lastNotifications, setLastNotifications] = useState<Map<string, number>>(new Map());

  // Check if notifications are supported
  useEffect(() => {
    const isSupported = "Notification" in window && "serviceWorker" in navigator;
    setSupported(isSupported);

    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, []);

  // Request permission
  const requestPermission = useCallback(async () => {
    if (!supported) return false;

    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      return perm === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }, [supported]);

  // Check if we can send a notification (respects cooldown)
  const canSendNotification = useCallback(
    (tag: string): boolean => {
      const lastTime = lastNotifications.get(tag);
      if (!lastTime) return true;

      // 12 hour cooldown between same notification types
      const cooldownMs = 12 * 60 * 60 * 1000;
      return Date.now() - lastTime > cooldownMs;
    },
    [lastNotifications]
  );

  // Send notification
  const sendNotification = useCallback(
    async (notification: Notification) => {
      if (!supported || permission !== "granted") {
        console.warn("Notifications not supported or permission denied");
        return false;
      }

      // Check cooldown
      if (!canSendNotification(notification.tag)) {
        console.log(`Notification ${notification.tag} still in cooldown`);
        return false;
      }

      try {
        // Try to send via Service Worker (for background notifications)
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "SHOW_NOTIFICATION",
            notification,
          });
        } else {
          // Fallback to direct notification
          new Notification(notification.title, {
            body: notification.body,
            icon: notification.icon,
            tag: notification.tag,
            badge: "🍩",
          });
        }

        // Update cooldown tracking
        setLastNotifications((prev) => new Map(prev).set(notification.tag, Date.now()));
        return true;
      } catch (error) {
        console.error("Error sending notification:", error);
        return false;
      }
    },
    [supported, permission, canSendNotification]
  );

  return {
    supported,
    permission,
    requestPermission,
    sendNotification,
    canSendNotification,
  };
}

// Convenience hook for common game notifications
export function useGameNotifications() {
  const { sendNotification } = useNotifications();

  const notifyStatAlert = useCallback(
    (statName: string, status: "hungry" | "sad" | "dirty") => {
      const titles = {
        hungry: "Your donut is HUNGRY! 😟",
        sad: "Your donut is SAD! 😢",
        dirty: "Your donut needs cleaning! 🧼",
      };

      const bodies = {
        hungry: "Feed your donut now to maintain health!",
        sad: "Play with your donut to boost happiness!",
        dirty: "Interact with your donut to clean it!",
      };

      return sendNotification({
        id: `stat-alert-${Date.now()}`,
        title: titles[status],
        body: bodies[status],
        icon: "🍩",
        tag: `stat-alert-${status}`,
        timestamp: Date.now(),
      });
    },
    [sendNotification]
  );

  const notifyBreedingReady = useCallback(() => {
    return sendNotification({
      id: `breeding-ready-${Date.now()}`,
      title: "Ready to Breed! 💕",
      body: "Your donut is healthy and ready to find a breeding partner!",
      icon: "💕",
      tag: "breeding-ready",
      timestamp: Date.now(),
    });
  }, [sendNotification]);

  const notifyBreedingRequest = useCallback((donutName: string) => {
    return sendNotification({
      id: `breeding-request-${Date.now()}`,
      title: "Breeding Request! 💘",
      body: `Someone wants to breed with ${donutName}! Check the breeding board.`,
      icon: "💘",
      tag: "breeding-request",
      timestamp: Date.now(),
    });
  }, [sendNotification]);

  const notifyMilestone = useCallback((stage: string) => {
    const messages = {
      birth: { title: "Welcome! 🥚", body: "Your donut has been born! Start caring for it." },
      growth: {
        title: "Growing Up! 🌱",
        body: "Your donut entered the Growth phase. Keep feeding it!",
      },
      prime: {
        title: "Prime Time! ⭐",
        body: "Your donut is now in Prime phase. Time to consider breeding!",
      },
      twilight: {
        title: "Twilight Years 🌙",
        body: "Your donut is aging. Consider retiring it to the Sanctuary.",
      },
      legendary: {
        title: "LEGENDARY! 👑",
        body: "Incredible! Your donut has survived 100+ days!",
      },
    };

    const msg = messages[stage as keyof typeof messages];
    if (!msg) return Promise.resolve(false);

    return sendNotification({
      id: `milestone-${stage}-${Date.now()}`,
      title: msg.title,
      body: msg.body,
      icon: "🍩",
      tag: `milestone-${stage}`,
      timestamp: Date.now(),
    });
  }, [sendNotification]);

  const notifySocialVisit = useCallback((ownerName: string) => {
    return sendNotification({
      id: `social-visit-${Date.now()}`,
      title: "Someone Visited! 👀",
      body: `${ownerName} visited your donut profile! Earn +10 $DONUTAMAGOTCHI.`,
      icon: "👀",
      tag: "social-visit", // Batched - only 1 per 12 hours
      timestamp: Date.now(),
    });
  }, [sendNotification]);

  return {
    notifyStatAlert,
    notifyBreedingReady,
    notifyBreedingRequest,
    notifyMilestone,
    notifySocialVisit,
  };
}
