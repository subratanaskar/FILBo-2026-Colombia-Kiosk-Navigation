const state = {
  // attract (first-video) | welcome | namaste | explore | kiosk_loading | map
  screen: "attract",
  lang: "en",
  selectedZone: null,
  detailsZone: null,
  helpFilter: null,
  // Intro video mode: false = one-time intro, true = idle loop intro.
  introLoopMode: false,
  // Global background-music state shared across screens.
  bgMusicMuted: true,
  bgMusicPlaying: false,
  bgMusicHasTrustedInteraction: false,
  // Incremented to force a clean footstep replay when the same zone is tapped again.
  footstepRun: 0
};

const app = document.getElementById("app");
const appWrap = document.getElementById("appWrap");
const FALLBACK_LANG = "en";

function escapeHtml(s) {
  // Avoid newer String.prototype.replaceAll for broader kiosk browser compatibility.
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function t(key) {
  const dict = COPY[state.lang] ?? COPY[FALLBACK_LANG] ?? {};
  return dict[key] ?? key;
}

function z(key, zoneId) {
  const langZones = ZONE_COPY[state.lang] ?? ZONE_COPY[FALLBACK_LANG] ?? {};
  return langZones[zoneId]?.[key] ?? "";
}

function applyScale() {
  if (!appWrap) return;
  const scale = Math.min(window.innerWidth / SCREEN_W, window.innerHeight / SCREEN_H);
  const tx = Math.round((window.innerWidth - SCREEN_W * scale) / 2);
  const ty = Math.round((window.innerHeight - SCREEN_H * scale) / 2);
  appWrap.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
}
