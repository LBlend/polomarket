"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LocationPoint, WaypointData } from "@/types";
import { Battery, Gauge, Navigation } from "lucide-react";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const currentLocationIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:20px;height:20px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:#1e8a6e;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;opacity:0.6;"></div>
      <div style="position:absolute;inset:3px;border-radius:50%;background:#166e57;border:2px solid #fff;box-shadow:0 0 8px rgba(30,138,110,0.8);"></div>
    </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const waypointIcon = (visited: boolean) =>
  L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${
      visited ? "#22c55e" : "#6366f1"
    };border:2px solid #fff;box-shadow:0 0 6px rgba(0,0,0,0.5);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current || points.length === 0) return;
    fitted.current = true;
    if (points.length === 1) {
      map.setView(points[0], 10);
    } else {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    }
  }, [map, points]);

  return null;
}

interface MapInnerProps {
  locations: LocationPoint[];
  waypoints: WaypointData[];
  isAdmin?: boolean;
  onAddWaypoint?: (lat: number, lng: number) => void;
}

export default function MapInner({
  locations,
  waypoints,
  isAdmin,
  onAddWaypoint,
}: MapInnerProps) {
  const trackPoints: [number, number][] = locations.map((l) => [l.lat, l.lng]);
  const plannedWaypoints = waypoints.filter((w) => !w.visited);
  const plannedWaypointPoints: [number, number][] = plannedWaypoints.map((w) => [
    w.lat,
    w.lng,
  ]);
  const allPoints = [...trackPoints, ...plannedWaypointPoints];

  const latest = locations[locations.length - 1];

  const defaultCenter: [number, number] = latest
    ? [latest.lat, latest.lng]
    : [59.9139, 10.7522];

  const [addingWaypoint, setAddingWaypoint] = useState(false);

  function MapClickHandler() {
    const map = useMap();

    useEffect(() => {
      if (!addingWaypoint) return;
      const handler = (e: L.LeafletMouseEvent) => {
        onAddWaypoint?.(e.latlng.lat, e.latlng.lng);
        setAddingWaypoint(false);
      };
      map.on("click", handler);
      return () => {
        map.off("click", handler);
      };
    }, [map]);

    return null;
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={defaultCenter}
        zoom={latest ? 10 : 4}
        className="w-full h-full rounded-2xl"
        style={{ background: "#0f0f0f" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />

        {allPoints.length > 0 && <FitBounds points={allPoints} />}

        {/* Driven route */}
        {trackPoints.length > 1 && (
          <Polyline
            positions={trackPoints}
            pathOptions={{ color: "#1e8a6e", weight: 3, opacity: 0.85 }}
          />
        )}

        {/* Current location marker */}
        {latest && (
          <Marker
            position={[latest.lat, latest.lng]}
            icon={currentLocationIcon}
          >
            <Popup className="dark-popup">
              <div className="text-sm font-sans space-y-1 min-w-[160px]">
                <p className="font-bold text-green-500">Tjukk Tuk</p>
                <p className="text-neutral-400 text-xs">
                  {new Date(latest.timestamp).toLocaleString("en-GB")}
                </p>
                {latest.speed != null && (
                  <p className="flex items-center gap-1 text-neutral-300">
                    <Gauge size={12} /> {Math.round(latest.speed)} km/h
                  </p>
                )}
                {latest.battery != null && (
                  <p className="flex items-center gap-1 text-neutral-300">
                    <Battery size={12} /> {latest.battery}%
                  </p>
                )}
                <p className="flex items-center gap-1 text-neutral-400 text-xs">
                  <Navigation size={10} />
                  {latest.lat.toFixed(4)}, {latest.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Planned waypoint markers only */}
        {plannedWaypoints.map((wp) => (
          <Marker
            key={wp.id}
            position={[wp.lat, wp.lng]}
            icon={waypointIcon(false)}
          >
            <Popup>
              <div className="text-sm font-sans space-y-1">
                <p className="font-bold">{wp.name}</p>
                {wp.description && (
                  <p className="text-neutral-500 text-xs">{wp.description}</p>
                )}
                <p className="text-xs font-semibold text-indigo-400">
                  Planned
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {isAdmin && <MapClickHandler />}
      </MapContainer>

      {/* Admin: add waypoint button */}
      {isAdmin && (
        <button
          onClick={() => setAddingWaypoint(!addingWaypoint)}
          className={`absolute bottom-4 right-4 z-[1000] px-3 py-2 text-xs font-semibold rounded-full transition-all ${
            addingWaypoint
              ? "bg-gold-500 text-black"
              : "bg-neutral-800 text-neutral-300 border border-rally-border hover:border-gold-600"
          }`}
        >
          {addingWaypoint ? "Click on the map…" : "+ Add stop"}
        </button>
      )}

      {/* Legend */}
      <div className="absolute top-4 left-4 z-[1000] bg-neutral-900/90 backdrop-blur-sm border border-rally-border rounded-xl p-3 text-xs space-y-1.5">
        <div className="flex items-center gap-2">
          <span
            className="w-8 h-0.5 block rounded"
            style={{ background: "#1e8a6e" }}
          />
          <span className="text-neutral-400">Driven</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#1e8a6e] block" />
          <span className="text-neutral-400">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-400 block" />
          <span className="text-neutral-400">Planned stop</span>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
        .dark-popup .leaflet-popup-content-wrapper {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          color: #e5e5e5;
          border-radius: 12px;
        }
        .dark-popup .leaflet-popup-tip { background: #1a1a1a; }
      `}</style>
    </div>
  );
}
