
window.addEventListener("resize", applyScale);
applyScale();

const BACKGROUND_MUSIC_ID = "kioskBackgroundMusic";
const BACKGROUND_MUSIC_SRC = `./assets/Music/background-music.mp3?v=${ASSET_VERSION}`;
const TAP_SOUND_ID = "kioskTapSound";
const TAP_SOUND_SRC = `./assets/Music/tap-sound.mp3?v=${ASSET_VERSION}`;
const INACTIVITY_TIMEOUT_MS = 100000;
const BACKGROUND_MUSIC_FADE_MS = 260;
const BACKGROUND_MUSIC_VOLUME = 1;
const BACKGROUND_MUSIC_PREF_KEY = "filboBackgroundMusicMuted";
let inactivityTimerId = null;
let backgroundMusicFadeRafId = null;

state.bgMusicMuted = loadBackgroundMusicMutedPreference();
state.bgMusicPlaying = false;
state.bgMusicHasTrustedInteraction = false;
// First-video UI must always start in muted state.
if (state.screen === "attract" && !state.introLoopMode) {
  state.bgMusicMuted = true;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function loadBackgroundMusicMutedPreference() {
  try {
    const raw = window.localStorage.getItem(BACKGROUND_MUSIC_PREF_KEY);
    if (raw === null) return true;
    return raw === "1";
  } catch (_err) {
    return true;
  }
}

function saveBackgroundMusicMutedPreference() {
  try {
    window.localStorage.setItem(BACKGROUND_MUSIC_PREF_KEY, state.bgMusicMuted ? "1" : "0");
  } catch (_err) {
    // localStorage can fail in restricted environments; keep runtime state only.
  }
}

function cancelBackgroundMusicFade() {
  if (backgroundMusicFadeRafId === null) return;
  window.cancelAnimationFrame(backgroundMusicFadeRafId);
  backgroundMusicFadeRafId = null;
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
}

function animateBackgroundMusicVolume(audio, from, to, durationMs, onDone) {
  cancelBackgroundMusicFade();

  const startVolume = clamp(Number.isFinite(from) ? from : to, 0, 1);
  const endVolume = clamp(Number.isFinite(to) ? to : startVolume, 0, 1);
  if (durationMs <= 0 || Math.abs(endVolume - startVolume) < 0.001) {
    audio.volume = endVolume;
    if (typeof onDone === "function") onDone();
    return;
  }

  let startTime = null;
  const tick = (now) => {
    if (startTime === null) startTime = now;
    const progress = clamp((now - startTime) / durationMs, 0, 1);
    const eased = easeInOutQuad(progress);
    audio.volume = startVolume + (endVolume - startVolume) * eased;

    if (progress < 1) {
      backgroundMusicFadeRafId = window.requestAnimationFrame(tick);
      return;
    }

    backgroundMusicFadeRafId = null;
    if (typeof onDone === "function") onDone();
  };

  backgroundMusicFadeRafId = window.requestAnimationFrame(tick);
}

function backgroundMusicIconSvg(isMuted) {
  if (isMuted) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10v4h4l5 4V6L7 10H3z" fill="currentColor"></path>
        <path d="m16.5 9.5 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 10v4h4l5 4V6L7 10H3z" fill="currentColor"></path>
      <path d="M14 7.2a5.1 5.1 0 0 1 0 9.6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"></path>
      <path d="M16.5 4.3a9.1 9.1 0 0 1 0 15.4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"></path>
    </svg>
  `;
}

function syncVideoTapOverlay(video, overlay) {
  if (!video || !overlay) return;

  const sync = () => {
    const isPlaying = !video.paused && !video.ended;
    overlay.classList.toggle("isVisible", isPlaying);
  };

  video.addEventListener("play", sync);
  video.addEventListener("playing", sync);
  video.addEventListener("pause", sync);
  video.addEventListener("ended", sync);
  sync();
}

function updateBackgroundMusicToggleUi() {
  const btn = document.getElementById("backgroundMusicToggle");
  if (!btn) return;

  btn.classList.toggle("isMuted", state.bgMusicMuted);
  btn.classList.toggle("isUnmuted", !state.bgMusicMuted);
  btn.setAttribute("aria-label", state.bgMusicMuted ? "Unmute background music" : "Mute background music");
  btn.setAttribute("aria-pressed", String(!state.bgMusicMuted));
  btn.innerHTML = backgroundMusicIconSvg(state.bgMusicMuted);
}

function ensureBackgroundMusicEl() {
  let audio = document.getElementById(BACKGROUND_MUSIC_ID);
  if (audio) {
    if (!audio.dataset.boundState) {
      audio.dataset.boundState = "1";
      audio.addEventListener("play", () => {
        state.bgMusicPlaying = true;
      });
      audio.addEventListener("pause", () => {
        state.bgMusicPlaying = false;
      });
      audio.addEventListener("ended", () => {
        state.bgMusicPlaying = false;
      });
    }
    return audio;
  }

  audio = document.createElement("audio");
  audio.id = BACKGROUND_MUSIC_ID;
  audio.src = BACKGROUND_MUSIC_SRC;
  audio.preload = "auto";
  audio.loop = true;
  audio.setAttribute("playsinline", "");
  audio.volume = BACKGROUND_MUSIC_VOLUME;
  audio.style.display = "none";
  audio.dataset.boundState = "1";
  audio.addEventListener("play", () => {
    state.bgMusicPlaying = true;
  });
  audio.addEventListener("pause", () => {
    state.bgMusicPlaying = false;
  });
  audio.addEventListener("ended", () => {
    state.bgMusicPlaying = false;
  });
  document.body.appendChild(audio);
  return audio;
}

function playBackgroundMusic({ animate = true } = {}) {
  if (state.bgMusicMuted || !state.bgMusicHasTrustedInteraction) return;
  const audio = ensureBackgroundMusicEl();
  if (!audio) return;
  audio.muted = false;

  cancelBackgroundMusicFade();
  if (audio.paused) {
    audio.volume = animate ? 0 : BACKGROUND_MUSIC_VOLUME;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => {
          state.bgMusicPlaying = true;
        })
        .catch(() => {
          // Playback may be blocked until a trusted interaction; ignore quietly.
          state.bgMusicPlaying = !audio.paused;
        });
    }
  } else {
    state.bgMusicPlaying = true;
  }

  if (!animate) {
    audio.volume = BACKGROUND_MUSIC_VOLUME;
    return;
  }

  animateBackgroundMusicVolume(audio, audio.volume, BACKGROUND_MUSIC_VOLUME, BACKGROUND_MUSIC_FADE_MS);
}

function pauseBackgroundMusic({ animate = true } = {}) {
  const audio = ensureBackgroundMusicEl();
  if (!audio) return;

  cancelBackgroundMusicFade();
  if (audio.paused) {
    audio.volume = BACKGROUND_MUSIC_VOLUME;
    state.bgMusicPlaying = false;
    return;
  }

  if (!animate) {
    audio.pause();
    audio.volume = BACKGROUND_MUSIC_VOLUME;
    state.bgMusicPlaying = false;
    return;
  }

  animateBackgroundMusicVolume(audio, audio.volume, 0, BACKGROUND_MUSIC_FADE_MS, () => {
    audio.pause();
    audio.volume = BACKGROUND_MUSIC_VOLUME;
    state.bgMusicPlaying = false;
  });
}

function syncBackgroundMusicPlayback({ animate = true } = {}) {
  updateBackgroundMusicToggleUi();
  const audio = ensureBackgroundMusicEl();
  if (audio) {
    audio.muted = state.bgMusicMuted;
  }
  if (!state.bgMusicHasTrustedInteraction || state.bgMusicMuted) {
    pauseBackgroundMusic({ animate });
    return;
  }
  playBackgroundMusic({ animate });
}

function registerTrustedInteraction() {
  if (!state.bgMusicHasTrustedInteraction) state.bgMusicHasTrustedInteraction = true;
  syncBackgroundMusicPlayback({ animate: true });
}

function toggleBackgroundMusicMuted() {
  state.bgMusicMuted = !state.bgMusicMuted;
  saveBackgroundMusicMutedPreference();
  syncBackgroundMusicPlayback({ animate: true });
}

function enableBackgroundMusicForHomeTransition() {
  state.bgMusicMuted = false;
  saveBackgroundMusicMutedPreference();
  syncBackgroundMusicPlayback({ animate: true });
}

function enterIdleIntroLoop() {
  const shouldRerender = state.screen !== "attract" || !state.introLoopMode;

  state.screen = "attract";
  state.selectedZone = null;
  state.detailsZone = null;
  state.helpFilter = null;
  state.introLoopMode = true;
  state.bgMusicMuted = false;
  saveBackgroundMusicMutedPreference();
  syncBackgroundMusicPlayback({ animate: true });

  if (shouldRerender) {
    rerender();
  }
}

function navigateToHomeScreen({ autoEnableMusic = false } = {}) {
  state.screen = "welcome";
  state.selectedZone = null;
  state.detailsZone = null;
  state.helpFilter = null;
  if (autoEnableMusic) enableBackgroundMusicForHomeTransition();
  rerender();
}

function closestElementBySelector(target, selector) {
  if (!(target instanceof Element)) return null;
  if (typeof target.closest === "function") return target.closest(selector);

  // Fallback for older embedded browsers where SVG child nodes may not expose .closest reliably.
  let node = target;
  while (node && node instanceof Element) {
    if (typeof node.matches === "function" && node.matches(selector)) return node;
    node = node.parentElement;
  }
  return null;
}

function isBackgroundMusicToggleTarget(target) {
  return Boolean(closestElementBySelector(target, "#backgroundMusicToggle"));
}

function clearInactivityTimer() {
  if (inactivityTimerId === null) return;
  window.clearTimeout(inactivityTimerId);
  inactivityTimerId = null;
}

function resetInactivityTimer() {
  clearInactivityTimer();
  inactivityTimerId = window.setTimeout(() => {
    inactivityTimerId = null;
    enterIdleIntroLoop();
    // Keep monitoring continuously, including while attract is visible.
    resetInactivityTimer();
  }, INACTIVITY_TIMEOUT_MS);
}

function recordActivity() {
  resetInactivityTimer();
}

function ensureTapSoundEl() {
  let audio = document.getElementById(TAP_SOUND_ID);
  if (audio) return audio;

  audio = document.createElement("audio");
  audio.id = TAP_SOUND_ID;
  audio.src = TAP_SOUND_SRC;
  audio.preload = "auto";
  audio.setAttribute("playsinline", "");
  audio.style.display = "none";
  document.body.appendChild(audio);
  return audio;
}

function playTapSound() {
  const audio = ensureTapSoundEl();
  if (!audio) return;

  try {
    audio.pause();
    audio.currentTime = 0;
  } catch (_err) {
    // Reset can fail on some browsers if metadata is not ready; continue to play attempt.
  }

  const playPromise = audio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      // Tap sound can fail if browser blocks playback unexpectedly.
    });
  }
}

function homeIconSvg() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
    </svg>
  `;
}

function handIconSvg() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a2 2 0 0 0-2 2v7H9V6a2 2 0 0 0-4 0v9c0 3.866 3.134 7 7 7h1c3.314 0 6-2.686 6-6v-5a2 2 0 0 0-4 0v1h-1V4a2 2 0 0 0-2-2Z"></path>
    </svg>
  `;
}

function chevronLeftSvg() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.41 7.41 14 6 8 12l6 6 1.41-1.41L10.83 12z"></path>
    </svg>
  `;
}

function chevronRightSvg() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"></path>
    </svg>
  `;
}

function arrowDownSvg() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" class="helpGridHintArrow">
      <path d="M12 21 4.5 13.5l1.6-1.6L11 16.8V3h2v13.8l4.9-4.9 1.6 1.6L12 21Z"></path>
    </svg>
  `;
}

function renderLangToggle() {
  const enActive = state.lang === "en" ? "isActive" : "";
  const esActive = state.lang === "es" ? "isActive" : "";
  return `
    <div class="langToggle" role="group" aria-label="Language">
      <button class="${enActive}" data-action="set-lang" data-lang="en" type="button">${escapeHtml(
        t("langEnglish")
      )}</button>
      <button class="${esActive}" data-action="set-lang" data-lang="es" type="button">${escapeHtml(
        t("langSpanish")
      )}</button>
    </div>
  `;
}

function renderNav({ showHome, showBrand = false } = {}) {
  return `
    <header class="navBar">
      <div class="navLeft">
        ${
          showHome
            ? `<button class="homeBtn" type="button" data-action="home" aria-label="Home">${homeIconSvg()}</button>`
            : ""
        }
      </div>
      <div class="navCenter">
        ${
          showBrand
            ? `<img class="bharatSvg" src="./assets/svg/bharat-india.svg?v=${ASSET_VERSION}" alt="भारत / INDIA" />`
            : ""
        }
      </div>
      <div class="navRight">
        ${renderLangToggle()}
      </div>
    </header>
  `;
}

function renderBackgroundMusicToggle() {
  const stateClass = state.bgMusicMuted ? "isMuted" : "isUnmuted";
  const ariaLabel = state.bgMusicMuted ? "Unmute background music" : "Mute background music";
  return `
    <button
      class="globalAudioToggle ${stateClass}"
      id="backgroundMusicToggle"
      type="button"
      data-action="toggle-bg-music"
      aria-label="${ariaLabel}"
      aria-pressed="${String(!state.bgMusicMuted)}"
    >
      ${backgroundMusicIconSvg(state.bgMusicMuted)}
    </button>
  `;
}

function renderAttract() {
  return `
    <section class="screenAttract">
      <video
        class="loaderVideo"
        id="attractVideo"
        src="./assets/video/first-video.mp4?v=${ASSET_VERSION}"
        autoplay
        muted
        ${state.introLoopMode ? "loop" : ""}
        playsinline
      ></video>
      <img
        class="videoTapOverlay"
        id="attractTapOverlay"
        src="./assets/svg/tap-gif.gif?v=${ASSET_VERSION}"
        alt=""
        aria-hidden="true"
      />
    </section>
  `;
}

function renderWelcome() {
  return `
    <section class="screenWelcome screenWelcomeV2">
      <img class="frameBg" src="./assets/svg/frame-1.svg?v=${ASSET_VERSION}" alt="" aria-hidden="true" />
      ${renderNav({ showHome: false })}
      <div class="welcomeMascotV2" aria-hidden="true">
        <img src="./assets/images/mascot.gif?v=${ASSET_VERSION}" alt="" />
      </div>
      <button class="ctaPrimary welcomeCtaV2" type="button" data-action="begin">${escapeHtml(
        t("tapToBegin")
      )}</button>
    </section>
  `;
}

function renderNamaste() {
  return `
    <section class="screenNamaste">
      <video
        class="loaderVideo"
        id="namasteVideo"
        src="./assets/video/namaste-animation.mp4?v=${ASSET_VERSION}"
        autoplay
        muted
        playsinline
      ></video>
    </section>
  `;
}

function renderLoading() {
  return `
    <section class="screenLoading">
      <video class="loaderVideo" id="loaderVideo" src="./assets/video/loader.mp4?v=${ASSET_VERSION}" autoplay muted playsinline></video>
    </section>
  `;
}

function renderExplore() {
  return `
    <section class="screenExplore screenExploreV2">
      <img class="frameBg" src="./assets/svg/frame-2.svg?v=${ASSET_VERSION}" alt="" aria-hidden="true" />
      ${renderNav({ showHome: true, showBrand: false })}
      <div class="exploreContent exploreContentV2" aria-label="${escapeHtml(t("exploreTitle"))}">
        <div class="exploreHeading exploreHeadingV2">${escapeHtml(t("exploreTitle"))}</div>
        <div class="exploreBody exploreBodyV2">${escapeHtml(t("exploreBody"))}</div>
      </div>
      <button class="ctaPrimary exploreCtaV2" type="button" data-action="nav-map">${escapeHtml(
        t("navMap")
      )}</button>
    </section>
  `;
}

function renderKioskLoading() {
  return `
    <section class="screenKioskLoading">
      <video
        class="loaderVideo"
        id="kioskLoaderVideo"
        src="./assets/video/kiosk-loading-animation.mp4?v=${ASSET_VERSION}"
        autoplay
        muted
        playsinline
      ></video>
    </section>
  `;
}

function zoneById(zoneId) {
  return ZONES.find((z) => z.id === zoneId) ?? null;
}

function legendLabel(zoneId) {
  // The tile label is intentionally shortened for this one zone (per the Figma design).
  if (zoneId === "collective_exhibit") {
    return state.lang === "es" ? "Exhibición colectiva.." : "Collective Exhibit..";
  }
  return z("name", zoneId) || zoneId;
}

function renderZoneTile(zoneId) {
  const zone = zoneById(zoneId);
  if (!zone) return "";
  const selected = state.selectedZone === zoneId ? "isSelected" : "";
  const label = legendLabel(zoneId);
  const isStageSelectedLegend = zoneId === "stage" && state.selectedZone === "stage";
  const iconSrc = isStageSelectedLegend
    ? `./assets/icons/stage-version2.svg?v=${ASSET_VERSION}`
    : zone.icon;
  const iconClass = [zoneId === "help" ? "helpIcon" : "", isStageSelectedLegend ? "stageSelectedLegendIcon" : ""]
    .filter(Boolean)
    .join(" ");
  return `
    <button class="zoneTile ${selected}" type="button" data-action="select-zone" data-zone="${escapeHtml(zoneId)}">
      <img class="${escapeHtml(iconClass)}" src="${escapeHtml(iconSrc)}" alt="" />
      <div class="zoneTileLabel">${escapeHtml(label)}</div>
    </button>
  `;
}

function renderPopup(zoneId) {
  const zone = zoneById(zoneId);
  if (!zone) return "";
  const title = z("name", zoneId);
  const body = z("short", zoneId);
  const canKnowMore = zone?.hasDetails;
  const titleColor = zone?.color ?? "var(--brand-red)";

  return `
    <div class="popup" role="dialog" aria-label="${escapeHtml(title)}">
      <button class="popupClose" type="button" data-action="close-zone" aria-label="Close"><span>×</span></button>
      <div class="popupContent">
        <div class="popupHeader">
          <img src="${escapeHtml(zone.icon)}" alt="" />
          <div class="popupTitle" style="color:${escapeHtml(titleColor)}">${escapeHtml(title)}</div>
        </div>
        <div class="popupBody">${escapeHtml(body)}</div>
      </div>
      ${
        canKnowMore
          ? `<button class="ctaSmall popupCta" type="button" data-action="open-details" data-zone="${escapeHtml(
              zoneId
            )}">${escapeHtml(t("knowMore"))}</button>`
          : ""
      }
    </div>
  `;
}

function renderHelpLegendOverlay() {
  const active = state.helpFilter;
  return `
    <div class="helpLegendOverlay">
      <div class="helpCats">
        ${HELP_CATEGORIES.map((c) => {
          const isActive = active === c.id ? "isActive" : "";
          return `
            <button class="helpCat ${isActive}" type="button" data-action="help-category" data-cat="${escapeHtml(
              c.id
            )}">
              <span class="helpSwatch" style="background:${escapeHtml(c.swatch)}"></span>
              <span class="helpCatLabel">${escapeHtml(t(c.labelKey))}</span>
            </button>
          `;
        }).join("")}
      </div>
      <div class="helpLegendHint" aria-hidden="true">
        <div class="helpLegendHintArrow">
          ${arrowDownSvg()}
        </div>
        <div class="helpLegendHintText">${escapeHtml(t("helpHint"))}</div>
      </div>
    </div>
  `;
}

function renderHelpFooter() {
  const zone = zoneById("help");
  if (!zone) return "";

  const title = z("name", "help");
  const body = z("short", "help");
  const titleColor = zone.color ?? "var(--brand-red)";

  return `
    <div class="helpFooter">
      <div class="popup helpPopup" role="dialog" aria-label="${escapeHtml(title)}">
        <button class="popupClose" type="button" data-action="close-zone" aria-label="Close help"><span>×</span></button>
        <div class="popupContent">
          <div class="popupHeader">
            <img src="${escapeHtml(zone.icon)}" alt="" />
            <div class="popupTitle helpPopupTitle" style="color:${escapeHtml(titleColor)}">${escapeHtml(title)}</div>
          </div>
          <div class="popupBody helpPopupBody">${escapeHtml(body)}</div>
        </div>
        <button class="ctaSmall popupCta helpPopupCta" type="button" data-action="close-zone">${escapeHtml(
          t("backToNavigate")
        )}</button>
      </div>
    </div>
  `;
}

function renderHint() {
  return `
    <div class="hint">
      <div class="hintInner">
        <img class="tapIcon" src="./assets/svg/tap-icon.svg?v=${ASSET_VERSION}" alt="" />
        <span>${escapeHtml(t("tapMapToInteract"))}</span>
      </div>
    </div>
  `;
}


function mapLabelText(zoneId) {
  const dict = MAP_LABEL_COPY[state.lang] ?? MAP_LABEL_COPY.en;
  return dict?.[zoneId] ?? z("name", zoneId) ?? zoneId;
}

function shouldUseZoneSvgLabel(zoneId) {
  // Office + Exit Lobby are rotated labels; their centering is very sensitive.
  // We use the exported SVGs for the English (inactive) state to match the Figma layout precisely.
  if (state.lang !== "en") return false;
  if (state.selectedZone === zoneId) return false;
  return zoneId === "office" || zoneId === "exit_lobby";
}

function renderZoneSvgLabels() {
  const office = zoneById("office");
  const exitLobby = zoneById("exit_lobby");
  if (!office || !exitLobby) return "";

  const o = office.hotspots?.[0];
  const e = exitLobby.hotspots?.[0];
  if (!o || !e) return "";

  const overlays = [];
  if (shouldUseZoneSvgLabel("office")) {
    overlays.push({
      src: "./assets/svg/office-zone.svg",
      left: o.x,
      top: o.y,
      width: o.w,
      height: o.h
    });
  }
  if (shouldUseZoneSvgLabel("exit_lobby")) {
    overlays.push({
      src: "./assets/svg/exit-lobby-zone.svg",
      left: e.x,
      top: e.y,
      width: e.w,
      height: e.h
    });
  }

  return overlays
    .map(
      (img) =>
        `<img class="mapZoneSvgOverlay" src="${escapeHtml(img.src)}" alt="" style="left:${Math.round(
          img.left
        )}px; top:${Math.round(img.top)}px; width:${Math.round(img.width)}px; height:${Math.round(
          img.height
        )}px;" />`
    )
    .join("");
}

function renderMapLabelBadge(zoneId, text) {
  const zone = zoneById(zoneId);
  if (!zone) return `<span class="mapLabelText">${escapeHtml(text)}</span>`;
  const badgeIconSrc =
    zoneId === "stage" ? `./assets/icons/stage-version2.svg?v=${ASSET_VERSION}` : zone.icon;

  if (zoneId === "restroom") {
    return `
      <div class="mapBadge mapBadge--iconOnly" aria-hidden="true">
        <img class="mapBadgeIcon" src="${escapeHtml(badgeIconSrc)}" alt="" />
      </div>
    `;
  }

  return `
    <div class="mapBadge" aria-hidden="true">
      <img class="mapBadgeIcon" src="${escapeHtml(badgeIconSrc)}" alt="" />
      <span class="mapBadgeText">${escapeHtml(text)}</span>
    </div>
  `;
}

function renderMapTrilingualBadge(zoneId) {
  const zone = zoneById(zoneId);
  const badgeIconSrc =
    zoneId === "stage" ? `./assets/icons/stage-version2.svg?v=${ASSET_VERSION}` : zone?.icon;
  const tri = MAP_TRILINGUAL_LABEL_COPY[zoneId] ?? null;
  if (!tri) return renderMapLabelBadge(zoneId, z("name", zoneId) || zoneId);

  const renderLines = (lang, lines) =>
    (lines || [])
      .map((l) => `<div class="mapBadgeTriLine mapBadgeTriLine--${lang}">${escapeHtml(l)}</div>`)
      .join("");

  return `
    <div class="mapBadge mapBadge--tri" aria-hidden="true">
      ${zone ? `<img class="mapBadgeIcon" src="${escapeHtml(badgeIconSrc)}" alt="" />` : ""}
      <div class="mapBadgeTriText">
        <div class="mapBadgeTriGroup mapBadgeTriGroup--primary">
          ${renderLines("es", tri.es)}
          ${renderLines("hi", tri.hi)}
        </div>
        <div class="mapBadgeTriGroup mapBadgeTriGroup--en">
          ${renderLines("en", tri.en)}
        </div>
      </div>
    </div>
  `;
}

function getMapLabelBox(zoneId) {
  const zone = zoneById(zoneId);
  if (!zone) return null;

  const layout = MAP_LABEL_LAYOUT.find((l) => l.zoneId === zoneId && l.hotspotIndex === 0);
  if (!layout) return null;

  const hs = zone.hotspots?.[layout.hotspotIndex];
  if (!hs) return null;

  const overrides = MAP_LABEL_LAYOUT_OVERRIDES[state.lang]?.[zoneId];
  const useDx = overrides?.dx ?? layout.dx ?? 0;
  const useDy = overrides?.dy ?? layout.dy ?? 0;
  const useW = overrides?.w ?? layout.w ?? hs.w;
  const useH = overrides?.h ?? layout.h ?? hs.h;
  return {
    left: Math.round(hs.x + useDx),
    top: Math.round(hs.y + useDy),
    width: Math.round(useW),
    height: Math.round(useH)
  };
}

function getMapActiveLabelBox(zoneId) {
  const direct = MAP_ACTIVE_LABEL_BOX?.[zoneId];
  if (direct) {
    return {
      left: Math.round(direct.left),
      top: Math.round(direct.top),
      width: Math.round(direct.width),
      height: Math.round(direct.height)
    };
  }
  return getMapLabelBox(zoneId);
}

function getMapActiveLabelBoxes(zoneId) {
  const direct = MAP_ACTIVE_LABEL_BOX?.[zoneId];
  if (direct) {
    return [
      {
        left: Math.round(direct.left),
        top: Math.round(direct.top),
        width: Math.round(direct.width),
        height: Math.round(direct.height)
      }
    ];
  }

  const zone = zoneById(zoneId);
  if (!zone) return [];

  const layouts = MAP_LABEL_LAYOUT.filter((l) => l.zoneId === zoneId);
  if (layouts.length === 0) return [];

  const overrides = MAP_LABEL_LAYOUT_OVERRIDES[state.lang]?.[zoneId];
  return layouts
    .map(({ hotspotIndex, dx, dy, w, h }) => {
      const hs = zone.hotspots?.[hotspotIndex];
      if (!hs) return null;

      const useDx = overrides?.dx ?? dx ?? 0;
      const useDy = overrides?.dy ?? dy ?? 0;
      const useW = overrides?.w ?? w ?? hs.w;
      const useH = overrides?.h ?? h ?? hs.h;
      return {
        left: Math.round(hs.x + useDx),
        top: Math.round(hs.y + useDy),
        width: Math.round(useW),
        height: Math.round(useH)
      };
    })
    .filter(Boolean);
}

function renderMapLabels() {
  return `
    <div class="mapLabels" aria-hidden="true">
      ${MAP_LABEL_LAYOUT.map(({ zoneId, hotspotIndex, dx, dy, w, h, vertical }) => {
        const zone = zoneById(zoneId);
        const hs = zone?.hotspots?.[hotspotIndex];
        if (!zone || !hs) return "";

        // These two are rendered via exported SVG in English (inactive) state.
        if (shouldUseZoneSvgLabel(zoneId)) return "";

        const overrides = MAP_LABEL_LAYOUT_OVERRIDES[state.lang]?.[zoneId];
        const useDx = overrides?.dx ?? dx ?? 0;
        const useDy = overrides?.dy ?? dy ?? 0;
        const useW = overrides?.w ?? w ?? hs.w;
        const useH = overrides?.h ?? h ?? hs.h;

        let left = Math.round(hs.x + useDx);
        let top = Math.round(hs.y + useDy);
        const width = Math.round(useW);
        const height = Math.round(useH);
        const text = mapLabelText(zoneId);
        const cls = vertical ? "mapLabel isVertical" : "mapLabel";
        const inner = `<span class="mapLabelText">${escapeHtml(text)}</span>`;

        return `<div class="${cls}" data-zone="${escapeHtml(
          zoneId
        )}" style="left:${left}px; top:${top}px; width:${width}px; height:${height}px;"><div class="mapLabelInner">${inner}</div></div>`;
      }).join("")}
    </div>
  `;
}

function renderYouAreHere() {
  // Positioned to the right of the Entry Lobby location marker.
  const marker = { x: 758.59375, y: 678.74267578125, w: 33.618038177490234, h: 58.19620132446289 };
  const x = Math.round(marker.x + marker.w + 28);
  const y = Math.round(marker.y + 10);

  return `<div class="youAreHere" style="left:${x}px; top:${y}px;" aria-hidden="true">${escapeHtml(
    t("youAreHere")
  )}</div>`;
}

function renderHelpDots() {
  const activeCat = state.helpFilter;
  const allowedFill = activeCat ? HELP_CATEGORIES.find((c) => c.id === activeCat)?.swatch : null;
  const filtered = allowedFill ? HELP_SQUARES.filter((s) => s.fill === allowedFill) : HELP_SQUARES;

  return filtered
    .map((s) => {
      const left = s.x - MAP_ORIGIN_X;
      const top = s.y - MAP_ORIGIN_Y;
      if (left < -30 || top < -30 || left > MAP_W + 30 || top > MAP_H + 30) return "";
      return `<div class="helpDot" style="left:${left}px; top:${top}px; background:${escapeHtml(
        s.fill
      )}"></div>`;
    })
    .join("");
}

const FOOTSTEP_SEQUENCE_CACHE = new Map();

function footstepSequenceForZone(zoneId) {
  if (FOOTSTEP_SEQUENCE_CACHE.has(zoneId)) return FOOTSTEP_SEQUENCE_CACHE.get(zoneId);

  const rawPaths = window.FOOTSTEP_PATHS?.[zoneId];
  if (!Array.isArray(rawPaths) || rawPaths.length === 0) {
    FOOTSTEP_SEQUENCE_CACHE.set(zoneId, []);
    return [];
  }

  const PATHS_PER_STEP = 2;
  const MIN_STEP_SIZE = 18;
  const BOUNDS_MARGIN = 100;
  const numRe = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
  const entryCenter = {
    x: MAP_ORIGIN_X + 758.59375 + 33.618038177490234 / 2,
    y: MAP_ORIGIN_Y + 678.74267578125 + 58.19620132446289 / 2
  };

  const dist2 = (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  };

  const stepObjects = [];
  for (let i = 0; i < rawPaths.length; i += PATHS_PER_STEP) {
    const group = rawPaths.slice(i, i + PATHS_PER_STEP);
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let sawAny = false;

    for (const d of group) {
      const m = d.match(numRe);
      if (!m || m.length < 2) continue;
      for (let p = 0; p + 1 < m.length; p += 2) {
        const x = Number(m[p]);
        const y = Number(m[p + 1]);
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
        sawAny = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }

    if (!sawAny) continue;
    const w = maxX - minX;
    const h = maxY - minY;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    if (Math.max(w, h) < MIN_STEP_SIZE) continue;
    if (
      cx < MAP_ORIGIN_X - BOUNDS_MARGIN ||
      cx > MAP_ORIGIN_X + MAP_W + BOUNDS_MARGIN ||
      cy < MAP_ORIGIN_Y - BOUNDS_MARGIN ||
      cy > MAP_ORIGIN_Y + MAP_H + BOUNDS_MARGIN
    ) {
      continue;
    }

    stepObjects.push({ paths: group, center: { x: cx, y: cy } });
  }

  if (stepObjects.length === 0) {
    FOOTSTEP_SEQUENCE_CACHE.set(zoneId, []);
    return [];
  }

  // Build a walking route from the entry marker by stepping to the nearest next footprint.
  const ordered = [];
  const remaining = stepObjects.slice();
  let cursor = entryCenter;
  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i += 1) {
      const d = dist2(cursor, remaining[i].center);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    const [next] = remaining.splice(bestIdx, 1);
    ordered.push(next);
    cursor = next.center;
  }

  // Drop trailing outliers that jump far off the route (non-footstep residue in some source SVGs).
  const jumps = [];
  cursor = entryCenter;
  for (const step of ordered) {
    jumps.push(Math.sqrt(dist2(cursor, step.center)));
    cursor = step.center;
  }
  const sortedJumps = jumps.slice().sort((a, b) => a - b);
  const medianJump = sortedJumps[Math.floor(sortedJumps.length / 2)] ?? 0;
  const maxAllowedJump = Math.max(110, medianJump * 2.8);
  const cleaned = [];
  for (let i = 0; i < ordered.length; i += 1) {
    if (i > 0 && jumps[i] > maxAllowedJump) break;
    cleaned.push(ordered[i]);
  }

  const sequence = (cleaned.length > 0 ? cleaned : ordered).map((step) => step.paths);
  FOOTSTEP_SEQUENCE_CACHE.set(zoneId, sequence);
  return sequence;
}

function renderFootstepPath(zoneId) {
  const zone = zoneById(zoneId);
  // No footsteps for Help or Entry Lobby (per the interaction spec).
  if (!zone || zoneId === "help" || zoneId === "entry_lobby") return "";

  const orderedGroups = footstepSequenceForZone(zoneId);
  if (orderedGroups.length === 0) return "";

  // Batched reveal cadence: 2 steps, then 3 steps, then repeat.
  const BATCH_PATTERN = [2, 3];
  const BATCH_GAP_MS = 170;
  const WITHIN_BATCH_GAP_MS = 55;
  const stepDelayMs = (stepIndex) => {
    let batch = 0;
    let offset = stepIndex;
    while (offset >= BATCH_PATTERN[batch % BATCH_PATTERN.length]) {
      offset -= BATCH_PATTERN[batch % BATCH_PATTERN.length];
      batch += 1;
    }
    return batch * BATCH_GAP_MS + offset * WITHIN_BATCH_GAP_MS;
  };

  const steps = orderedGroups
    .map((group, stepIndex) =>
      group
        .map(
          (d) =>
            `<path class="footstepStep" style="--delay:${stepDelayMs(stepIndex)}ms" d="${escapeHtml(
              d
            )}" fill="${escapeHtml(zone.color)}"></path>`
        )
        .join("")
    )
    .join("");

  return `
    <svg class="footstepOverlay" overflow="visible" viewBox="0 0 ${MAP_W} ${MAP_H}" preserveAspectRatio="none" aria-hidden="true" data-zone="${escapeHtml(
      zoneId
    )}" data-run="${state.footstepRun}">
      <g transform="translate(-${MAP_ORIGIN_X} -${MAP_ORIGIN_Y})">
        ${steps}
      </g>
    </svg>
  `;
}

function renderMapHotspots() {
  // Deprecated: rectangular hotspots can overlap on irregular zones and cause wrong selections.
  // We now use SVG shape hit-regions (see renderMapHitRegions).
  return "";
}


function renderMapHitRegions() {
  // Shape-based hit regions prevent “invisible rectangle” overlap issues.
  const shapes = ZONES.flatMap((zone) => {
    if (zone.id === "help") return [];
    const parts = ZONE_SHAPES[zone.id];
    if (!parts || parts.length === 0) return [];

    return parts.map((s) =>
      s.replace(
        /\s*\/>$/,
        ` class="mapHitShape" data-action="select-zone" data-zone="${escapeHtml(zone.id)}" />`
      )
    );
  }).join("");

  return `
    <svg class="mapHitSvg" viewBox="0 0 ${MAP_W} ${MAP_H}" aria-hidden="true">
      <g transform="translate(-120 0)">
        ${shapes}
      </g>
    </svg>
  `;
}

function renderMapZoneFill(zoneId) {
  const zone = zoneById(zoneId);
  if (!zone || zoneId === "help") return "";
  const shapes = ZONE_SHAPES[zoneId];
  if (!shapes || shapes.length === 0) return "";

  const fill = zone.color;
  return `
    <svg class="mapZoneFill" viewBox="0 0 ${MAP_W} ${MAP_H}" aria-hidden="true">
      <g transform="translate(-120 0)">
        ${shapes.map((s) => s.replace(/\s*\/>$/, ` fill="${escapeHtml(fill)}"/>`)).join("")}
      </g>
    </svg>
  `;
}

const MAP_SELECTED_STATE_FILES = {
  books_store: "Bookstore.svg",
  collective_exhibit: "Collective Exhibit of Books from India.svg",
  entry_lobby: "Entry Lobby.svg",
  exhibition: "Exhibition.svg",
  exit_lobby: "Exit Lobby.svg",
  kids_zone: "Kids Zone.svg",
  office: "Office.svg",
  publishers: "Publishers.svg",
  restaurant: "Restaurant.svg",
  restroom: "Restroom.svg",
  stage: "Stage.svg"
};

function selectedMapStateFile(zoneId) {
  if (!zoneId || zoneId === "help") return null;
  return MAP_SELECTED_STATE_FILES[zoneId] ?? null;
}

function renderSelectedMapState(zoneId) {
  const file = selectedMapStateFile(zoneId);
  if (!file) return "";
  const src = encodeURI(`./Footstep svg and png/${file}?v=${ASSET_VERSION}`);
  return `<img class="mapSelectedStateOverlay" src="${escapeHtml(src)}" alt="" />`;
}

function renderDetailsModal(zoneId) {
  const zone = zoneById(zoneId);
  if (!zone) return "";
  const title = z("name", zoneId);
  const body = z("long", zoneId);
  const titleColor = zone?.color ?? "var(--brand-red)";
  const isExhibition = zoneId === "exhibition";
  const isKidsZone = zoneId === "kids_zone";
  const isPublishers = zoneId === "publishers";
  const isStage = zoneId === "stage";
  const isCollectiveExhibit = zoneId === "collective_exhibit";
  const useTwentyPxBodyLineHeight = [
    "entry_lobby",
    "office",
    "collective_exhibit",
    "books_store",
    "restaurant",
    "exit_lobby"
  ].includes(zoneId);
  const isCoverCarouselModal = isExhibition || isKidsZone;
  const img =
    zone.image
      ? `<img src="${escapeHtml(zone.image)}" alt="" />`
      : `<div style="width:100%;height:100%;"></div>`;

  const coverFiles = isExhibition ? EXHIBITION_COVER_FILES : isKidsZone ? KIDS_ZONE_COVER_FILES : [];
  const coverFolder = isExhibition ? "exhibition-covers" : isKidsZone ? "kids-zone-covers" : "";
  const exhibitionCovers = isCoverCarouselModal
    ? `
        <div class="exhCoversRow" aria-label="${escapeHtml(title)} covers">
          <button class="exhChevron" type="button" data-action="exh-covers-prev" aria-label="Previous covers">
            ${chevronLeftSvg()}
          </button>
          <div class="exhCoversViewport" id="exhCoversViewport">
            <div class="exhCoversStrip">
              ${coverFiles.map((file) => {
                const src = encodeURI(`./assets/images/${coverFolder}/${file}?v=${ASSET_VERSION}`);
                return `<img class="exhCover" src="${escapeHtml(src)}" alt="" loading="lazy" />`;
              }).join("")}
            </div>
          </div>
          <button class="exhChevron" type="button" data-action="exh-covers-next" aria-label="Next covers">
            ${chevronRightSvg()}
          </button>
        </div>
      `
    : "";

  const modalCtaBtn = `<button class="ctaSmall modalCta" type="button" data-action="close-details">${escapeHtml(
    t("backToNavigate")
  )}</button>`;

  const publishersLogosPanel = isPublishers
    ? `
        <div class="publishersLogosPanel" aria-label="Publisher logos">
          <div class="publishersLogosRow publishersLogosRow--top">
            ${[
              { file: "SRFLogo.png", className: "logo--srf" },
              { file: "Brahma Kumaris.png", className: "logo--brahma" },
              { file: "Vivos Education.png", className: "logo--vivos" }
            ]
              .map(({ file, className }) => {
                const src = encodeURI(`./assets/images/publishers-logo/${file}?v=${ASSET_VERSION}`);
                return `<img class="publisherLogo ${className}" src="${escapeHtml(src)}" alt="" loading="lazy" />`;
              })
              .join("")}
          </div>
          <div class="publishersLogosRow publishersLogosRow--bottom">
            ${[
              { file: "NAAMAK PUBLICATIONS, DELHI, INDIA.png", className: "logo--naamak" },
              { file: "National Council for Promotion of Urdu Language.png", className: "logo--ncpul" },
              { file: "Indian Council of Social Science Research.png", className: "logo--icssr" },
              { file: "Institute of Social and Cultural Studies.png", className: "logo--iscs" },
              { file: "Kendriya Nidesalay.png", className: "logo--kendriya" }
            ]
              .map(({ file, className }) => {
                const src = encodeURI(`./assets/images/publishers-logo/${file}?v=${ASSET_VERSION}`);
                return `<img class="publisherLogo ${className}" src="${escapeHtml(src)}" alt="" loading="lazy" />`;
              })
              .join("")}
          </div>
        </div>
      `
    : "";

  const stageIconsPanel = isStage
    ? `
        <div class="stageIconsPanel" aria-label="${escapeHtml(t("stageHighlightsAria"))}">
          ${[
            { file: "Cultural Performances.png", labelKey: "stageIconCultural" },
            { file: "Talks and Launches.png", labelKey: "stageIconTalks" },
            { file: "Movies & Documentaries .png", labelKey: "stageIconMovies" }
          ]
            .map(({ file, labelKey }) => {
              const label = t(labelKey);
              const src = `./assets/images/stage-icons/${encodeURIComponent(file)}?v=${ASSET_VERSION}`;
              return `
                <div class="stageIconItem">
                  <img class="stageIconImage" src="${escapeHtml(src)}" alt="${escapeHtml(label)}" loading="lazy" />
                  <div class="stageIconLabel">${escapeHtml(label)}</div>
                </div>
              `;
            })
            .join("")}
        </div>
      `
    : "";

  // Dedicated modal layouts:
  // Exhibition: body text -> covers row -> CTA
  // Publishers: body text -> logos row -> CTA
  // Stage: body text -> icons row -> CTA
  const modalFooter = isCoverCarouselModal
    ? `${exhibitionCovers}${modalCtaBtn}`
    : isPublishers
      ? `${publishersLogosPanel}${modalCtaBtn}`
      : isStage
        ? `${stageIconsPanel}${modalCtaBtn}`
      : modalCtaBtn;

  const modalClass = isCoverCarouselModal
    ? " modal--exhibition"
    : isPublishers
      ? " modal--publishers"
      : isStage
        ? " modal--stage"
      : isCollectiveExhibit
        ? " modal--collective-exhibit"
        : "";
  const modalBodyLineHeightClass = useTwentyPxBodyLineHeight ? " modal--body-line20" : "";

  return `
    <div class="modalOverlay" role="dialog" aria-label="${escapeHtml(title)}">
      <div class="modal${modalClass}${modalBodyLineHeightClass}">
        <button class="modalClose" type="button" data-action="close-details" aria-label="Close details"><span>×</span></button>
        <div class="modalHeading">
          <img src="${escapeHtml(zone.icon)}" alt="" />
          <div class="modalTitle" style="color:${escapeHtml(titleColor)}">${escapeHtml(title)}</div>
        </div>
        <div class="modalBodyRow">
          <div class="modalImage">${img}</div>
          <div class="modalRight">
            <div class="modalText">${escapeHtml(body)}</div>
            ${modalFooter}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderMap() {
  const selected = state.selectedZone;
  const showHelp = selected === "help";
  const footer =
    showHelp ? renderHelpFooter() : selected ? renderPopup(selected) : renderHint();
  const helpLegendOverlay = showHelp ? renderHelpLegendOverlay() : "";
  const mapPaneClass = "mapPane";

  return `
	    <section class="screenMap${showHelp ? " isHelpMode" : ""}">
	      ${renderNav({ showHome: true, showBrand: true })}
	
	      <div class="mapContent">
	        <div class="${mapPaneClass}">
		          <img class="mapBaseImg" src="./assets/svg/layout-map-v2-base.svg?v=${ASSET_VERSION}" alt="" />
	          ${renderMapZoneFill(selected)}
	          <img class="mapMarkerImg" src="./assets/icons/location-icon.svg?v=${ASSET_VERSION}" alt="" aria-hidden="true" />
	          <div class="mapActiveBadges" id="mapActiveBadge" aria-hidden="true"></div>
	          ${renderMapHitRegions()}
	          ${renderFootstepPath(selected)}
	          ${showHelp ? renderHelpDots() : ""}
	        </div>

        <aside class="legendPane">
          <div class="zoneGrid" aria-label="Zones">
            ${ZONES.map((z) => renderZoneTile(z.id)).join("")}
          </div>

          ${helpLegendOverlay}

          <div class="legendFooter">
            ${footer}
          </div>
        </aside>
      </div>

	      <div class="mascot"><img src="./assets/images/mascot.gif?v=${ASSET_VERSION}" alt="" /></div>

      ${state.detailsZone ? renderDetailsModal(state.detailsZone) : ""}
    </section>
  `;
}

function render() {
  let screenHtml = "";
  if (state.screen === "attract") screenHtml = renderAttract();
  else if (state.screen === "welcome") screenHtml = renderWelcome();
  else if (state.screen === "namaste") screenHtml = renderNamaste();
  else if (state.screen === "loading") screenHtml = renderLoading();
  else if (state.screen === "explore") screenHtml = renderExplore();
  else if (state.screen === "kiosk_loading") screenHtml = renderKioskLoading();
  else if (state.screen === "map") screenHtml = renderMap();
  else screenHtml = renderAttract();

  return `${screenHtml}${renderBackgroundMusicToggle()}`;
}

function rerender() {
  if (!app) return;
  document.documentElement.lang = state.lang;
  try {
    app.innerHTML = render();
    afterRender();
  } catch (err) {
    // If something goes wrong, render a visible error instead of a blank screen.
    // This makes field debugging much easier on kiosk hardware.
    console.error(err);
    const msg = err && err.stack ? err.stack : String(err);
    app.innerHTML = `
      <div style="width:100%;height:100%;background:#111;color:#fff;padding:24px;font:14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;white-space:pre-wrap;">
        UI crashed while rendering. Open DevTools Console for details.

        ${escapeHtml(msg)}
      </div>
    `;
  }
}

function runStartupChecks() {
  if (!app || !appWrap) {
    console.error(
      "Missing required root elements. Expected #app and #appWrap in index.html; UI rendering is disabled."
    );
    return;
  }

  const missingZoneCopy = ZONES.filter((zone) => {
    const enMissing = !ZONE_COPY.en?.[zone.id];
    const esMissing = !ZONE_COPY.es?.[zone.id];
    return enMissing || esMissing;
  }).map((zone) => zone.id);

  if (missingZoneCopy.length > 0) {
    console.warn("Missing zone copy for:", missingZoneCopy.join(", "));
  }

  if (!window.FOOTSTEP_PATHS || typeof window.FOOTSTEP_PATHS !== "object") {
    console.warn("Footstep data missing. Ensure footsteps-data.js is loaded before app.js.");
  }

  ensureBackgroundMusicEl();
  ensureTapSoundEl();
  syncBackgroundMusicPlayback({ animate: false });
  resetInactivityTimer();
}

function fitExploreBodyWidth() {
  const el = document.querySelector(".exploreBody");
  if (!el) return;

  // Clear any previous inline sizing before we measure.
  el.style.width = "";

  if (state.lang !== "es") return;

  const baseW = 1024;
  const maxW = 1680; // Screen width minus 120px left/right margins.
  let w = baseW;

  // The CSS locks the frame height; we widen until content no longer overflows.
  el.style.width = `${w}px`;
  for (let i = 0; i < 40 && el.scrollHeight > el.clientHeight && w < maxW; i += 1) {
    w = Math.min(maxW, w + 32);
    el.style.width = `${w}px`;
  }
}

function updateMapActiveBadge() {
  const badgeHost = document.getElementById("mapActiveBadge");
  if (!badgeHost) return;

  const zoneId = state.selectedZone;
  if (!zoneId || zoneId === "help") {
    badgeHost.style.display = "none";
    badgeHost.innerHTML = "";
    return;
  }

  const labelBoxes = getMapActiveLabelBoxes(zoneId);
  if (labelBoxes.length === 0) {
    badgeHost.style.display = "none";
    badgeHost.innerHTML = "";
    return;
  }

  const badgeContent = renderMapTrilingualBadge(zoneId);
  badgeHost.style.display = "block";
  badgeHost.innerHTML = labelBoxes
    .map(
      (labelBox) => `
        <div
          class="mapActiveBadge"
          data-zone="${escapeHtml(zoneId)}"
          style="left:${labelBox.left}px; top:${labelBox.top}px; width:${labelBox.width}px; height:${labelBox.height}px; --badgeMaxW:${labelBox.width}px;"
        >
          ${badgeContent}
        </div>
      `
    )
    .join("");
}

function afterRender() {
  updateBackgroundMusicToggleUi();

  if (state.screen === "attract") {
    const video = document.getElementById("attractVideo");
    const tapOverlay = document.getElementById("attractTapOverlay");
    if (video) {
      syncVideoTapOverlay(video, tapOverlay);
      video.loop = Boolean(state.introLoopMode);
      video.defaultMuted = true;
      video.muted = true;
      video.volume = 0;
      if (!state.introLoopMode) {
        const goHome = () => {
          if (state.screen !== "attract") return;
          navigateToHomeScreen({ autoEnableMusic: true });
        };
        video.addEventListener("ended", goHome, { once: true });
      }
      video.play().catch(() => {
        // If autoplay is blocked, we still stay on this screen until the user taps.
      });
    }
  }

  if (state.screen === "namaste") {
    const video = document.getElementById("namasteVideo");
    if (video) {
      const goNext = () => {
        state.screen = "explore";
        rerender();
      };
      video.addEventListener("ended", goNext, { once: true });
      window.setTimeout(goNext, 20000);
      video.play().catch(() => {
        window.setTimeout(goNext, 800);
      });
    }
  }

  if (state.screen === "loading") {
    const video = document.getElementById("loaderVideo");
    if (video) {
      // Speed up the loader animation.
      video.playbackRate = 3;
      video.defaultPlaybackRate = 3;

      const goNext = () => {
        state.screen = "explore";
        rerender();
      };
      video.addEventListener("ended", goNext, { once: true });
      // Safety timeout in case the video can't play.
      window.setTimeout(goNext, 7000);
      video.play().catch(() => {
        // If autoplay is blocked for some reason, proceed quickly.
        window.setTimeout(goNext, 1200);
      });
    }
  }

  if (state.screen === "kiosk_loading") {
    const video = document.getElementById("kioskLoaderVideo");
    if (video) {
      // Speed up the kiosk loader animation.
      video.playbackRate = 3;
      video.defaultPlaybackRate = 3;

      const goNext = () => {
        state.screen = "map";
        rerender();
      };
      video.addEventListener("ended", goNext, { once: true });
      window.setTimeout(goNext, 9000);
      video.play().catch(() => {
        window.setTimeout(goNext, 1200);
      });
    }
  }

  if (state.screen === "explore") {
    fitExploreBodyWidth();
  }

  if (state.screen === "map") {
    updateMapActiveBadge();
  }
}

document.addEventListener(
  "pointerdown",
  (e) => {
    // Let the explicit mute/unmute click decide playback to avoid gesture-order races.
    if (isBackgroundMusicToggleTarget(e.target)) {
      recordActivity();
      return;
    }
    registerTrustedInteraction();
    recordActivity();
  },
  { passive: true }
);
document.addEventListener("keydown", () => {
  registerTrustedInteraction();
  recordActivity();
});
document.addEventListener(
  "wheel",
  () => {
    registerTrustedInteraction();
    recordActivity();
  },
  { passive: true }
);
document.addEventListener(
  "touchmove",
  () => {
    registerTrustedInteraction();
    recordActivity();
  },
  { passive: true }
);
window.addEventListener(
  "scroll",
  () => {
    registerTrustedInteraction();
    recordActivity();
  },
  { passive: true }
);

document.addEventListener("click", (e) => {
  const btn = closestElementBySelector(e.target, "[data-action]");
  const action = btn?.dataset.action;

  if (action === "toggle-bg-music") {
    registerTrustedInteraction();
    recordActivity();
    toggleBackgroundMusicMuted();
    return;
  }

  playTapSound();
  registerTrustedInteraction();
  recordActivity();

  // While on first-video, any tap/click transitions to home and enables background music.
  if (state.screen === "attract") {
    navigateToHomeScreen({ autoEnableMusic: true });
    return;
  }

  if (!btn) {
    // In Help mode, tapping anywhere outside the Help tile + help categories exits back to the static map.
    if (state.screen === "map" && state.selectedZone === "help") {
      const keepOpen = closestElementBySelector(
        e.target,
        ".zoneTile.isSelected, .helpFooter, .helpCats, .helpLegendHint"
      );
      if (!keepOpen) {
        state.selectedZone = null;
        state.detailsZone = null;
        state.helpFilter = null;
        rerender();
      }
    }
    return;
  }

  if (action === "set-lang") {
    const lang = btn.dataset.lang;
    if (lang === "en" || lang === "es") {
      state.lang = lang;
      rerender();
    }
    return;
  }

  if (action === "begin") {
    state.screen = "namaste";
    state.selectedZone = null;
    state.detailsZone = null;
    state.helpFilter = null;
    rerender();
    return;
  }

  if (action === "home") {
    navigateToHomeScreen({ autoEnableMusic: true });
    return;
  }

  if (action === "nav-map") {
    state.screen = "kiosk_loading";
    state.selectedZone = null;
    state.detailsZone = null;
    state.helpFilter = null;
    rerender();
    return;
  }

  if (action === "select-zone") {
    const zoneId = btn.dataset.zone;
    const zone = zoneById(zoneId);
    if (!zone) return;

    // While Help mode is open, any tap elsewhere just closes Help (doesn't switch zones).
    if (state.screen === "map" && state.selectedZone === "help" && zoneId !== "help") {
      state.selectedZone = null;
      state.detailsZone = null;
      state.helpFilter = null;
      rerender();
      return;
    }

    // Keep Help toggle behavior. For map zones, tapping the same tile replays footsteps.
    if (zoneId === "help" && state.selectedZone === "help") {
      state.selectedZone = null;
      state.detailsZone = null;
      state.helpFilter = null;
      rerender();
      return;
    }

    state.selectedZone = zoneId;
    if (zoneId !== "help") {
      state.helpFilter = null;
      state.footstepRun += 1;
    }
    state.detailsZone = null;
    rerender();
    return;
  }

  if (action === "close-zone") {
    state.selectedZone = null;
    state.detailsZone = null;
    state.helpFilter = null;
    rerender();
    return;
  }

  if (action === "open-details") {
    const zoneId = btn.dataset.zone;
    const zone = zoneById(zoneId);
    if (!zone || !zone.hasDetails) return;
    state.detailsZone = zoneId;
    rerender();
    return;
  }

  if (action === "close-details") {
    state.detailsZone = null;
    rerender();
    return;
  }

  if (action === "exh-covers-prev" || action === "exh-covers-next") {
    const viewport = document.getElementById("exhCoversViewport");
    if (viewport) {
      const delta = Math.round(viewport.clientWidth * 0.7);
      viewport.scrollBy({
        left: action === "exh-covers-next" ? delta : -delta,
        behavior: "smooth"
      });
    }
    return;
  }

  if (action === "help-category") {
    const cat = btn.dataset.cat;
    state.helpFilter = state.helpFilter === cat ? null : cat;
    rerender();
    return;
  }
});

runStartupChecks();
rerender();
