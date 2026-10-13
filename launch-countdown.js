/* One global launch period. Calendar days turn at 00:01, Europe/Paris. */
(function (root) {
  "use strict";
  const paris = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris", year: "numeric", month: "2-digit",
    day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  });
  function parts(instant) {
    return Object.fromEntries(paris.formatToParts(instant)
      .filter(p => p.type !== "literal").map(p => [p.type, Number(p.value)]));
  }
  function ordinal(p) { return Date.UTC(p.year, p.month - 1, p.day) / 86400000; }
  function launchState(config, now = new Date()) {
    const value = config && config.salesOpenAt;
    if (typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) {
      return { status: "unconfigured" };
    }
    const opening = new Date(value);
    if (!Number.isFinite(opening.getTime()) || !Number.isFinite(now.getTime())) {
      return { status: "unconfigured" };
    }
    if (now < opening) return { status: "not-open" };
    const launch = parts(opening), current = parts(now);
    // Before 12:01: count the launch date as day one.
    // From 12:01: day one is the next date. The first decrement is the
    // following 00:01, leaving a full first day showing 60.
    const firstDay = ordinal(launch) + (launch.hour * 60 + launch.minute >= 721 ? 1 : 0);
    const currentDay = ordinal(current) - (current.hour * 60 + current.minute < 1 ? 1 : 0);
    const elapsed = Math.max(0, currentDay - firstDay);
    const days = Math.max(0, 60 - elapsed);
    return { status: days ? "active" : "ended", days };
  }
  function countdownPresentation(state, previewEnabled) {
    if (state.status === "active") return {
      hidden: false, mode: "active",
      text: `${state.days} jour${state.days > 1 ? "s" : ""} restant${state.days > 1 ? "s" : ""} pour bénéficier du prix de lancement`
    };
    if (state.status === "ended") return {
      hidden: false, mode: "ended", text: "Période de lancement terminée"
    };
    return {
      hidden: previewEnabled !== true, mode: "preview",
      text: previewEnabled === true ? "Aperçu inactif · 60 jours restants pour bénéficier du prix de lancement" : ""
    };
  }
  function render() {
    const state = launchState(root.EC_LAUNCH_CONFIG);
    const presentation = countdownPresentation(state, root.EC_LAUNCH_CONFIG?.previewWhenInactive);
    const nodes = document.querySelectorAll("[data-launch-countdown]");
    for (const node of nodes) {
      node.hidden = presentation.hidden;
      node.dataset.launchMode = presentation.mode;
      node.textContent = presentation.text;
    }
    const price = document.querySelector(".v5-price-number");
    if (price) {
      if (!price.dataset.launchOriginal) price.dataset.launchOriginal = price.textContent;
      price.textContent = state.status === "ended" ? "Tarif à actualiser" : price.dataset.launchOriginal;
    }
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { launchState, countdownPresentation };
  }
  if (typeof document !== "undefined") {
    render();
    setInterval(render, 30000);
    document.addEventListener("visibilitychange", render);
  }
})(typeof window !== "undefined" ? window : globalThis);
