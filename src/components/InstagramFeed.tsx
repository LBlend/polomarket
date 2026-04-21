"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Instagram, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface Post {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string | null;
  caption?: string;
  timestamp: string;
  permalink: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

function truncate(text: string | undefined, max: number) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "…" : text;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="instagram" className="py-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase mb-2">
              Social media
            </p>
            <h2 className="text-4xl font-display tracking-widest text-white flex items-center gap-3">
              INSTAGRAM
              <Instagram size={28} className="text-pink-500" />
            </h2>
          </div>
          <a
            href="https://instagram.com/polomarket"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <span>@polomarket</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-neutral-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {posts.map((post, i) => (
              <motion.a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-rally-border hover:border-gold-700 transition-all"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Image
                  src={
                    post.media_type === "VIDEO"
                      ? (post.thumbnail_url ?? post.media_url)
                      : post.media_url
                  }
                  alt={truncate(post.caption, 80) || "Instagram post"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  {post.caption && (
                    <p className="text-white text-xs leading-relaxed line-clamp-3">
                      {truncate(post.caption, 120)}
                    </p>
                  )}
                  <p className="text-neutral-400 text-xs mt-2">{timeAgo(post.timestamp)}</p>
                </div>

                {post.media_type === "VIDEO" && (
                  <div className="absolute top-3 right-3 bg-black/60 rounded-full px-2 py-0.5 text-white text-xs font-semibold">
                    ▶
                  </div>
                )}

                {post.media_type === "CAROUSEL_ALBUM" && (
                  <div className="absolute top-3 right-3 text-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="2" y="6" width="12" height="12" rx="2" opacity="0.6" />
                      <rect x="7" y="3" width="12" height="12" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                )}
              </motion.a>
            ))}
          </div>
        )}

        {posts.length === 0 && !loading && (
          <div className="text-center py-16 text-neutral-500">
            <Instagram size={40} className="mx-auto mb-4 opacity-30" />
            <p>No posts found.</p>
          </div>
        )}

        <div className="text-center mt-8">
          <a
            href="https://instagram.com/polomarket"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-rally-border hover:border-pink-600 text-sm text-neutral-400 hover:text-pink-400 transition-all"
          >
            <Instagram size={16} />
            Follow us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
