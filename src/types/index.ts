export interface LocationPoint {
  id: string;
  lat: number;
  lng: number;
  altitude?: number | null;
  speed?: number | null;
  accuracy?: number | null;
  battery?: number | null;
  timestamp: string;
}

export interface WaypointData {
  id: string;
  lat: number;
  lng: number;
  name: string;
  description?: string | null;
  order: number;
  visited: boolean;
}

export interface OwnTracksPayload {
  _type: string;
  lat?: number;
  lon?: number;
  alt?: number;
  vel?: number;
  acc?: number;
  batt?: number;
  tid?: string;
  tst?: number;
}
