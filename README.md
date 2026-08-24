# ⛰️ Alpine Ascents

**A Mountaineering & Climbing Information Portal**

Alpine Ascents is a complete, professional, modern and fully responsive Single Page Application (SPA) built as an academic eProject. It serves as a comprehensive portal for everything related to mountaineering — from history and climbing techniques to hazards, records, organizations, success stories and the latest developments in the alpine world.

---

## 🎯 Project Objectives

- Provide a single, accessible knowledge hub for mountaineering and climbing.
- Present mountaineering history, styles, techniques, sheltering, hazards and equipment in an engaging, visual way.
- Deliver dynamic, JSON-driven content using modern JavaScript (ES6 + jQuery).
- Implement interactive features including geolocation, maps, search, filters, modals, a lightbox and form validation.
- Demonstrate clean, modular, beginner-friendly code suitable for an academic setting.

---

## 🛠️ Technologies Used

| Layer | Technology |
|-------|------------|
| Markup | HTML5 (semantic) |
| Styling | CSS3, Bootstrap 5, custom CSS |
| Scripting | JavaScript ES6, jQuery 3.7 |
| Data | JSON (AJAX-loaded) |
| Icons | Font Awesome 6 |
| Fonts | Google Fonts (Montserrat + Open Sans) |
| Maps | Leaflet + OpenStreetMap |
| Location | HTML5 Geolocation API |

---

## ✨ Features

### Core Sections
- **Hero** — full-screen mountain backdrop with CTA buttons and scroll animation.
- **Introduction / About Mountaineering** — definition and animated statistics.
- **About Alpine Ascents** — mission, vision, safety, guidance and adventure values.
- **History** — interactive timeline.
- **Styles** — 10 climbing disciplines (Hiking → Mixed Climbing).
- **Techniques** — rope management, belaying, knots, rappelling, navigation and more.
- **Sheltering** — tents, huts, bivouac, snow caves, camps.
- **Equipment** — helmets, harnesses, ropes, carabiners, ice axes, crampons and more.
- **Hazards** — 11 hazards with risk levels and prevention tips.
- **Records** — searchable & filterable mountaineering records.
- **Organizations & Clubs** — worldwide federations with country, city and website.
- **Map** — interactive map with organization markers + user location.
- **Success Stories** — expedition stories with modal details.
- **Gallery** — filterable image gallery with lightbox + informative videos.
- **Latest Developments** — searchable & filterable articles.
- **General Guidelines** — preparation, safety, emergency procedures + checklist UI.
- **Global Search** — searches across all major JSON datasets.
- **Contact** — validated form with Bootstrap alerts.

### Special Features
- Visitor counter (localStorage) near the logo.
- Continuous bottom scrolling ticker (date, time, location, latitude, longitude).
- HTML5 Geolocation API.
- Active navbar highlighting & smooth scrolling.
- Hover/click effects, fade/slide/zoom animations.
- JSON/AJAX dynamic data loading.
- Search and filters (records, developments, gallery, global).
- Bootstrap modals (stories, videos).
- Gallery lightbox with keyboard navigation.
- Contact form validation with Bootstrap alerts.
- Back-to-top button.
- Mobile responsive navigation (hamburger).
- Error handling for JSON, location, images and map.
- Lazy-loaded images.

---

## 📂 Folder Structure

```
alpine-ascents/
├── index.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── animations.css
├── js/
│   ├── app.js
│   ├── navigation.js
│   ├── geolocation.js
│   ├── visitor-counter.js
│   ├── ticker.js
│   ├── gallery.js
│   ├── records.js
│   ├── organizations.js
│   ├── stories.js
│   ├── developments.js
│   ├── search.js
│   └── validation.js
├── data/
│   ├── mountaineering.json
│   ├── records.json
│   ├── organizations.json
│   ├── stories.json
│   ├── gallery.json
│   └── developments.json
├── images/
├── videos/
└── README.md
```

---

## 🚀 Setup Instructions

> ⚠️ **Important:** Because the site loads JSON via AJAX and the geolocation API requires a secure or localhost context, you should serve the project over HTTP rather than opening `index.html` directly with `file://`.

### Option A — Visual Studio Code (Live Server)

1. Install the **Live Server** extension (by Ritwick Dey).
2. Open the `alpine-ascents` folder in VS Code.
3. Right-click `index.html` → **"Open with Live Server"**.
4. The site opens at `http://127.0.0.1:5500/`.

### Option B — Python HTTP server

```bash
cd alpine-ascents
python -m http.server 8000
# then open http://localhost:8000
```

### Option C — Node

```bash
cd alpine-ascents
npx serve .
```

---

## 🗺️ Geolocation & Map Configuration

- **User location** is obtained through the HTML5 Geolocation API in `js/geolocation.js`. Browsers require HTTPS (or `localhost`) and the user must grant permission.
- **Reverse geocoding** uses the free [Nominatim](https://nominatim.openstreetmap.org) API (no key required) to convert coordinates into a place name shown in the ticker.
- **The map** uses **Leaflet** (loaded from CDN) with **OpenStreetMap** tiles. It places a marker for each organization from `data/organizations.json` (using their `lat`/`lng` fields) and a distinct marker for the user's current location.
- **Fallbacks**: if the browser denies location permission, if Leaflet fails to load, or if positioning times out, the UI shows an appropriate message instead of breaking.

### Replacing the map tiles (optional)

To use a different tile provider, edit the `L.tileLayer(...)` call in `js/geolocation.js`.

---

## 📄 JSON Data Explanation

All dynamic content is stored in the `data/` folder and loaded with jQuery AJAX.

| File | Purpose | Key fields |
|------|---------|------------|
| `mountaineering.json` | Statistics, styles, techniques, sheltering, hazards, equipment, guidelines intro | arrays of objects |
| `records.json` | Mountaineering records | `title, year, climbers, peak, height, country, category, description` |
| `organizations.json` | Organizations & clubs | `name, country, city, lat, lng, website, type, founded, desc` |
| `stories.json` | Success stories / expeditions | `title, location, participants, duration, achievement, image, details` |
| `gallery.json` | Gallery images & videos | `gallery[]` with `category`; `videos[]` with `source` |
| `developments.json` | Latest articles | `title, category, date, author, summary, image` |

Every image has an `alt` field and an `onerror` fallback that swaps in a placeholder image so the layout never breaks if a local image is missing.

---

## 🧪 Testing

1. **Load test** — confirm the preloader fades and all sections render with data.
2. **Navigation** — click each navbar link; confirm smooth scrolling and active highlighting.
3. **Search & filters** — type in the records, developments and global search bars; change category filters.
4. **Gallery** — filter by category, click an image to open the lightbox, use arrows/keys, and open a video.
5. **Stories** — click "Read Full Story" to open the modal.
6. **Contact form** — submit an empty form to see validation, then a valid one to see the success alert.
7. **Geolocation** — allow/deny location and check the ticker, geo-status message and map markers.
8. **Visitor counter** — reload the page and confirm the count increments.
9. **Responsive** — resize the window (or use device toolbar) through mobile / tablet / desktop widths.

---

## ⚠️ Known Limitations

- **No backend**: the contact form and newsletter simulate submission (no data is actually stored or emailed). A real backend endpoint would replace the simulated success message.
- **Video placeholders**: `gallery.json` currently points to demo embed URLs; replace the `source` values with real video links.
- **Images**: the `images/` folder is intentionally empty of binary files — all image references fall back to placeholder images via the `onerror` handler. Add your own mountain photography to `images/` for the full experience.
- **Reverse geocoding**: Nominatim may rate-limit or be blocked in some regions; coordinates still display as a fallback.
- **Map tiles**: require an internet connection; offline the map shows a fallback message.

---

## 🧑‍💻 Author

Built as an academic eProject — **Alpine Ascents**, a mountaineering & climbing information portal.

Reach Higher. Explore Further. Conquer Your Limits. 🏔️
