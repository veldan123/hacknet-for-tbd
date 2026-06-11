const { onValueCreated, onValueUpdated } = require("firebase-functions/v2/database");
const { initializeApp } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const { getDatabase } = require("firebase-admin/database");

initializeApp();

// Fires when a new hack is created — notifies the target immediately
exports.notifyHackStart = onValueCreated(
  { ref: "/activeHacks/{hackId}", region: "asia-southeast1" },
  async (event) => {
    const hack = event.data.val();
    if (!hack || !hack.targetId) return;

    const token = await getTargetToken(hack.targetId);
    if (!token) return;

    await sendPush(
      token,
      "⚠ BREACH DETECTED",
      `${hack.hackerName} has accessed your account! Open HACKNET to intercept!`
    );
  }
);

// Fires when hack status changes to 'stealing' — sends urgent second notification
exports.notifyHackStealing = onValueUpdated(
  { ref: "/activeHacks/{hackId}", region: "asia-southeast1" },
  async (event) => {
    const before = event.data.before.val();
    const after  = event.data.after.val();
    if (!after || !after.targetId) return;
    if (before.status === after.status) return;
    if (after.status !== "stealing") return;

    const token = await getTargetToken(after.targetId);
    if (!token) return;

    await sendPush(
      token,
      "🚨 CREDITS BEING STOLEN",
      `${after.hackerName} is stealing ${after.amount} credits from you! INTERCEPT NOW!`
    );
  }
);

// Fires when a player's lastBonusTime updates — means they just got their hourly bonus
exports.notifyHourlyBonus = onValueUpdated(
  { ref: "/players/{playerId}/lastBonusTime", region: "asia-southeast1" },
  async (event) => {
    const playerId = event.params.playerId;
    const token = await getTargetToken(playerId);
    if (!token) return;

    await sendPush(
      token,
      "💰 CREDITS REPLENISHED",
      "+1000 credits have been added to your account. Login to spend them!"
    );
  }
);

async function getTargetToken(playerId) {
  const snap = await getDatabase().ref(`players/${playerId}/fcmToken`).get();
  return snap.exists() ? snap.val() : null;
}

async function sendPush(token, title, body) {
  try {
    await getMessaging().send({
      token,
      notification: { title, body },
      webpush: {
        notification: {
          title,
          body,
          icon:     "/hacknet/icon.png",
          tag:      "hacknet-breach",
          renotify: true,
          vibrate:  [200, 100, 200, 100, 400],
        },
        fcmOptions: { link: "https://veldan123.github.io/hacknet-for-tbd/" },
      },
    });
  } catch (e) {
    console.error("FCM send error:", e.message);
  }
}
