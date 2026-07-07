import {
  CalendarDays,
  Facebook,
  Heart,
  ImagePlus,
  Instagram,
  Lock,
  LogOut,
  Mic2,
  Music2,
  Pencil,
  Plus,
  Send,
  Ticket,
  Trash2,
  Video,
} from "lucide-react";
import { createClient, type Session } from "@supabase/supabase-js";
import { ChangeEvent, type CSSProperties, FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";

type Release = {
  id: string;
  title: string;
  date: string;
  platform: string;
  link: string;
  cover: string;
  description: string;
  status: "upcoming" | "released";
};

type EventItem = {
  id: string;
  title: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  eventType: "paid" | "free";
  ticketPrice: string;
  ticketCurrency: string;
  ticketLink: string;
  ticketTotal: number;
  ticketsLeft: number;
};

type Post = {
  id: string;
  title: string;
  message: string;
  date: string;
};

type MerchItem = {
  id: string;
  title: string;
  description: string;
  category: "clothing" | "book";
  price: string;
  currency: string;
  stock: number;
  image: string;
};

type Story = {
  headline: string;
  body: string;
  image: string;
};

type SocialPlatform = "tiktok" | "instagram" | "facebook";

type SocialStory = {
  platform: SocialPlatform;
  label: string;
  profileUrl: string;
  storyTitle: string;
  storyText: string;
  storyUrl: string;
  updatedAt: string;
};

type BackgroundTheme =
  | "theme-default"
  | "theme-christmas"
  | "theme-breast-cancer"
  | "theme-love"
  | "theme-human-rights"
  | "theme-freedom"
  | "theme-heritage"
  | "theme-youth-day"
  | "theme-womens-day"
  | "theme-workers-day"
  | "theme-rugby"
  | "theme-gospel";

type SiteData = {
  artistName: string;
  heroLine: string;
  heroImage: string;
  backgroundTheme: BackgroundTheme;
  whatsappNumber: string;
  whatsappTicketMessage: string;
  loveCount: number;
  story: Story;
  releases: Release[];
  events: EventItem[];
  posts: Post[];
  merch: MerchItem[];
  socials: Record<SocialPlatform, SocialStory>;
};

const STORAGE_KEY = "nothing-is-impossible-site";
const LOVE_DEVICE_KEY = "nothing-is-impossible-love-device";
const LOVE_SENT_KEY = "nothing-is-impossible-love-sent-main";
const ADMIN_PATH = "/studio-gift";
const CONTENT_ID = "main";
const STORAGE_BUCKET = "site-images";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const getLoveDeviceId = () => {
  const savedId = localStorage.getItem(LOVE_DEVICE_KEY);
  if (savedId) return savedId;

  const nextId = crypto.randomUUID();
  localStorage.setItem(LOVE_DEVICE_KEY, nextId);
  return nextId;
};

const imageFillStyle = (image?: string): CSSProperties =>
  image ? ({ "--image-src": `url("${image.replace(/"/g, '\\"')}")` } as CSSProperties) : {};

const emptyRelease: Omit<Release, "id"> = {
  title: "",
  date: "",
  platform: "",
  link: "",
  cover: "",
  description: "",
  status: "upcoming",
};

const emptyEvent: Omit<EventItem, "id"> = {
  title: "",
  venue: "",
  city: "",
  date: "",
  time: "",
  eventType: "paid",
  ticketPrice: "",
  ticketCurrency: "R",
  ticketLink: "",
  ticketTotal: 0,
  ticketsLeft: 0,
};

const emptyPost: Omit<Post, "id"> = {
  title: "",
  message: "",
  date: new Date().toISOString().slice(0, 10),
};

const emptyMerch: Omit<MerchItem, "id"> = {
  title: "",
  description: "",
  category: "clothing",
  price: "",
  currency: "R",
  stock: 0,
  image: "",
};

const socialPlatforms: SocialPlatform[] = ["tiktok", "instagram", "facebook"];

const currencies = [
  { label: "South African Rand (R)", value: "R" },
  { label: "US Dollar ($)", value: "$" },
  { label: "Euro (€)", value: "€" },
  { label: "British Pound (£)", value: "£" },
  { label: "Namibian Dollar (N$)", value: "N$" },
  { label: "Botswana Pula (P)", value: "P" },
];

const backgroundThemes: Array<{ label: string; value: BackgroundTheme }> = [
  { label: "Default clean", value: "theme-default" },
  { label: "Christmas / New Year", value: "theme-christmas" },
  { label: "Breast Cancer Awareness", value: "theme-breast-cancer" },
  { label: "Valentine's / Love", value: "theme-love" },
  { label: "Human Rights Day", value: "theme-human-rights" },
  { label: "Freedom Day", value: "theme-freedom" },
  { label: "National Braai / Heritage Day", value: "theme-heritage" },
  { label: "Youth Day", value: "theme-youth-day" },
  { label: "Women's Day", value: "theme-womens-day" },
  { label: "Workers' Day", value: "theme-workers-day" },
  { label: "Rugby World Cup / Match Day", value: "theme-rugby" },
  { label: "Gospel / Worship Night", value: "theme-gospel" },
];

const seedData: SiteData = {
  artistName: "Nothing Is Impossible",
  heroLine: "Singer, survivor, storyteller. Every song carries light from the fight he already won.",
  heroImage: "",
  backgroundTheme: "theme-default",
  whatsappNumber: "",
  whatsappTicketMessage: "Hi, I would like to buy tickets for",
  loveCount: 0,
  story: {
    headline: "A voice that came through the fire",
    body:
      "He faced cancer with faith, music, and the people who refused to let him stand alone. Beating it did not just give him more time, it gave every lyric a deeper reason. This space shares the music, the healing, and the message that nothing is impossible.",
    image: "",
  },
  releases: [
    {
      id: "release-1",
      title: "New Dawn",
      date: "2026-08-02",
      platform: "Spotify, Apple Music",
      link: "",
      cover: "",
      description:
        "A song about waking up with hope again, written from the quiet moments after the hardest parts of the journey.",
      status: "upcoming",
    },
    {
      id: "release-2",
      title: "Still Standing",
      date: "2026-06-14",
      platform: "All platforms",
      link: "",
      cover: "",
      description:
        "An anthem for anyone rebuilding, healing, and choosing to stand tall after life tried to knock them down.",
      status: "released",
    },
  ],
  events: [
    {
      id: "event-1",
      title: "Acoustic Night",
      venue: "The Garden Room",
      city: "Johannesburg",
      date: "2026-08-21",
      time: "19:30",
      eventType: "paid",
      ticketPrice: "180",
      ticketCurrency: "R",
      ticketLink: "",
      ticketTotal: 120,
      ticketsLeft: 34,
    },
    {
      id: "event-2",
      title: "Hope Sessions",
      venue: "City Hall",
      city: "Pretoria",
      date: "2026-10-05",
      time: "18:00",
      eventType: "paid",
      ticketPrice: "250",
      ticketCurrency: "R",
      ticketLink: "",
      ticketTotal: 300,
      ticketsLeft: 188,
    },
  ],
  posts: [
    {
      id: "post-1",
      title: "To everyone still fighting",
      message:
        "You are not your diagnosis, your scar, or your hardest day. Keep breathing. Keep singing. Keep believing.",
      date: "2026-07-04",
    },
  ],
  merch: [],
  socials: {
    tiktok: {
      platform: "tiktok",
      label: "TikTok",
      profileUrl: "",
      storyTitle: "Studio warm-up",
      storyText: "A quick behind-the-scenes vocal run before the next release.",
      storyUrl: "",
      updatedAt: "2026-07-04",
    },
    instagram: {
      platform: "instagram",
      label: "Instagram",
      profileUrl: "",
      storyTitle: "Thank you for the love",
      storyText: "A short message for everyone supporting the journey and the music.",
      storyUrl: "",
      updatedAt: "2026-07-04",
    },
    facebook: {
      platform: "facebook",
      label: "Facebook",
      profileUrl: "",
      storyTitle: "Next show update",
      storyText: "New event details, tickets, and a note for the people coming through.",
      storyUrl: "",
      updatedAt: "2026-07-04",
    },
  },
};

export function App() {
  const [data, setData] = useState<SiteData>(seedData);
  const [route, setRoute] = useState(() => window.location.pathname);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSentLove, setHasSentLove] = useState(() => localStorage.getItem(LOVE_SENT_KEY) === "true");
  const isAdmin = Boolean(session);

  useEffect(() => {
    let isMounted = true;

    const boot = async () => {
      const [loadedData, loadedSession] = await Promise.all([
        loadData(),
        supabase ? supabase.auth.getSession().then(({ data }) => data.session) : Promise.resolve(null),
      ]);

      if (!isMounted) return;
      setData(cleanExpiredEvents(loadedData));
      setSession(loadedSession);
      setIsLoading(false);
    };

    boot();

    const authSubscription = supabase?.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    }).data.subscription;

    return () => {
      isMounted = false;
      authSubscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const cleaned = cleanExpiredEvents(data);
      if (cleaned.events.length !== data.events.length) {
        setData(cleaned);
        void saveData(cleaned);
      }
    }
  }, [data, isLoading]);

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  const updateData = async (next: SiteData) => {
    const cleaned = cleanExpiredEvents(next);
    setData(cleaned);
    await saveData(cleaned);
  };

  const sendLove = async () => {
    if (hasSentLove) return;

    const deviceId = getLoveDeviceId();

    if (supabase) {
      const { data: loveCount, error } = await supabase.rpc("increment_love_count", {
        target_content_id: CONTENT_ID,
        visitor_device_id: deviceId,
      });
      if (!error && typeof loveCount === "number") {
        setData((current) => ({ ...current, loveCount }));
        localStorage.setItem(LOVE_SENT_KEY, "true");
        setHasSentLove(true);
        return;
      }
    }

    const next = { ...data, loveCount: data.loveCount + 1 };
    setData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    localStorage.setItem(LOVE_SENT_KEY, "true");
    setHasSentLove(true);
  };

  if (isLoading) {
    return <main className="loading-screen">Loading...</main>;
  }

  const renderAdmin = () => (
    <AdminPage
      data={data}
      isAdmin={isAdmin}
      onLogin={async (email, password) => {
        if (!supabase) return "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.";

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error?.message ?? null;
      }}
      onLogout={async () => {
        await supabase?.auth.signOut();
        setSession(null);
        navigate("/");
      }}
      onNavigate={navigate}
      onUpdate={updateData}
    />
  );

  if (isAdmin && !route.startsWith(ADMIN_PATH)) {
    if (window.location.pathname !== ADMIN_PATH) {
      window.history.replaceState({}, "", ADMIN_PATH);
    }
    return renderAdmin();
  }

  if (route.startsWith("/admin")) {
    if (window.location.pathname !== "/") {
      window.history.replaceState({}, "", "/");
    }
    return <PublicSite data={data} hasSentLove={hasSentLove} onNavigate={navigate} onLove={sendLove} />;
  }

  if (route.startsWith(ADMIN_PATH)) {
    return renderAdmin();
  }

  return <PublicSite data={data} hasSentLove={hasSentLove} onNavigate={navigate} onLove={sendLove} />;
}

function PublicSite({
  data,
  hasSentLove,
  onNavigate,
  onLove,
}: {
  data: SiteData;
  hasSentLove: boolean;
  onNavigate: (path: string) => void;
  onLove: () => void;
}) {
  const isMidnightHold = useMidnightHold();
  const [creditsOpen, setCreditsOpen] = useState(false);
  const nextEvent = useMemo(
    () => [...data.events].sort((a, b) => a.date.localeCompare(b.date))[0],
    [data.events]
  );
  const featuredRelease = useMemo(
    () =>
      data.releases
        .filter((release) => release.status === "upcoming")
        .sort((a, b) => a.date.localeCompare(b.date))[0],
    [data.releases]
  );
  const releasedSongs = useMemo(
    () =>
      data.releases
        .filter((release) => release.status === "released")
        .sort((a, b) => b.date.localeCompare(a.date)),
    [data.releases]
  );

  useEffect(() => {
    if (!creditsOpen) return;

    let previousScrollY = window.scrollY;
    const closeOnScrollUp = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < previousScrollY - 8) {
        setCreditsOpen(false);
      }
      previousScrollY = currentScrollY;
    };

    window.addEventListener("scroll", closeOnScrollUp, { passive: true });
    return () => window.removeEventListener("scroll", closeOnScrollUp);
  }, [creditsOpen]);

  if (isMidnightHold) {
    return <MidnightHold data={data} onNavigate={onNavigate} />;
  }

  return (
    <main className={`site-shell ${data.backgroundTheme}`}>
      <ThemeStrip theme={data.backgroundTheme} />
      <nav className="topbar glass">
        <button className="brand-button" onClick={() => onNavigate("/")}>
          <span className="brand-mark">Martin</span>
          <span>{data.artistName}</span>
        </button>
        <div className="nav-links">
          <a href="#music">Music</a>
          <a href="#events">Events</a>
          <a href="#shop">Shop</a>
          <a href="#socials">Socials</a>
          <a href="#story">Story</a>
          <button className="studio-button" aria-label="Open admin studio" onClick={() => onNavigate(ADMIN_PATH)}>
            <Lock size={16} />
            <span>Studio</span>
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Official profile</p>
          <h1>{data.artistName}</h1>
          <p>{data.heroLine}</p>
          <div className="hero-actions">
            <button
              className="primary-button"
              disabled={hasSentLove}
              onClick={onLove}
            >
              <Heart size={18} fill="currentColor" />
              {hasSentLove ? "Love sent" : "Love you"}
            </button>
            <a className="secondary-button" href="#story">
              My story
            </a>
          </div>
          <p className="love-note">{formatCompactCount(data.loveCount)} people send love</p>
        </div>
        <div className="hero-visual">
          {data.heroImage ? (
            <img src={data.heroImage} alt={`${data.artistName} portrait`} />
          ) : (
            <div className="photo-placeholder">
              <Mic2 size={56} />
              <span>Add his portrait in admin</span>
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-band">
        <div className="metric">
          <span>Next show</span>
          <strong>{nextEvent ? nextEvent.date : "Coming soon"}</strong>
        </div>
        <div className="metric">
          <span>Releases</span>
          <strong>{data.releases.length}</strong>
        </div>
        <div className="metric">
          <span>Fan love</span>
          <strong>{formatCompactCount(data.loveCount)}</strong>
        </div>
      </section>

      <section id="music" className="section">
        <div className="section-heading">
          <p className="eyebrow">New song releases</p>
          <h2>Listen to what is next</h2>
        </div>
        {featuredRelease ? (
          <FeaturedRelease release={featuredRelease} />
        ) : (
          <EmptyStateCard
            icon={<Music2 size={24} />}
            title="Upcoming song coming soon"
            message="When the next release is added in Studio, its cover, date, and story will appear here."
          />
        )}
        <div className="section-heading compact-heading">
          <p className="eyebrow">Recently released</p>
          <h2>Available to listen</h2>
        </div>
        <div className="release-grid">
          {releasedSongs.length === 0 && (
            <EmptyStateCard
              icon={<Music2 size={24} />}
              title="No released songs yet"
              message="Released tracks and listening links will appear here once they are added."
            />
          )}
          {releasedSongs.map((release) => (
            <article className="release-card" key={release.id}>
              <div className="cover image-fill-frame" style={imageFillStyle(release.cover)}>
                {release.cover ? <img src={release.cover} alt={`${release.title} cover`} /> : <Music2 size={38} />}
              </div>
              <div>
                <p>{formatDate(release.date)}</p>
                <h3>{release.title}</h3>
                <span>{release.platform}</span>
              </div>
              {release.link ? (
                <a className="release-listen-button" href={release.link} target="_blank" rel="noreferrer">
                  Listen now
                </a>
              ) : (
                <span className="release-listen-button disabled">Link soon</span>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="events" className="section split-section">
        <div className="section-heading">
          <p className="eyebrow">Live dates</p>
          <h2>Where he is playing</h2>
        </div>
        <div className="event-list">
          {data.events.length === 0 && (
            <EmptyStateCard
              icon={<CalendarDays size={24} />}
              title="No upcoming events yet"
              message="Show dates, entry type, and ticket details will appear here when a live event is added."
            />
          )}
          {data.events.map((event) => (
            <article className="event-row" key={event.id}>
              <div className="date-pill">
                <span>{month(event.date)}</span>
                <strong>{day(event.date)}</strong>
              </div>
              <div>
                <span className={`event-type-badge ${event.eventType}`}>{event.eventType === "free" ? "Free event" : "Paid event"}</span>
                <h3>{event.title}</h3>
                <p>
                  {event.venue}, {event.city} at {event.time}
                </p>
              </div>
              <div className="ticket">
                {event.eventType === "free" ? (
                  <div className="free-event-card">
                    <span>No tickets required</span>
                    <strong>Free entry</strong>
                  </div>
                ) : (
                  <>
                    <TicketMeter event={event} />
                    <strong>{formatMoney(event.ticketCurrency, event.ticketPrice)}</strong>
                    <TicketActions data={data} event={event} />
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="shop" className="section">
        <div className="section-heading">
          <p className="eyebrow">Shop</p>
          <h2>Books and apparel</h2>
        </div>
        {data.merch.length === 0 ? (
          <EmptyStateCard
            icon={<Ticket size={24} />}
            title="Shop coming soon"
            message="Books, clothing, and meaningful items will appear here when they are ready."
          />
        ) : (
          <div className="merch-grid">
            {data.merch.map((item) => (
              <MerchCard data={data} item={item} key={item.id} />
            ))}
          </div>
        )}
      </section>

      <section id="story" className="story-section">
        <div className="story-image image-fill-frame" style={imageFillStyle(data.story.image)}>
          {data.story.image ? <img src={data.story.image} alt="Story portrait" /> : <CalendarDays size={54} />}
        </div>
        <div>
          <p className="eyebrow">My story</p>
          <h2>{data.story.headline}</h2>
          <p>{data.story.body}</p>
        </div>
      </section>

      <section id="socials" className="section">
        <div className="section-heading">
          <p className="eyebrow">Social stories</p>
          <h2>Follow the latest moments</h2>
        </div>
        <div className="social-grid">
          {socialPlatforms.map((platform) => (
            <SocialCard social={data.socials[platform]} key={platform} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Words for the people</p>
          <h2>Messages to fans</h2>
        </div>
        <div className="post-grid">
          {data.posts.map((post) => (
            <article className="post-card" key={post.id}>
              <span>{formatDate(post.date)}</span>
              <h3>{post.title}</h3>
              <p>{post.message}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer" id="credits">
        <button
          className="credits-link"
          type="button"
          aria-expanded={creditsOpen}
          aria-controls="credits-panel"
          onClick={() => setCreditsOpen((open) => !open)}
        >
          Framework and icon credits
        </button>
        <div className={`credits-panel ${creditsOpen ? "is-open" : ""}`} id="credits-panel">
          <p>
            Built with <a href="https://react.dev/" target="_blank" rel="noreferrer">React</a>,{" "}
            <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer">TypeScript</a>, and{" "}
            <a href="https://vite.dev/" target="_blank" rel="noreferrer">Vite</a>.
          </p>
          <p>
            Icons by <a href="https://lucide.dev/" target="_blank" rel="noreferrer">Lucide</a>.
          </p>
        </div>
      </footer>
    </main>
  );
}

function AdminPage({
  data,
  isAdmin,
  onLogin,
  onLogout,
  onNavigate,
  onUpdate,
}: {
  data: SiteData;
  isAdmin: boolean;
  onLogin: (email: string, password: string) => Promise<string | null>;
  onLogout: () => Promise<void>;
  onNavigate: (path: string) => void;
  onUpdate: (data: SiteData) => void;
}) {
  const [passcode, setPasscode] = useState("");
  const [email, setEmail] = useState("");
  const [release, setRelease] = useState(emptyRelease);
  const [event, setEvent] = useState(emptyEvent);
  const [post, setPost] = useState(emptyPost);
  const [merch, setMerch] = useState(emptyMerch);
  const [editingReleaseId, setEditingReleaseId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingMerchId, setEditingMerchId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const login = async (event: FormEvent) => {
    event.preventDefault();
    const loginError = await onLogin(email.trim(), passcode);
    setError(loginError ?? "");
  };

  if (!isAdmin) {
    return (
      <main className="admin-login">
        <form className="login-panel glass" onSubmit={login}>
          <button type="button" className="brand-button" onClick={() => onNavigate("/")}>
            <span className="brand-mark">Martin</span>
            <span>{data.artistName}</span>
          </button>
          <div className="login-copy">
            <h1 className="align-center">Private studio</h1>
            <p>Only admin can update releases, shows, messages, and story details.</p>
          </div>
          <div className="login-fields">
            <label>
              Email
              <input
                required
                autoComplete="email"
                inputMode="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Password
              <input
                required
                autoComplete="current-password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                type="password"
              />
            </label>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="primary-button" type="submit">
            <Lock size={18} />
            Log in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar glass">
        <div className="brand-button admin-locked-brand">
          <span className="brand-mark">Martin</span>
          <span>Studio locked</span>
        </div>
        <div>
          <h1>Studio</h1>
          <p>Update what fans see. Sign out before returning to the public site.</p>
        </div>
        <button className="secondary-button" onClick={() => void onLogout()}>
          <LogOut size={17} />
          Sign out
        </button>
      </aside>

      <section className="admin-content">
        <Panel title="Profile">
          <div className="form-grid">
            <label>
              Artist name
              <input value={data.artistName} onChange={(e) => onUpdate({ ...data, artistName: e.target.value })} />
            </label>
            <label>
              Hero line
              <input value={data.heroLine} onChange={(e) => onUpdate({ ...data, heroLine: e.target.value })} />
            </label>
            <label>
              Client background theme
              <select
                value={data.backgroundTheme}
                onChange={(e) => onUpdate({ ...data, backgroundTheme: e.target.value as BackgroundTheme })}
              >
                {backgroundThemes.map((theme) => (
                  <option value={theme.value} key={theme.value}>
                    {theme.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              WhatsApp Business number
              <input
                placeholder="Example: 27821234567"
                value={data.whatsappNumber}
                onChange={(e) => onUpdate({ ...data, whatsappNumber: e.target.value })}
              />
            </label>
            <label>
              Ticket WhatsApp message
              <input
                value={data.whatsappTicketMessage}
                onChange={(e) => onUpdate({ ...data, whatsappTicketMessage: e.target.value })}
              />
            </label>
          </div>
          <ImagePicker
            label="Hero photo"
            value={data.heroImage}
            onChange={(heroImage) => onUpdate({ ...data, heroImage })}
          />
        </Panel>

        <Panel title="My story">
          <label>
            Headline
            <input
              value={data.story.headline}
              onChange={(e) => onUpdate({ ...data, story: { ...data.story, headline: e.target.value } })}
            />
          </label>
          <label>
            Story
            <textarea
              value={data.story.body}
              onChange={(e) => onUpdate({ ...data, story: { ...data.story, body: e.target.value } })}
            />
          </label>
          <ImagePicker
            label="Story photo"
            value={data.story.image}
            onChange={(image) => onUpdate({ ...data, story: { ...data.story, image } })}
          />
        </Panel>

        <Panel title="Social stories">
          <div className="social-admin-grid">
            {socialPlatforms.map((platform) => (
              <SocialAdminCard
                key={platform}
                social={data.socials[platform]}
                onChange={(social) =>
                  onUpdate({
                    ...data,
                    socials: {
                      ...data.socials,
                      [platform]: social,
                    },
                  })
                }
              />
            ))}
          </div>
        </Panel>

        <Panel title={editingReleaseId ? "Edit song release" : "Add song release"}>
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              const nextReleases = editingReleaseId
                ? data.releases.map((item) => (item.id === editingReleaseId ? { ...release, id: editingReleaseId } : item))
                : [{ ...release, id: crypto.randomUUID() }, ...data.releases];
              onUpdate({ ...data, releases: nextReleases });
              setRelease(emptyRelease);
              setEditingReleaseId(null);
            }}
          >
            <div className="form-grid">
              <label>
                Song title
                <input required value={release.title} onChange={(e) => setRelease({ ...release, title: e.target.value })} />
              </label>
              <label>
                Release date
                <input required type="date" value={release.date} onChange={(e) => setRelease({ ...release, date: e.target.value })} />
              </label>
              <label>
                Release status
                <select
                  value={release.status}
                  onChange={(e) => setRelease({ ...release, status: e.target.value as Release["status"] })}
                >
                  <option value="upcoming">Upcoming song</option>
                  <option value="released">Released song</option>
                </select>
              </label>
              <label>
                Platform
                <input value={release.platform} onChange={(e) => setRelease({ ...release, platform: e.target.value })} />
              </label>
              <label>
                Listen link
                <input value={release.link} onChange={(e) => setRelease({ ...release, link: e.target.value })} />
              </label>
            </div>
            <label>
              Inspiration and journey
              <textarea
                value={release.description}
                onChange={(e) => setRelease({ ...release, description: e.target.value })}
              />
            </label>
            <ImagePicker label="Cover image" value={release.cover} onChange={(cover) => setRelease({ ...release, cover })} />
            <button className="primary-button" type="submit">
              {editingReleaseId ? <Pencil size={18} /> : <Plus size={18} />}
              {editingReleaseId ? "Save release" : "Add release"}
            </button>
            {editingReleaseId && (
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  setEditingReleaseId(null);
                  setRelease(emptyRelease);
                }}
              >
                Cancel edit
              </button>
            )}
          </form>
          <EditableList
            items={data.releases}
            onEdit={(item) => {
              setEditingReleaseId(item.id);
              setRelease({
                title: item.title,
                date: item.date,
                platform: item.platform,
                link: item.link,
                cover: item.cover,
                description: item.description,
                status: item.status,
              });
            }}
            onDelete={(id) => onUpdate({ ...data, releases: data.releases.filter((item) => item.id !== id) })}
          />
        </Panel>

        <Panel title={editingEventId ? "Edit event" : "Add event"}>
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              const isPaidEvent = event.eventType === "paid";
              const normalizedEvent = {
                ...event,
                ticketPrice: isPaidEvent ? event.ticketPrice : "",
                ticketLink: isPaidEvent ? event.ticketLink : "",
                ticketTotal: isPaidEvent ? Number(event.ticketTotal) || 0 : 0,
                ticketsLeft: isPaidEvent ? Math.min(Number(event.ticketsLeft) || 0, Number(event.ticketTotal) || 0) : 0,
              };
              const nextEvents = editingEventId
                ? data.events.map((item) => (item.id === editingEventId ? { ...normalizedEvent, id: editingEventId } : item))
                : [...data.events, { ...normalizedEvent, id: crypto.randomUUID() }];
              onUpdate({ ...data, events: nextEvents });
              setEvent(emptyEvent);
              setEditingEventId(null);
            }}
          >
            <div className="form-grid">
              <label>
                Event name
                <input required value={event.title} onChange={(e) => setEvent({ ...event, title: e.target.value })} />
              </label>
              <label>
                Date
                <input required type="date" value={event.date} onChange={(e) => setEvent({ ...event, date: e.target.value })} />
              </label>
              <label>
                Time
                <input type="time" value={event.time} onChange={(e) => setEvent({ ...event, time: e.target.value })} />
              </label>
              <label>
                Venue
                <input value={event.venue} onChange={(e) => setEvent({ ...event, venue: e.target.value })} />
              </label>
              <label>
                City
                <input value={event.city} onChange={(e) => setEvent({ ...event, city: e.target.value })} />
              </label>
              <label>
                Event type
                <select
                  value={event.eventType}
                  onChange={(e) =>
                    setEvent({
                      ...event,
                      eventType: e.target.value as EventItem["eventType"],
                      ...(e.target.value === "free"
                        ? { ticketPrice: "", ticketLink: "", ticketTotal: 0, ticketsLeft: 0 }
                        : {}),
                    })
                  }
                >
                  <option value="paid">Paid event</option>
                  <option value="free">Free event</option>
                </select>
              </label>
              {event.eventType === "paid" && (
                <>
                  <label>
                    Ticket price
                    <input value={event.ticketPrice} onChange={(e) => setEvent({ ...event, ticketPrice: e.target.value })} />
                  </label>
                  <label>
                    Ticket currency
                    <select value={event.ticketCurrency} onChange={(e) => setEvent({ ...event, ticketCurrency: e.target.value })}>
                      {currencies.map((currency) => (
                        <option value={currency.value} key={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Ticket link
                    <input value={event.ticketLink} onChange={(e) => setEvent({ ...event, ticketLink: e.target.value })} />
                  </label>
                  <label>
                    Total tickets
                    <input
                      min="0"
                      type="number"
                      value={event.ticketTotal}
                      onChange={(e) => setEvent({ ...event, ticketTotal: Number(e.target.value) })}
                    />
                  </label>
                  <label>
                    Tickets left
                    <input
                      min="0"
                      type="number"
                      value={event.ticketsLeft}
                      onChange={(e) => setEvent({ ...event, ticketsLeft: Number(e.target.value) })}
                    />
                  </label>
                </>
              )}
            </div>
            <button className="primary-button" type="submit">
              {editingEventId ? <Pencil size={18} /> : <Plus size={18} />}
              {editingEventId ? "Save event" : "Add event"}
            </button>
            {editingEventId && (
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  setEditingEventId(null);
                  setEvent(emptyEvent);
                }}
              >
                Cancel edit
              </button>
            )}
          </form>
          <EditableList
            items={data.events}
            onEdit={(item) => {
              setEditingEventId(item.id);
              setEvent({
                title: item.title,
                venue: item.venue,
                city: item.city,
                date: item.date,
                time: item.time,
                eventType: item.eventType ?? "paid",
                ticketPrice: item.ticketPrice,
                ticketCurrency: item.ticketCurrency,
                ticketLink: item.ticketLink,
                ticketTotal: item.ticketTotal,
                ticketsLeft: item.ticketsLeft,
              });
            }}
            onDelete={(id) => onUpdate({ ...data, events: data.events.filter((item) => item.id !== id) })}
          />
        </Panel>

        <Panel title={editingMerchId ? "Edit shop item" : "Add shop item"}>
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              const normalizedMerch = {
                ...merch,
                stock: Number(merch.stock) || 0,
              };
              const nextMerch = editingMerchId
                ? data.merch.map((item) => (item.id === editingMerchId ? { ...normalizedMerch, id: editingMerchId } : item))
                : [{ ...normalizedMerch, id: crypto.randomUUID() }, ...data.merch];
              onUpdate({ ...data, merch: nextMerch });
              setMerch(emptyMerch);
              setEditingMerchId(null);
            }}
          >
            <div className="form-grid">
              <label>
                Item name
                <input required value={merch.title} onChange={(e) => setMerch({ ...merch, title: e.target.value })} />
              </label>
              <label>
                Item type
                <select
                  value={merch.category}
                  onChange={(e) => setMerch({ ...merch, category: e.target.value as MerchItem["category"] })}
                >
                  <option value="clothing">Clothing / Apparel</option>
                  <option value="book">Book</option>
                </select>
              </label>
              <label>
                Price
                <input required value={merch.price} onChange={(e) => setMerch({ ...merch, price: e.target.value })} />
              </label>
              <label>
                Currency
                <select value={merch.currency} onChange={(e) => setMerch({ ...merch, currency: e.target.value })}>
                  {currencies.map((currency) => (
                    <option value={currency.value} key={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Total amount / stock
                <input
                  min="0"
                  type="number"
                  value={merch.stock}
                  onChange={(e) => setMerch({ ...merch, stock: Number(e.target.value) })}
                />
              </label>
            </div>
            <label>
              Details
              <textarea value={merch.description} onChange={(e) => setMerch({ ...merch, description: e.target.value })} />
            </label>
            <ImagePicker label="Shop item image" value={merch.image} onChange={(image) => setMerch({ ...merch, image })} />
            <button className="primary-button" type="submit">
              {editingMerchId ? <Pencil size={18} /> : <Plus size={18} />}
              {editingMerchId ? "Save item" : "Add item"}
            </button>
            {editingMerchId && (
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  setEditingMerchId(null);
                  setMerch(emptyMerch);
                }}
              >
                Cancel edit
              </button>
            )}
          </form>
          <EditableList
            items={data.merch}
            onEdit={(item) => {
              setEditingMerchId(item.id);
              setMerch({
                title: item.title,
                description: item.description,
                category: item.category,
                price: item.price,
                currency: item.currency,
                stock: item.stock,
                image: item.image,
              });
            }}
            onDelete={(id) => onUpdate({ ...data, merch: data.merch.filter((item) => item.id !== id) })}
          />
        </Panel>

        <Panel title={editingPostId ? "Edit fan message" : "Fan message"}>
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              const nextPosts = editingPostId
                ? data.posts.map((item) => (item.id === editingPostId ? { ...post, id: editingPostId } : item))
                : [{ ...post, id: crypto.randomUUID() }, ...data.posts];
              onUpdate({ ...data, posts: nextPosts });
              setPost(emptyPost);
              setEditingPostId(null);
            }}
          >
            <div className="form-grid">
              <label>
                Title
                <input required value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
              </label>
              <label>
                Date
                <input type="date" value={post.date} onChange={(e) => setPost({ ...post, date: e.target.value })} />
              </label>
            </div>
            <label>
              Message
              <textarea required value={post.message} onChange={(e) => setPost({ ...post, message: e.target.value })} />
            </label>
            <button className="primary-button" type="submit">
              {editingPostId ? <Pencil size={18} /> : <Send size={18} />}
              {editingPostId ? "Save message" : "Publish"}
            </button>
            {editingPostId && (
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  setEditingPostId(null);
                  setPost(emptyPost);
                }}
              >
                Cancel edit
              </button>
            )}
          </form>
          <EditableList
            items={data.posts}
            onEdit={(item) => {
              setEditingPostId(item.id);
              setPost({
                title: item.title,
                message: item.message,
                date: item.date,
              });
            }}
            onDelete={(id) => onUpdate({ ...data, posts: data.posts.filter((item) => item.id !== id) })}
          />
        </Panel>
      </section>

      <ScriptureCarousel />
    </main>
  );
}

function useMidnightHold() {
  const [isMidnight, setIsMidnight] = useState(() => isPublicRestWindow());

  useEffect(() => {
    const update = () => setIsMidnight(isPublicRestWindow());
    const timer = window.setInterval(update, 30000);
    update();
    return () => window.clearInterval(timer);
  }, []);

  return isMidnight;
}

function isPublicRestWindow() {
  const hour = new Date().getHours();
  return hour >= 0 && hour < 5;
}

function MidnightHold({ data, onNavigate }: { data: SiteData; onNavigate: (path: string) => void }) {
  return (
    <main className={`midnight-hold ${data.backgroundTheme}`}>
      <button className="brand-button midnight-brand" onClick={() => onNavigate(ADMIN_PATH)}>
        <span className="brand-mark">Martin</span>
        <span>{data.artistName}</span>
      </button>
      <section className="midnight-panel glass">
        <div className="sleepy-orb" aria-hidden="true">
          <span className="sleepy-eye left" />
          <span className="sleepy-eye right" />
          <span className="sleepy-mouth" />
          <span className="sleepy-z z-one">z</span>
          <span className="sleepy-z z-two">z</span>
          <span className="sleepy-z z-three">z</span>
        </div>
        <p className="eyebrow">Rest mode</p>
        <h1>We are taking a midnight pause</h1>
        <p>
          The site is resting for a little while. Please check back after 5:00 AM for music, events, shop items, and updates.
        </p>
      </section>
    </main>
  );
}

const scriptures = [
  {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ which strengtheneth me.",
  },
  {
    reference: "Isaiah 41:10",
    text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God.",
  },
  {
    reference: "Psalm 46:1",
    text: "God is our refuge and strength, a very present help in trouble.",
  },
  {
    reference: "Jeremiah 29:11",
    text: "For I know the thoughts that I think toward you, saith the Lord.",
  },
  {
    reference: "Romans 8:28",
    text: "All things work together for good to them that love God.",
  },
  {
    reference: "Psalm 23:1",
    text: "The Lord is my shepherd; I shall not want.",
  },
  {
    reference: "2 Timothy 1:7",
    text: "God hath not given us the spirit of fear; but of power, and of love.",
  },
  {
    reference: "Matthew 19:26",
    text: "With God all things are possible.",
  },
];

function ScriptureCarousel() {
  const loop = [...scriptures, ...scriptures];

  return (
    <aside className="scripture-rail" aria-label="Bible scripture encouragement">
      <div className="scripture-rail-header">
        <span>Daily strength</span>
        <strong>Scripture</strong>
      </div>
      <div className="scripture-carousel">
        <div className="scripture-track">
          {loop.map((scripture, index) => (
            <article className="scripture-card" key={`${scripture.reference}-${index}`}>
              <p>{scripture.text}</p>
              <span>{scripture.reference}</span>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="admin-panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function EditableList<T extends { id: string; title: string }>({
  items,
  onEdit,
  onDelete,
}: {
  items: T[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="editable-list">
      {items.map((item) => (
        <div className="editable-item" key={item.id}>
          <span>{item.title}</span>
          <div className="editable-actions">
            <button className="icon-button" aria-label={`Edit ${item.title}`} onClick={() => onEdit(item)}>
              <Pencil size={17} />
            </button>
            <button className="icon-button" aria-label={`Delete ${item.title}`} onClick={() => onDelete(item.id)}>
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TicketMeter({ event }: { event: EventItem }) {
  const total = Math.max(event.ticketTotal || 0, event.ticketsLeft || 0);
  const left = Math.max(0, event.ticketsLeft || 0);
  const soldPercent = total > 0 ? Math.min(100, Math.round(((total - left) / total) * 100)) : 0;
  const isSoldOut = total > 0 && left === 0;

  return (
    <div className={`ticket-meter ${isSoldOut ? "sold-out" : ""}`} aria-label={`${left} tickets left for ${event.title}`}>
      {isSoldOut && <span className="sold-out-ribbon">Sold out</span>}
      <div className="ticket-stack" aria-hidden="true">
        <Ticket size={27} />
        <Ticket size={27} />
        <Ticket size={27} />
      </div>
      <div className="ticket-copy">
        <span>{total > 0 ? `${left.toLocaleString()} tickets left` : "Tickets soon"}</span>
        {total > 0 && (
          <div className="ticket-track">
            <i style={{ width: `${soldPercent}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyStateCard({ icon, title, message }: { icon: ReactNode; title: string; message: string }) {
  return (
    <div className="empty-state-card">
      <span>{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
    </div>
  );
}

function MerchCard({ data, item }: { data: SiteData; item: MerchItem }) {
  const [quantity, setQuantity] = useState(1);
  const isSoldOut = item.stock <= 0;
  const orderLink = buildWhatsAppMerchLink(data, item, quantity);
  const isBook = item.category === "book";

  return (
    <article className={`merch-card ${item.category} ${isSoldOut ? "sold-out-card" : ""}`}>
      <div className="merch-image image-fill-frame" style={imageFillStyle(item.image)}>
        {item.image ? <img src={item.image} alt={item.title} /> : <span>{isBook ? "Book" : "Martin"}</span>}
      </div>
      <div className="merch-copy">
        <div>
          <small>{isBook ? "Book" : "Clothing"}</small>
          <span>{item.stock > 0 ? `${item.stock} available` : "Sold out"}</span>
          <h3>{item.title}</h3>
          <p>{item.description || (isBook ? "Book details coming soon." : "Clothing details coming soon.")}</p>
        </div>
        <strong>{formatMoney(item.currency, item.price)}</strong>
        <label className="quantity-control">
          Quantity
            <input
              min="1"
            max={Math.max(1, item.stock)}
            type="number"
            value={quantity}
            disabled={isSoldOut}
            onChange={(e) => setQuantity(Math.min(Math.max(1, Number(e.target.value) || 1), Math.max(1, item.stock)))}
          />
        </label>
        {orderLink && !isSoldOut ? (
          <a className="buy-ticket-button" href={orderLink} target="_blank" rel="noreferrer">
            {isBook ? "Order book" : "Order item"}
          </a>
        ) : (
          <span className="buy-ticket-button disabled">{isSoldOut ? "Sold out" : "WhatsApp number needed"}</span>
        )}
      </div>
    </article>
  );
}

function FeaturedRelease({ release }: { release: Release }) {
  return (
    <article className="featured-release">
      <div className="featured-release-thumb image-fill-frame" style={imageFillStyle(release.cover)}>
        {release.cover ? <img src={release.cover} alt={`${release.title} thumbnail`} /> : <Music2 size={58} />}
      </div>
      <div className="featured-release-copy">
        <p className="eyebrow">Upcoming work</p>
        <h3>{release.title}</h3>
        <span className="release-date-badge">Release date: {formatDate(release.date)}</span>
        <p>
          {release.description ||
            "A closer look at the inspiration, healing, and journey behind the next song will appear here."}
        </p>
        <p>
          {release.platform || "Streaming details coming soon"} · {formatDate(release.date)}
        </p>
        {release.link ? (
          <a className="primary-button" href={release.link} target="_blank" rel="noreferrer">
            Listen now
          </a>
        ) : (
          <span className="secondary-button disabled">Listen link coming soon</span>
        )}
      </div>
    </article>
  );
}

function TicketActions({ data, event }: { data: SiteData; event: EventItem }) {
  const whatsappLink = buildWhatsAppTicketLink(data, event);
  const isSoldOut = event.ticketTotal > 0 && event.ticketsLeft <= 0;

  return (
    <div className="ticket-actions">
      {event.ticketLink && !isSoldOut && (
        <a href={event.ticketLink} target="_blank" rel="noreferrer">
          Tickets
        </a>
      )}
      {isSoldOut ? (
        <span className="buy-ticket-button disabled">Sold out</span>
      ) : whatsappLink ? (
        <a className="buy-ticket-button" href={whatsappLink} target="_blank" rel="noreferrer">
          Buy ticket
        </a>
      ) : (
        <span className="buy-ticket-button disabled">Buy ticket</span>
      )}
    </div>
  );
}

function SocialCard({ social }: { social: SocialStory }) {
  const Icon = social.platform === "instagram" ? Instagram : social.platform === "facebook" ? Facebook : Video;
  const href = social.storyUrl || social.profileUrl;

  return (
    <article className={`social-card ${social.platform}`}>
      <div className="social-card-top">
        <span className="social-icon">
          <Icon size={22} />
        </span>
        <div>
          <p>{social.label}</p>
          <span>{formatDate(social.updatedAt)}</span>
        </div>
      </div>
      <div className="social-story-card">
        <h3>{social.storyTitle || "Latest story coming soon"}</h3>
        <p>{social.storyText || "No story has been added yet."}</p>
      </div>
      {href ? (
        <a className="social-link" href={href} target="_blank" rel="noreferrer">
          Open latest story
        </a>
      ) : (
        <span className="social-link disabled">Link coming soon</span>
      )}
    </article>
  );
}

function ThemeStrip({ theme }: { theme: BackgroundTheme }) {
  if (theme === "theme-default") return null;

  const label = backgroundThemes.find((item) => item.value === theme)?.label ?? "Nothing Is Impossible";
  const messageByTheme: Record<BackgroundTheme, string> = {
    "theme-default": "Nothing Is Impossible",
    "theme-christmas": "Merry Christmas",
    "theme-breast-cancer": "Breast Cancer Awareness",
    "theme-love": "Love and light",
    "theme-human-rights": "Happy Human Rights Day",
    "theme-freedom": "Happy Freedom Day",
    "theme-heritage": "Happy National Braai Day",
    "theme-youth-day": "Happy Youth Day",
    "theme-womens-day": "Happy Women's Day",
    "theme-workers-day": "Happy Workers' Day",
    "theme-rugby": "Go Bokke",
    "theme-gospel": "Worship Night",
  };
  const message = messageByTheme[theme] || label;
  const repeated = Array.from({ length: 9 }, () => `${message} •`);

  return (
    <aside className="theme-strip" aria-label={`Current theme: ${label}`}>
      <div className="theme-strip-track">
        {[0, 1].map((group) => (
          <div className="theme-strip-group" aria-hidden={group === 1} key={group}>
            {repeated.map((item, index) => (
              <span key={`${group}-${item}-${index}`}>{item}</span>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}

function SocialAdminCard({
  social,
  onChange,
}: {
  social: SocialStory;
  onChange: (social: SocialStory) => void;
}) {
  const update = (changes: Partial<SocialStory>) => onChange({ ...social, ...changes });

  return (
    <div className="social-admin-card">
      <h3>{social.label}</h3>
      <label>
        Profile link
        <input value={social.profileUrl} onChange={(e) => update({ profileUrl: e.target.value })} />
      </label>
      <label>
        Latest story title
        <input value={social.storyTitle} onChange={(e) => update({ storyTitle: e.target.value })} />
      </label>
      <label>
        Latest story message
        <textarea value={social.storyText} onChange={(e) => update({ storyText: e.target.value })} />
      </label>
      <label>
        Story link
        <input value={social.storyUrl} onChange={(e) => update({ storyUrl: e.target.value })} />
      </label>
      <label>
        Updated date
        <input type="date" value={social.updatedAt} onChange={(e) => update({ updatedAt: e.target.value })} />
      </label>
    </div>
  );
}

function ImagePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const pickImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl) {
      onChange(uploadedUrl);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-picker">
      <label className="file-button">
        <ImagePlus size={18} />
        {label}
        <input type="file" accept="image/*" onChange={pickImage} />
      </label>
      {value && (
        <button className="ghost-button" type="button" onClick={() => onChange("")}>
          Remove image
        </button>
      )}
    </div>
  );
}

async function uploadImage(file: File) {
  if (!supabase) return "";

  const extension = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) return "";

  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

async function loadData(): Promise<SiteData> {
  if (supabase) {
    const { data, error } = await supabase.from("site_content").select("content").eq("id", CONTENT_ID).maybeSingle();
    if (!error && data?.content) {
      return normalizeData(data.content as Partial<SiteData>);
    }
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedData;

  try {
    return normalizeData(JSON.parse(raw) as Partial<SiteData>);
  } catch {
    return seedData;
  }
}

async function saveData(data: SiteData) {
  if (supabase) {
    await supabase.from("site_content").upsert({
      id: CONTENT_ID,
      content: data,
      updated_at: new Date().toISOString(),
    });
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function normalizeData(input: Partial<SiteData>): SiteData {
  const parsed = { ...seedData, ...input } as SiteData;
  return {
    ...parsed,
    backgroundTheme: parsed.backgroundTheme ?? seedData.backgroundTheme,
    whatsappNumber: parsed.whatsappNumber ?? seedData.whatsappNumber,
    whatsappTicketMessage: parsed.whatsappTicketMessage ?? seedData.whatsappTicketMessage,
    merch: (parsed.merch ?? seedData.merch).map((item) => ({
      ...item,
      category: item.category ?? "clothing",
      currency: item.currency ?? "R",
    })),
    socials: {
      ...seedData.socials,
      ...(parsed.socials ?? {}),
    },
    releases: (parsed.releases ?? seedData.releases).map((release) => ({
      ...release,
      description: release.description ?? seedData.releases.find((seedRelease) => seedRelease.id === release.id)?.description ?? "",
      status:
        release.status ??
        seedData.releases.find((seedRelease) => seedRelease.id === release.id)?.status ??
        (new Date(`${release.date}T00:00:00`) > new Date() ? "upcoming" : "released"),
    })),
    events: (parsed.events ?? seedData.events).map((event) => ({
      ...event,
      eventType: event.eventType ?? "paid",
      ticketCurrency: event.ticketCurrency ?? "R",
      ticketTotal: event.ticketTotal ?? seedData.events.find((seedEvent) => seedEvent.id === event.id)?.ticketTotal ?? 0,
      ticketsLeft: event.ticketsLeft ?? seedData.events.find((seedEvent) => seedEvent.id === event.id)?.ticketsLeft ?? 0,
    })),
  };
}

function cleanExpiredEvents(data: SiteData): SiteData {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    ...data,
    events: data.events.filter((event) => {
      const eventDate = new Date(`${event.date}T23:59:59`);
      return eventDate >= today;
    }),
  };
}

function formatDate(date: string) {
  if (!date) return "Date coming soon";
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date(date));
}

function month(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(date));
}

function day(date: string) {
  return new Intl.DateTimeFormat("en", { day: "2-digit" }).format(new Date(date));
}

function formatCompactCount(value: number) {
  if (value < 1000) return value.toLocaleString();

  const formatter = new Intl.NumberFormat("en", {
    compactDisplay: "short",
    maximumFractionDigits: value < 100000 ? 1 : 0,
    notation: "compact",
  });

  return formatter.format(value).toUpperCase();
}

function buildWhatsAppTicketLink(data: SiteData, event: EventItem) {
  if (event.eventType === "free") return "";

  const number = data.whatsappNumber.replace(/\D/g, "");
  if (!number) return "";

  const message = [
    data.whatsappTicketMessage || "Hi, I would like to buy tickets for",
    `${event.title}.`,
    event.ticketPrice ? `Ticket price: ${formatMoney(event.ticketCurrency, event.ticketPrice)}.` : "",
    event.date ? `Date: ${formatDate(event.date)}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function buildWhatsAppMerchLink(data: SiteData, item: MerchItem, quantity: number) {
  const number = data.whatsappNumber.replace(/\D/g, "");
  if (!number) return "";

  const message = [
    item.category === "book" ? "Hi, I would like to order a book." : "Hi, I would like to order clothing.",
    `Item: ${item.title}.`,
    `Type: ${item.category === "book" ? "Book" : "Clothing"}.`,
    `Quantity: ${quantity}.`,
    item.price ? `Price: ${formatMoney(item.currency, item.price)}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function formatMoney(currency: string, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const cleaned = trimmed.replace(/^(R|N\$|\$|€|£|P)\s*/i, "");
  return `${currency}${cleaned}`;
}
