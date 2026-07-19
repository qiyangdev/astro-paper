import {
  PUBLIC_UMAMI_SCRIPT_URL,
  PUBLIC_UMAMI_WEBSITE_ID,
} from "astro:env/client";

type AnalyticsValue = string | number | boolean;
type AnalyticsData = Record<string, AnalyticsValue>;

type UmamiPageview = {
  hostname?: string;
  language?: string;
  referrer?: string;
  screen?: string;
  title?: string;
  url?: string;
  website?: string;
};

type UmamiTracker = {
  track(): void;
  track(eventName: string, data?: AnalyticsData): void;
  track(transform: (properties: UmamiPageview) => UmamiPageview): void;
};

type QueuedEvent = {
  name: string;
  data?: AnalyticsData;
};

const SEARCH_INPUT_SELECTOR = ".pagefind-ui__search-input";
const SEARCH_RESULT_SELECTOR = ".pagefind-ui__result-link";
const READING_DEPTHS = [50, 90] as const;

let initialized = false;
let lastTrackedPage: string | undefined;
let queuedEvents: QueuedEvent[] = [];
let removeReadingDepthListener: (() => void) | undefined;
let searchUsedOnCurrentPage = false;

function getTracker(): UmamiTracker | undefined {
  return (window as Window & { umami?: UmamiTracker }).umami;
}

function getSiteHostname(): string | undefined {
  const rssFeed = document.querySelector<HTMLLinkElement>(
    'link[rel="alternate"][type="application/rss+xml"]'
  );
  if (!rssFeed) return undefined;

  try {
    return new URL(rssFeed.href).hostname;
  } catch {
    return undefined;
  }
}

function getSanitizedPageUrl(): string {
  const url = new URL(window.location.href);
  url.hash = "";
  url.searchParams.delete("q");

  return `${url.pathname}${url.search}`;
}

function trackPageview(): void {
  const tracker = getTracker();
  if (!tracker) return;

  const url = getSanitizedPageUrl();
  if (url === lastTrackedPage) return;

  tracker.track(properties => ({
    ...properties,
    title: document.title,
    url,
  }));
  lastTrackedPage = url;
}

export function trackEvent(name: string, data?: AnalyticsData): void {
  const tracker = getTracker();
  if (!tracker) {
    queuedEvents.push({ name, data });
    return;
  }

  tracker.track(name, data);
}

function flushQueuedEvents(): void {
  const tracker = getTracker();
  if (!tracker || queuedEvents.length === 0) return;

  for (const event of queuedEvents) {
    tracker.track(event.name, event.data);
  }
  queuedEvents = [];
}

function handleTrackerReady(): void {
  trackPageview();
  flushQueuedEvents();
}

function installTracker(): void {
  if (!PUBLIC_UMAMI_SCRIPT_URL || !PUBLIC_UMAMI_WEBSITE_ID) return;

  const existing = document.querySelector<HTMLScriptElement>(
    `script[data-website-id="${PUBLIC_UMAMI_WEBSITE_ID}"]`
  );
  if (existing) {
    if (getTracker()) handleTrackerReady();
    else existing.addEventListener("load", handleTrackerReady, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.defer = true;
  script.src = PUBLIC_UMAMI_SCRIPT_URL;
  script.dataset.websiteId = PUBLIC_UMAMI_WEBSITE_ID;
  script.dataset.autoTrack = "false";

  const hostname = getSiteHostname();
  if (hostname) script.dataset.domains = hostname;

  script.addEventListener("load", handleTrackerReady, { once: true });
  document.head.appendChild(script);
}

function getAnalyticsData(element: HTMLElement): AnalyticsData {
  const data: AnalyticsData = {};

  for (const [key, value] of Object.entries(element.dataset)) {
    if (!key.startsWith("analytics") || key === "analyticsEvent" || !value) {
      continue;
    }

    const property = key
      .slice("analytics".length)
      .replace(/^[A-Z]/, character => character.toLowerCase());
    if (property) data[property] = value;
  }

  return data;
}

function trackSearchResult(anchor: HTMLAnchorElement): void {
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(SEARCH_RESULT_SELECTOR)
  );
  const position = links.indexOf(anchor) + 1;
  const destination = new URL(anchor.href, window.location.href);

  trackEvent("search_result_click", {
    destination: destination.pathname,
    ...(position > 0 && { position }),
  });
}

function handleClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const resultLink = target.closest<HTMLAnchorElement>(SEARCH_RESULT_SELECTOR);
  if (resultLink) {
    trackSearchResult(resultLink);
    return;
  }

  const trackedElement = target.closest<HTMLElement>("[data-analytics-event]");
  if (trackedElement?.dataset.analyticsEvent) {
    trackEvent(
      trackedElement.dataset.analyticsEvent,
      getAnalyticsData(trackedElement)
    );
    return;
  }

  const anchor = target.closest<HTMLAnchorElement>("a[href]");
  if (!anchor) return;

  const destination = new URL(anchor.href, window.location.href);
  if (
    !["http:", "https:"].includes(destination.protocol) ||
    destination.hostname === window.location.hostname
  ) {
    return;
  }

  trackEvent("outbound_click", {
    destination: destination.hostname,
    page: window.location.pathname,
  });
}

function getSearchLengthBucket(length: number): string {
  if (length <= 3) return "1-3";
  if (length <= 10) return "4-10";
  if (length <= 30) return "11-30";
  return "31+";
}

function handleInput(event: Event): void {
  if (searchUsedOnCurrentPage) return;

  const input = event.target;
  if (
    !(input instanceof HTMLInputElement) ||
    !input.matches(SEARCH_INPUT_SELECTOR)
  ) {
    return;
  }

  const length = input.value.trim().length;
  if (length === 0) return;

  searchUsedOnCurrentPage = true;
  trackEvent("search_used", { length: getSearchLengthBucket(length) });
}

function setupReadingDepth(): void {
  removeReadingDepthListener?.();
  removeReadingDepthListener = undefined;

  const article = document.querySelector<HTMLElement>("#article");
  if (!article) return;

  const reached = new Set<number>();
  const page = window.location.pathname;

  const handleScroll = () => {
    const articleTop = article.getBoundingClientRect().top + window.scrollY;
    const visibleBottom = window.scrollY + window.innerHeight;
    const progress = Math.max(
      0,
      Math.min(100, ((visibleBottom - articleTop) / article.offsetHeight) * 100)
    );

    for (const depth of READING_DEPTHS) {
      if (progress < depth || reached.has(depth)) continue;

      reached.add(depth);
      trackEvent("reading_depth", { depth, page });
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
  removeReadingDepthListener = () =>
    window.removeEventListener("scroll", handleScroll);
}

function handlePageLoad(): void {
  searchUsedOnCurrentPage = false;
  trackPageview();
  setupReadingDepth();
}

export function initializeAnalytics(): void {
  if (initialized || !import.meta.env.PROD) return;
  if (!PUBLIC_UMAMI_SCRIPT_URL || !PUBLIC_UMAMI_WEBSITE_ID) return;

  initialized = true;
  document.addEventListener("astro:page-load", handlePageLoad);
  document.addEventListener("click", handleClick);
  document.addEventListener("input", handleInput);

  setupReadingDepth();
  installTracker();
}
