// Captures the frames of the README GIF from the live demo (headless Chrome, Puppeteer).
//   npm install puppeteer@25.16.0
//   node tools/capture_frames.mjs frames 0.69      # jump to 69 % of the recording (start of "Hard math")
//   python tools/make_gif.py frames assets/replay_hard_math.gif 86,62,1194,772
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const [out = "frames", frac = "0.69", url = "https://clementdumeril.github.io/clutch-demo/"] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1280, height: 860 } });
const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle0" });
await page.click('button[data-speed="5"]');
const box = await (await page.$("#timeline")).boundingBox();
await page.mouse.click(box.x + box.width * Number(frac), box.y + box.height / 2);
await new Promise((r) => setTimeout(r, 2000));
await page.evaluate(() => window.scrollTo(0, document.querySelector(".player").offsetTop - 62));
for (let i = 0; i < 40; i++) {
  await page.screenshot({ path: path.join(out, `f${String(i).padStart(2, "0")}.png`) });
  await new Promise((r) => setTimeout(r, 250));
}
console.log("phase:", await page.$eval("#phase-pill", (e) => e.textContent));
await browser.close();
