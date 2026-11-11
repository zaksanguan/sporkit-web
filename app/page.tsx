import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import SpinWheel from "@/components/SpinWheel";
import LatestPosts from "@/components/LatestPosts";
import { getLatestPosts } from "@/lib/latestPosts";
import {
  BookmarkIcon,
  CaretIcon,
  CloseIcon,
  CookieIcon,
  StoreCheckIcon,
} from "@/components/Icons";

// The hero food photo is optional while the design is being finished:
// if public/landing/hero.webp is missing the hero simply shows no photo.
const HERO_PHOTO = fs.existsSync(path.join(process.cwd(), "public/landing/hero.webp"));

// Refresh the latest posts about once a minute.
export const revalidate = 60;

const PILLS = ["Nearby", "Cuisines", "Dishes"];

function Pills() {
  return (
    <div className="pills" aria-hidden="true">
      {PILLS.map((p) => (
        <span key={p} className={p === "Cuisines" ? "pill pill-on" : "pill"}>
          {p}
        </span>
      ))}
    </div>
  );
}

function StoreBadges() {
  return (
    <>
      <p className="coming-soon">Coming soon</p>
      <Image
        className="badges"
        src="/landing/store-badges.svg"
        alt="Coming soon to the App Store and Google Play"
        width={327}
        height={48}
      />
    </>
  );
}

function Feature({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <li className="feature">
      <h3>{title}</h3>
      <Image src={`/landing/${icon}.svg`} alt="" width={64} height={64} />
      <p>{children}</p>
    </li>
  );
}

function Sheet({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="sheet" aria-hidden="true">
      <span className="sheet-handle" />
      <span className="sheet-close">
        <CloseIcon />
      </span>
      <div className="sheet-head">
        <p className="sheet-title">{title}</p>
        <p className="sheet-sub">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function VoteCard({
  icon,
  title,
  sub,
  question,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  question: string;
}) {
  return (
    <div className="row row-vote">
      <div className="row-main">
        {icon}
        <div className="row-text">
          <p className="row-title">{title}</p>
          <p className="row-sub">{sub}</p>
        </div>
      </div>
      <hr />
      <p className="vote-q">{question}</p>
      <div className="vote-buttons">
        <span className="btn-ghost">No, I wouldn’t</span>
        <span className="btn-orange">Yes, I would</span>
      </div>
    </div>
  );
}

export default async function Home() {
  const latest = await getLatestPosts(3);
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          {HERO_PHOTO && (
            <div className="hero-photo">
              <Image
                src="/landing/hero.webp"
                alt="A table of dishes on SporkIt"
                width={692}
                height={411}
                priority
                sizes="(max-width: 900px) 100vw, 692px"
              />
            </div>
          )}
          <div className="hero-copy">
            <Image
              className="hero-logo"
              src="/landing/logo.svg"
              alt="SporkIt"
              width={172}
              height={138}
              priority
            />
            <div className="stack-2">
              <h1>Your food diary starts here</h1>
              <p className="lede">
                Discover dishes worth trying. Share your honest verdict.
                <br className="br-wide" /> Because every meal has a story.
              </p>
            </div>
            <div className="stack-3">
              <p className="tagline">Worth it? Spork it.</p>
              <StoreBadges />
            </div>
          </div>
        </div>
      </section>

      {/* LATEST POSTS (hidden until there are 3 real in-app posts) */}
      {latest.length >= 3 && (
        <section className="section" id="latest">
          <div className="head">
            <h2>Latest on Spork<span className="brand">It</span></h2>
            <p>Fresh dishes, just posted by people on SporkIt.</p>
          </div>
          <LatestPosts posts={latest} />
        </section>
      )}

      {/* WHAT IS SPORKIT */}
      <section className="section" id="what">
        <div className="head">
          <h2>
            What is Spork<span className="brand">It</span>?
          </h2>
          <p>
            SporkIt is a video-first food diary. Watch short videos of real
            dishes, then spork them: give your honest verdict. Every spork goes
            into your diary and helps the next person decide where to eat.
          </p>
        </div>
        <h3 className="sub-head">How sporking works</h3>
        <div className="steps">
          <div className="step">
            <div className="step-text">
              <p className="step-title">Save it</p>
              <p>
                Spot a place you like? Tap Want to go to save it, or{" "}
                <strong>Ate here</strong> if you’ve been.
              </p>
            </div>
            <Sheet title="Restaurant" subtitle="What do you think?">
              <div className="row row-plain">
                <BookmarkIcon />
                <div className="row-text">
                  <p className="row-title">Want to go</p>
                  <p className="row-sub">Save to your favorites</p>
                </div>
                <CaretIcon />
              </div>
              <div className="row row-plain">
                <StoreCheckIcon />
                <div className="row-text">
                  <p className="row-title">Ate here</p>
                  <p className="row-sub">Tell us if it was worth it</p>
                </div>
                <CaretIcon />
              </div>
            </Sheet>
          </div>
          <div className="step">
            <div className="step-text">
              <p className="step-title">Give your verdict</p>
              <p>
                Been there? Tell us honestly: would you go back? Yes or no.
              </p>
            </div>
            <Sheet title="Restaurant" subtitle="What do you think?">
              <VoteCard
                icon={<StoreCheckIcon />}
                title="Ate here"
                sub="Endorse this place"
                question="Would you go back?"
              />
            </Sheet>
          </div>
          <div className="step">
            <div className="step-text">
              <p className="step-title">Judge the dish</p>
              <p>
                Was it worth the bite? How did it taste to you? Tell us if
                you’d order it again.
              </p>
            </div>
            <Sheet title="Dish" subtitle="How was this dish?">
              <VoteCard
                icon={<CookieIcon />}
                title="Ate it"
                sub="Endorse this dish"
                question="Would you order it again?"
              />
            </Sheet>
          </div>
        </div>
      </section>

      {/* EAT WHERE IT'S WORTH IT */}
      <section className="section" id="worth-it">
        <div className="head">
          <h2>Eat where it’s worth it</h2>
          <p>
            Real dishes, real people, honest verdicts. See what’s worth your
            time before you sit down.
          </p>
        </div>
        <ul className="features">
          <Feature title="Honest verdicts" icon="fork-mark">
            No stars. Rated by how many people would go back, or order it again
          </Feature>
          <Feature title="See the dish" icon="camera">
            Short videos of the real dish, so you know what you’re ordering.
          </Feature>
          <Feature title="Smart feed" icon="sparkle">
            Pick the dishes you love and they show up first.
          </Feature>
          <Feature title="Your food diary" icon="stack">
            Every dish and place you’ve sporked, in one diary.
          </Feature>
        </ul>
      </section>

      {/* SPIN */}
      <section className="section" id="spin">
        <div className="head">
          <h2>Can’t decide? Spin it.</h2>
          <p>
            Spin the wheel and let SporkIt pick: a place near you, a cuisine, or
            a dish.
          </p>
        </div>
        <div className="wheels">
          <div className="wheel-col">
            <h3>Pick a category</h3>
            <Pills />
            <SpinWheel label="The spin wheel with eight cuisines" />
            <span className="spin-btn">Spin</span>
          </div>
          <div className="wheel-col">
            <h3>Spin</h3>
            <Pills />
            <SpinWheel
              label="The wheel spinning past Indian, Mexican and Thai"
              lit={{ Indian: "hot", Mexican: "warm", Thai: "warm" }}
            />
            <span className="wait-pill">Fate is choosing your next meal...</span>
          </div>
          <div className="wheel-col">
            <h3>See results</h3>
            <Pills />
            <SpinWheel
              label="The wheel stopped on Italian"
              lit={{ Italian: "hot" }}
            />
            <div className="result">
              <p className="result-label">You got:</p>
              <p className="result-value">🍛 Italian</p>
            </div>
          </div>
        </div>
      </section>

      {/* RESTAURANTS */}
      <section className="section section-band" id="restaurants">
        <div className="head">
          <h2>Own a restaurant? Meet your diners</h2>
          <p>
            Claim your restaurant on SporkIt and see how people feel about it,
            honestly and anonymously.
          </p>
        </div>
        <ul className="features">
          <Feature title="Get verified" icon="seal-check">
            Claim your place and get the green check.
          </Feature>
          <Feature title="Your own page" icon="storefront">
            A public profile with your videos and reviews.
          </Feature>
          <Feature title="See how diners feel" icon="chart-bar">
            How many would go back, and which dishes people love.
          </Feature>
          <Feature title="Keep it up to date" icon="note-pencil">
            Edit your hours, tags and address yourself.
          </Feature>
        </ul>
        <a className="cta" href="/claim">
          Claim your restaurant
        </a>
      </section>

      {/* CLOSING BAND */}
      <section className="closing">
        <div className="head head-dark">
          <h2>Your next meal is worth it.</h2>
          <p>Your food diary starts here.</p>
        </div>
        <div className="stack-3">
          <p className="coming-soon coming-soon-dark">Coming soon</p>
          <Image
            className="badges"
            src="/landing/store-badges.svg"
            alt="Coming soon to the App Store and Google Play"
            width={327}
            height={48}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">
          <Image src="/landing/fork-mark.svg" alt="" width={28} height={28} />
          <span className="footer-word">
            Spork<span className="brand">It</span>
          </span>
        </div>
        <p className="footer-copy">© 2026 SporkIt. All rights reserved.</p>
        <nav className="footer-links" aria-label="Footer">
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy</a>
          <a href="/delete-account">Account deletion</a>
          <a href="mailto:contact@sporkitapp.com">Contact</a>
        </nav>
        <a
          className="footer-tiktok"
          href="https://www.tiktok.com/@sporkit"
          aria-label="SporkIt on TikTok"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/landing/tiktok.svg" alt="" width={24} height={24} />
        </a>
      </footer>
    </main>
  );
}
