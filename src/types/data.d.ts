import type { LatLngTuple } from 'leaflet';

type Feature = {
  type: string;
  geometry: {
    type: string;
    coordinates: LatLngTuple;
  };
  properties: {
    id: string;
    gid: string;
    source: string;
    source_id: string;
    name: string;
    confidence: number;
    distance: number;
    accuracy: string;
    localadmin: string;
    localadmin_gid: string;
    label: string;
  };
};

export type Address = Feature & {
  properties: {
    layer: 'address';
    housenumber: string;
    street: string;
    postalcode?: string;
    postalcode_gid?: string;
  };
};

export type Venue = Feature & {
  properties: {
    layer: 'venue';
  };
};

export type Street = Feature & {
  properties: {
    layer: 'street';
  };
};

export type Stop = Feature & {
  properties: {
    layer: 'stop';
    addendum: {
      GTFS: {
        modes: Array<'BUS' | 'TRAM' | 'RAIL'>;
        code: string;
      };
    };
  };
};

export type Station = Feature & {
  properties: {
    layer: 'station';
    housenumber: string;
    street: string;
  };
};

export type Location = Address | Venue | Street | Stop | Station;

export type Itinerary = {
  node: {
    start: string;
    end: string;
    legs: Array<WalkItinerary | TransportItinerary>;
  };
};

type ItineraryLegsBase = {
  from: {
    name: string;
  };
  to: {
    name: string;
  };
  start: {
    scheduledTime: string;
  };
  end: {
    scheduledTime: string;
  };
  duration: number;
  distance: number;
  legGeometry: {
    length: number;
    points: string;
  };
};

type WalkItinerary = ItineraryLegsBase & {
  mode: 'WALK';
  realtimeState: null;
  trip: null;
};

type TransportItinerary = ItineraryLegsBase & {
  mode: 'BUS' | 'TRAM' | 'RAIL';
  realtimeState: string;
  trip: {
    tripHeadsign: string;
    routeShortName: string;
  };
};

export type ItineraryResponseData = {
  data: {
    planConnection: {
      edges: Itinerary[];
    };
  };
};

export type StopTime = {
  scheduledArrival: number;
  realtimeArrival: number;
  arrivalDelay: number;
  scheduledDeparture: number;
  realtimeDeparture: number;
  departureDelay: number;
  realtime: boolean;
  realtimeState: string;
  serviceDay: number;
  headsign: string;
  trip: {
    directionId: string;
    occupancy: {
      occupancyStatus: string;
    };
    route: {
      color: string;
      desc: null;
      id: string;
      longName: string;
      shortName: string;
      mode: string;
    };
    routeShortName: string;
    tripShortName: string;
    tripHeadsign: string;
  };
};

export type StopInfoResponse = {
  gtfsId: string;
  lat: number;
  lon: number;
  name: string;
  patterns: Array<{
    code: string;
    directionId: number;
    headsign: string;
    id: string;
    route: {
      gtfsId: string;
      shortName: string;
      longName: string;
      mode: string;
    };
  }>;
  stoptimesWithoutPatterns: StopTime[];
};

export type StopStationData = {
  code: string;
  desc: string | null;
  direction: null;
  gtfsId: string;
  id: string;
  name: string;
  lat: number;
  lon: number;
  locationType: string;
  parentStation: {
    id: string;
    gtfsId: string;
    code: string;
    vehicleMode: string;
  } | null;
  platformCode: string | null;
  vehicleMode: string | null;
  stops: null;
};

export type GeocodingFeature = {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    id: string;
    gid: string;
    layer: string;
    source: string;
    source_id: string;
    name: string;
    confidence: number;
    distance: number;
    accuracy: string;
    localadmin: string;
    localadmin_gid: string;
    label: string;
    addendum: {
      GTFS: {
        modes: string[];
        code: string;
      };
    };
  };
};

export type GeocodingResponse = {
  geocoding: {
    version: string;
    attribution: string;
    query: {
      text: string;
      size: number;
      lang: string;
      layers: string[];
      private: boolean;
      'focus.point.lat': number;
      'focus.point.lon': number;
      'boundary.country': string[];
      querySize: number;
      parsed_text: {
        city: string;
        name: string;
      };
    };
    engine: {
      name: string;
      author: string;
      version: string;
    };
    timestamp: number;
  };
  type: string;
  features: GeocodingFeature[];
  bbox: number[];
};
