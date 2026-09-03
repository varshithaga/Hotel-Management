/* Capture every screen of the running app -> docs/screenshots/*.jpg + docs/walkthrough.mp4
 * Run via `python docs/capture.py` (which installs the two deps first), or directly:
 *   cd docs && npm i puppeteer-core ffmpeg-static && node _capture.js
 * Requires: frontend dev server on http://localhost:5173, backend on :8000, DB seeded.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const puppeteer = require("puppeteer-core");
const ffmpeg = require("ffmpeg-static");

const BASE = process.env.APP_URL || "http://localhost:5173";
const DOCS = __dirname;
const OUT = path.join(DOCS, "screenshots");
const W = 1440, H = 900;
const DWELL = 2.8; // seconds per slide in the video

function findChrome() {
  const guesses = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean);
  for (const g of guesses) if (fs.existsSync(g)) return g;
  throw new Error("Chrome/Edge not found - set CHROME_PATH");
}

const PUBLIC = [
  ["01-home", "/"], ["02-rooms", "/rooms"], ["03-booking", "/booking"],
  ["04-spa", "/spa"], ["05-dining", "/dining"], ["06-gallery", "/gallery"],
  ["07-about", "/about"], ["08-contact", "/contact"],
];
const ADMIN = [
  ["10-admin-dashboard", "/admin"], ["11-admin-floors", "/admin/floors"],
  ["12-admin-room-types", "/admin/room-types"], ["13-admin-amenities", "/admin/amenities"],
  ["14-admin-rooms", "/admin/rooms"], ["15-admin-reservations", "/admin/reservations"],
  ["16-admin-bookings", "/admin/bookings"], ["17-admin-payments", "/admin/payments"],
  ["18-admin-reviews", "/admin/reviews"], ["19-admin-contacts", "/admin/contacts"],
  ["20-admin-feedbacks", "/admin/feedbacks"], ["21-admin-departments", "/admin/departments"],
  ["22-admin-staff-roles", "/admin/staff-roles"], ["23-admin-employees", "/admin/employees"],
  ["24-admin-work-types", "/admin/work-types"], ["25-admin-work-assignments", "/admin/work-assignments"],
  ["26-admin-users", "/admin/users"],
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const frames = fs.mkdtempSync(path.join(require("os").tmpdir(), "frames-"));

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: "new",
    defaultViewport: { width: W, height: H, deviceScaleFactor: 2 },
    args: ["--hide-scrollbars", "--force-device-scale-factor=2"],
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(45000);

  let n = 0;
  const shoot = async (name) => {
    await sleep(1200);
    await page.screenshot({ path: path.join(OUT, name + ".png"), fullPage: true });
    n += 1;
    await page.screenshot({ path: path.join(frames, String(n).padStart(2, "0") + ".png") });
    console.log("  ", name);
  };

  for (const [name, route] of PUBLIC) {
    await page.goto(BASE + route, { waitUntil: "networkidle2" });
    await shoot(name);
  }

  await page.goto(BASE + "/admin/login", { waitUntil: "networkidle2" });
  await shoot("09-admin-login");
  await page.type("#username", process.env.ADMIN_USER || "admin", { delay: 30 });
  await page.type("#password", process.env.ADMIN_PASS || "admin123", { delay: 30 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {}),
    page.click("button[type=submit]"),
  ]);
  await sleep(2000);

  for (const [name, route] of ADMIN) {
    await page.goto(BASE + route, { waitUntil: "networkidle2" });
    await shoot(name);
  }
  await browser.close();

  // full-page PNG -> compact JPG
  for (const f of fs.readdirSync(OUT).filter((f) => f.endsWith(".png"))) {
    const src = path.join(OUT, f);
    execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-i", src, "-qscale:v", "3",
      path.join(OUT, f.replace(/\.png$/, ".jpg"))]);
    fs.unlinkSync(src);
  }

  // fixed-size frames -> mp4
  const list = path.join(frames, "list.txt");
  const ordered = fs.readdirSync(frames).filter((f) => f.endsWith(".png")).sort();
  fs.writeFileSync(list, ordered.map((f) =>
    `file '${path.join(frames, f)}'\nduration ${DWELL}`).join("\n") +
    `\nfile '${path.join(frames, ordered[ordered.length - 1])}'\n`);
  execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list,
    "-vf", "scale=1920:1200:force_original_aspect_ratio=decrease,pad=1920:1200:(ow-iw)/2:(oh-ih)/2:color=0x0E7490,setsar=1,format=yuv420p",
    "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-movflags", "+faststart",
    path.join(DOCS, "walkthrough.mp4")]);
  fs.rmSync(frames, { recursive: true, force: true });

  console.log(`\nDone: ${n} screenshots -> docs/screenshots/, docs/walkthrough.mp4`);
})().catch((e) => { console.error(e); process.exit(1); });
