// Rasterizes North & Central America into the pixel grid used by the travel
// page, writing public/assets/travel-map.json. Run once (or after changing
// the frame below):
//
//   npm run travel-map
//
// Borders come from Natural Earth (public domain): US states and Canadian
// provinces at 1:50m, Mexican states at 1:10m, everything else as whole
// countries. Downloads are cached in .cache/geo (gitignored).

import { mkdir, readFile, writeFile, access } from 'node:fs/promises';

const CACHE = new URL('../.cache/geo/', import.meta.url);
const OUT = new URL('../public/assets/travel-map.json', import.meta.url);
const NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/';
const SOURCES = {
  admin1: 'ne_50m_admin_1_states_provinces_lakes.geojson',
  admin1hd: 'ne_10m_admin_1_states_provinces.geojson', // only source with Mexican states
  countries: 'ne_50m_admin_0_countries.geojson',
};

// ── Frame ───────────────────────────────────────────────────────────────────
const COLS = 160;
const LON0 = -128, LON1 = -58, LAT0 = 7, LAT1 = 56; // main map bounds
const PARALLEL = 35; // equirectangular standard parallel
const KX = COLS / (LON1 - LON0); // cells per degree of longitude
const KY = KX / Math.cos((PARALLEL * Math.PI) / 180); // cells per degree of latitude
const ROWS = Math.round((LAT1 - LAT0) * KY);

// Alaska and Hawaii as insets in the empty Pacific corner (bottom-left).
const INSETS = [
  { name: 'Alaska', lon0: -170, lon1: -129, lat0: 51, lat1: 72, scale: 0.34, col: 2, row: ROWS - 36 },
  { name: 'Hawaii', lon0: -160.5, lon1: -154.5, lat0: 18.8, lat1: 22.4, scale: 1, col: 24, row: ROWS - 12 },
];
for (const f of INSETS) {
  f.w = Math.ceil((f.lon1 - f.lon0) * KX * f.scale);
  f.h = Math.ceil((f.lat1 - f.lat0) * KY * f.scale);
}

async function source(key) {
  const file = new URL(SOURCES[key], CACHE);
  try {
    await access(file);
  } catch {
    console.log(`travel-map: downloading ${SOURCES[key]}...`);
    const res = await fetch(NE + SOURCES[key]);
    if (!res.ok) throw new Error(`${res.status} downloading ${SOURCES[key]}`);
    await mkdir(CACHE, { recursive: true });
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
  }
  return JSON.parse(await readFile(file, 'utf8')).features;
}

// ── Geometry ────────────────────────────────────────────────────────────────
const polygons = (geom) => (geom.type === 'Polygon' ? [geom.coordinates] : geom.type === 'MultiPolygon' ? geom.coordinates : []);

function bbox(polys) {
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const poly of polys) for (const [x, y] of poly[0]) {
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  return [x0, y0, x1, y1];
}

function inRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// Inside the outer ring and not inside any hole.
const inPolys = (x, y, polys) => polys.some((p) => inRing(x, y, p[0]) && !p.slice(1).some((h) => inRing(x, y, h)));

// ── Regions ─────────────────────────────────────────────────────────────────
const [admin1, admin1hd, countries] = await Promise.all([source('admin1'), source('admin1hd'), source('countries')]);

const regions = [];
const add = (name, kind, country, geom, frame = 'main') => {
  const polys = polygons(geom);
  if (polys.length) regions.push({ name, kind, country, polys, box: bbox(polys), frame });
};

for (const f of admin1) {
  const p = f.properties;
  if (p.admin === 'United States of America') {
    add(p.name, 'state', 'US', f.geometry, p.name === 'Alaska' || p.name === 'Hawaii' ? p.name : 'main');
  } else if (p.admin === 'Canada') {
    add(p.name, 'province', 'CA', f.geometry);
  }
}
for (const f of admin1hd) {
  const p = f.properties;
  if (p.admin !== 'Mexico' || !p.name) continue;
  add(p.name === 'Distrito Federal' ? 'Ciudad de México' : p.name, 'state', 'MX', f.geometry);
}
for (const f of countries) {
  const name = f.properties.NAME;
  if (['United States of America', 'Canada', 'Mexico'].includes(name)) continue;
  const [x0, y0, x1, y1] = bbox(polygons(f.geometry));
  if (x1 < LON0 || x0 > LON1 || y1 < LAT0 || y0 > LAT1) continue; // outside the map
  add(name, f.properties.TYPE === 'Dependency' ? 'territory' : 'country', name, f.geometry);
}

// ── Rasterize ───────────────────────────────────────────────────────────────
// Cell center → lon/lat for the frame it falls in (an inset or the main map).
function locate(col, row) {
  for (const f of INSETS) {
    if (col >= f.col && col < f.col + f.w && row >= f.row && row < f.row + f.h) {
      return { frame: f.name, lon: f.lon0 + (col - f.col + 0.5) / (KX * f.scale), lat: f.lat1 - (row - f.row + 0.5) / (KY * f.scale) };
    }
  }
  return { frame: 'main', lon: LON0 + (col + 0.5) / KX, lat: LAT1 - (row + 0.5) / KY };
}

const grid = new Array(ROWS * COLS).fill(0); // 0 = water, i+1 = regions[i]
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const { frame, lon, lat } = locate(col, row);
    const i = regions.findIndex(
      (r) => r.frame === frame && lon >= r.box[0] && lon <= r.box[2] && lat >= r.box[1] && lat <= r.box[3] && inPolys(lon, lat, r.polys),
    );
    if (i >= 0) grid[row * COLS + col] = i + 1;
  }
}

// Places smaller than a cell (DC, small islands) still get one pixel, at the
// center of their bounding box, as long as that point is on this map.
regions.forEach((r, i) => {
  if (grid.includes(i + 1)) return;
  const lon = (r.box[0] + r.box[2]) / 2, lat = (r.box[1] + r.box[3]) / 2;
  if (r.frame !== 'main' || lon < LON0 || lon > LON1 || lat < LAT0 || lat > LAT1) return;
  const col = Math.floor((lon - LON0) * KX), row = Math.floor((LAT1 - lat) * KY);
  grid[row * COLS + col] = i + 1;
});

// Keep only regions that ended up on the map; run-length encode each row.
const used = [...new Set(grid)].filter(Boolean).sort((a, b) => a - b);
const remap = new Map(used.map((v, i) => [v, i + 1]));
const rows = [];
for (let row = 0; row < ROWS; row++) {
  const runs = [];
  for (let col = 0; col < COLS; col++) {
    const v = remap.get(grid[row * COLS + col]) ?? 0;
    if (runs.length && runs[runs.length - 2] === v) runs[runs.length - 1]++;
    else runs.push(v, 1);
  }
  rows.push(runs);
}

await writeFile(
  OUT,
  JSON.stringify({
    cols: COLS,
    rows: ROWS,
    // For projecting markers (lat/lon) onto the main map.
    projection: { lon0: LON0, lat1: LAT1, kx: KX, ky: KY },
    insets: INSETS.map(({ name, col, row, w, h }) => ({ name, col, row, w, h })),
    regions: used.map((v) => {
      const { name, kind, country } = regions[v - 1];
      return { name, kind, country };
    }),
    data: rows,
  }) + '\n',
);
console.log(`travel-map: ${COLS}x${ROWS} grid, ${used.length} regions`);
