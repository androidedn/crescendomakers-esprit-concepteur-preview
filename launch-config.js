/* Set only when the real sales opening is confirmed.
   ISO 8601 instant with an explicit offset, e.g. YYYY-MM-DDTHH:mm:ss+01:00.
   null keeps every countdown hidden. Never restart per visitor. */
window.EC_LAUNCH_CONFIG = Object.freeze({ salesOpenAt: null, durationDays: 60 });
