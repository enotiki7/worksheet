import { chromium } from "playwright";

const PORT = process.env.PORT || "5180";

const CAPTURES = [
  { id: "9fb217ae-6e49-4098-b777-88a1aea731a7", label: "02 · Онбординг 1", path: "/?scenario=full-onboarding&figma=1&screen=onboarding-1", wait: 3500 },
  { id: "82372231-42d5-4698-9118-60daf841d4ab", label: "03 · Онбординг 2", path: "/?scenario=full-onboarding&figma=1&screen=onboarding-2", wait: 3500 },
  { id: "af139ebf-3222-4c8b-a1e5-581d2ef0cc4e", label: "04 · Главный", path: "/?scenario=full-onboarding&figma=1&screen=home", wait: 3500 },
  { id: "31465a8c-1702-4c6d-ba73-71bee245467a", label: "05 · Подготовка урока", path: "/?scenario=full-onboarding&figma=1&screen=lesson-pick", wait: 5000 },
  { id: "b738bef1-ea8c-461a-b238-997e9278a05e", label: "06 · Редактирование", path: "/?scenario=full-onboarding&figma=1&screen=lesson-edit", wait: 3500 },
  { id: "753015ff-fe21-4b0c-a71f-9a987b7c9d28", label: "07 · Генерация", path: "/?scenario=full-onboarding&figma=1&screen=lesson-generating", wait: 3500 },
  { id: "0059ef50-596f-4681-85fc-a76af00d6f34", label: "08 · Материалы урока", path: "/?scenario=full-onboarding&figma=1&screen=lesson-workspace", wait: 3500 },
];

function captureUrl(item) {
  const endpoint = encodeURIComponent(
    `https://mcp.figma.com/mcp/capture/${item.id}/submit?bindVariables=true`,
  );
  const hash = `figmacapture=${item.id}&figmaendpoint=${endpoint}&figmadelay=${item.wait}`;
  return `http://localhost:${PORT}${item.path}#${hash}`;
}

async function capturePage(browser, item) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const url = captureUrl(item);

  console.log(`Opening: ${item.label}`);
  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
    await page.waitForSelector(".ta-app, .wf-app", { timeout: 20000 });
    // figmadelay handles pre-capture wait; add buffer for submit
    await page.waitForTimeout(item.wait + 8000);
    console.log(`  done ${item.id}`);
  } catch (err) {
    console.error(`  failed ${item.id}:`, err.message);
  } finally {
    await page.close();
  }
}

const browser = await chromium.launch({ headless: true });

await Promise.all(CAPTURES.map((item) => capturePage(browser, item)));

await browser.close();
console.log("\nAll remaining full-onboarding captures submitted to y9A5pbabByLvwHlcpMAmlJ (node 22342:4722).");
