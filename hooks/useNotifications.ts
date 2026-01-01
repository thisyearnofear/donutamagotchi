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

  /**
   * NEW: Only check feeding status (lastFedTime)
   * OLD system had: hungry, sad, dirty alerts
   * 
   * Play/Pet are now cosmetic - no notifications needed
   */
  const notifyFeedingAlert = useCallback(
    (daysSinceFed: number, status: "warning" | "critical") => {
      const isCritical = status === "critical";
      const daysLeft = Math.max(0, 3 - daysSinceFed);

      return sendNotification({
        id: `feeding-alert-${Date.now()}`,
        title: isCritical 
          ? `🔴 URGENT: Feed Now! (${daysLeft}d left)` 
          : "⚠️ Haven't Fed in 24h",
        body: isCritical
          ? `Your donut will auto-retire to sanctuary in ${daysLeft} day${daysLeft !== 1 ? 's' : ''} if not fed!`
          : "Feed your donut within the next 24 hours to stay healthy and earn rewards!",
        icon: "🍩",
        tag: `feeding-alert-${status}`,
        timestamp: Date.now(),
      });
    },
    [sendNotification]
  );

  /**
   * @deprecated Old stat alert system (happiness, cleanliness)
   * Kept for backwards compatibility but no longer used
   */
  const notifyStatAlert = useCallback(
    (statName: string, status: "hungry" | "sad" | "dirty") => {
      console.warn(`[DEPRECATED] notifyStatAlert called with ${status}. Use notifyFeedingAlert instead.`);
      // No-op - old system no longer relevant
      return Promise.resolve(false);
    },
    []
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
    notifyFeedingAlert,     // NEW: Use this for feeding status alerts
    notifyStatAlert,        // @deprecated: Old system, no longer used
    notifyBreedingReady,
    notifyBreedingRequest,
    notifyMilestone,
    notifySocialVisit,
  };
}
