"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { MapPin, RefreshCw, Clock, Zap } from "lucide-react";
import type { LocationPoint, WaypointData } from "@/types";

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neutral-900 rounded-2xl">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-neutral-500 text-sm">Loading map…</p>
      </div>
    </div>
  ),
});

const REFRESH_INTERVAL = 60_000;

export default function LiveMap() {
  const [locations, setLocations] = useState<LocationPoint[]>([]);
  const [waypoints, setWaypoints] = useState<WaypointData[]>([]);
  const [loading, setLoading] = useState(true);
  const [addWpModal, setAddWpModal] = useState<{ lat: number; lng: number } | null>(null);
  const [wpName, setWpName] = useState("");
  const [wpDesc, setWpDesc] = useState("");

  const fetchData = useCallback(async () => {
    const [locRes, wpRes] = await Promise.all([
      fetch("/api/locations?limit=2000"),
      fetch("/api/waypoints"),
    ]);
    if (locRes.ok) setLocations(await locRes.json());
    if (wpRes.ok) setWaypoints(await wpRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [fetchData]);

  const handleAddWaypoint = (lat: number, lng: number) => {
    setAddWpModal({ lat, lng });
    setWpName("");
    setWpDesc("");
  };

  const submitWaypoint = async () => {
    if (!addWpModal || !wpName.trim()) return;
    await fetch("/api/waypoints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lat: addWpModal.lat,
        lng: addWpModal.lng,
        name: wpName,
        description: wpDesc,
        order: waypoints.length,
      }),
    });
    setAddWpModal(null);
    fetchData();
  };

  const latest = locations[locations.length - 1];

  return (
    <section id="map" className="py-20 bg-rally-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase mb-2">
              Real-time tracking
            </p>
            <h2 className="text-4xl font-display tracking-widest text-white">
              LIVE MAP
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {latest && (
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Zap size={12} className="text-gold-600" />
                <span>
                  Last ping:{" "}
                  {new Date(latest.timestamp).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-gold-400 transition-colors"
            >
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            {
              icon: <MapPin size={16} className="text-gold-500" />,
              label: "GPS points",
              value: locations.length.toLocaleString("en"),
            },
            {
              icon: <Clock size={16} className="text-indigo-400" />,
              label: "Planned stops",
              value: waypoints.filter((w) => !w.visited).length,
            },
            {
              icon: <MapPin size={16} className="text-green-500" />,
              label: "Visited stops",
              value: waypoints.filter((w) => w.visited).length,
            },
            {
              icon: <Zap size={16} className="text-amber-400" />,
              label: "Status",
              value: locations.length > 0 ? "EN ROUTE" : "Waiting",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-rally-card border border-rally-border rounded-xl p-3 flex items-center gap-3"
            >
              {stat.icon}
              <div>
                <p className="text-neutral-500 text-xs">{stat.label}</p>
                <p className="text-white font-semibold text-sm">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="h-[500px] sm:h-[600px] rounded-2xl overflow-hidden border border-rally-border">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-neutral-900">
              <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <MapInner
              locations={locations}
              waypoints={waypoints}
              isAdmin={false}
              onAddWaypoint={handleAddWaypoint}
            />
          )}
        </div>

        {!loading && locations.length === 0 && (
          <p className="text-center text-neutral-500 text-sm mt-4">
            No GPS data yet. The map will update automatically once the rally starts.
          </p>
        )}
      </div>

      {/* Add waypoint modal */}
      {addWpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-rally-card border border-rally-border rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-display tracking-wider text-white">New waypoint</h3>
            <p className="text-xs text-neutral-500">
              {addWpModal.lat.toFixed(5)}, {addWpModal.lng.toFixed(5)}
            </p>
            <input
              type="text"
              placeholder="Name *"
              value={wpName}
              onChange={(e) => setWpName(e.target.value)}
              className="w-full bg-neutral-900 border border-rally-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-gold-600"
            />
            <textarea
              placeholder="Description (optional)"
              value={wpDesc}
              onChange={(e) => setWpDesc(e.target.value)}
              rows={2}
              className="w-full bg-neutral-900 border border-rally-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-gold-600 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setAddWpModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-rally-border text-sm text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitWaypoint}
                disabled={!wpName.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 disabled:opacity-40 text-black font-semibold text-sm transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
