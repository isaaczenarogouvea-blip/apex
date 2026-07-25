import * as Notifications from 'expo-notifications';

import { DayStatus, END_OF_DAY_MESSAGES, SCHEDULED_NOTIFICATIONS } from '../../constants/notifications';

/**
 * Requests notification permissions (if not already granted), wipes any
 * previously scheduled notifications, and re-schedules the full daily set
 * from constants/notifications.ts. Safe to call on every app start / after
 * any change to the schedule — it's fully idempotent.
 */
export async function scheduleAllNotifications(): Promise<void> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const notification of SCHEDULED_NOTIFICATIONS) {
    const [hourStr, minuteStr] = notification.time.split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    await Notifications.scheduleNotificationAsync({
      identifier: notification.id,
      content: {
        title: notification.title,
        body: notification.body,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  }
}

/**
 * Fires an immediate notification summarizing how the day went, using the
 * canned copy from constants/notifications.ts.
 */
export async function sendEndOfDayNotification(dayStatus: DayStatus): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'APEX — RESUMO DO DIA',
      body: END_OF_DAY_MESSAGES[dayStatus],
      sound: true,
    },
    trigger: null,
  });
}
