# GPX Route Visualizer

This project is a simple GPX route visualizer built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Mapbox GL JS**. It loads a `.gpx` file, parses it, and displays the route on an interactive Mapbox map with start and end markers, as well as a live-updating progress marker.

---

## Features

- **GPX Parsing** using `xml2js`
- **Interactive Map** with Mapbox GL JS
- **Start and End Markers**
- **Progress Marker** that animates along the route
- Built with **Next.js**, **React**, and **Tailwind CSS**

---

## Tech Stack

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [xml2js](https://www.npmjs.com/package/xml2js) (for GPX parsing)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com//bensbread120/GPX-Viewer.git
cd GPX-Viewer

npm install
# or
yarn install
```

Note you must have a mapbox account and access token to run this project, when you have created this add a .env.local file to the root of this project with the folling syntax:
```javascript
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```
Update the gpx file that you'd like to render add this to the public/gpx folder and add the url like below to the map component
```html
<Map gpxFileUrl="/your_file.gpx" />
```
Once you've done these things you're ready to go:
```bash
npm run dev
```