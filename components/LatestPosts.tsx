"use client";

import { useEffect, useState } from "react";
import HlsPlayer from "@/components/HlsPlayer";
import { CloseIcon } from "@/components/Icons";
import type { LatestPost } from "@/lib/latestPosts";

function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function LatestPosts({ posts }: { posts: LatestPost[] }) {
  const [open, setOpen] = useState<LatestPost | null>(null);
  const [ago, setAgo] = useState<Record<string, string>>({});

  // Relative times are computed in the browser so the cached page never shows a stale "2 min ago".
  useEffect(() => {
    setAgo(Object.fromEntries(posts.map((p) => [p.id, timeAgo(p.created_at)])));
  }, [posts]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="latest-grid">
        {posts.map((p) => (
          <button key={p.id} type="button" className="latest-card" onClick={() => setOpen(p)}>
            <span className="latest-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.thumbnail_url} alt={p.dish_name ?? "A dish on SporkIt"} loading="lazy" />
              <span className="latest-play" aria-hidden="true" />
            </span>
            <span className="latest-meta">
              <span className="latest-dish">{p.dish_name ?? p.restaurant_name ?? "New post"}</span>
              {p.dish_name && p.restaurant_name && (
                <span className="latest-rest">{p.restaurant_name}</span>
              )}
              <span className="latest-by">
                {p.username ? `@${p.username}` : ""}
                {p.username && ago[p.id] ? " · " : ""}
                {ago[p.id] ?? ""}
              </span>
            </span>
          </button>
        ))}
      </div>

      {open && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={open.dish_name ?? "Video"} onClick={() => setOpen(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" aria-label="Close video" onClick={() => setOpen(null)}>
              <CloseIcon />
            </button>
            <div className="modal-video">
              <HlsPlayer src={open.video_url} poster={open.thumbnail_url} autoPlay />
            </div>
            <div className="modal-info">
              <p className="latest-dish">{open.dish_name ?? open.restaurant_name}</p>
              {open.dish_name && open.restaurant_name && <p className="latest-rest">{open.restaurant_name}</p>}
              <a className="modal-link" href={`/video/${open.id}`}>Open post</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
