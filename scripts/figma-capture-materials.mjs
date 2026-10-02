import { chromium } from "playwright";

const CAPTURES = [
  {
    id: "ec686634-4db9-4c99-b82a-10cec65dcae4",
    label: "A · Главный",
    path: "/?scenario=materials-at-pick&figma=1&screen=home",
  },
  {
    id: "e2dc0cf9-d6c7-42b6-88a9-99a878ba13cb",
    label: "A · Подготовка урока + библиотека",
    path: "/?scenario=materials-at-pick&figma=1&screen=lesson-pick",
  },
  {
    id: "bbf63256-36bf-4871-a324-7f9442069058",
    label: "B · Главный",
    path: "/?scenario=materials-at-edit&figma=1&screen=home",
  },
  {
    id: "6629fe53-a7d3-404b-9653-58914695f0f1",
    label: "B · Редактирование + библиотека",
    path: "/?scenario=materials-at-edit&figma=1&screen=lesson-edit",
  },
];

function captureUrl(path, captureId) {
  const endpoint = encodeURIComponent(
    `https://mcp.figma.com/mcp/capture/${captureId}/submit?bindVariables=true`,
  );
  return `http://localhost:5173${path}#figmacapture=${captureId}&figmaendpoint=${endpoint}&figmadelay=2500`;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const submitted = [];

for (const item of CAPTURES) {
  const url = captureUrl(item.path, item.id);
  console.log(`Capturing: ${item.label}`);
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  await page.waitForSelector(".ta-app, .wf-app", { timeout: 15000 }).catch(() => undefined);
  await page.waitForTimeout(6000);
  submitted.push({ id: item.id, label: item.label });
  console.log(`Opened: ${item.label}`);
}

await browser.close();

console.log("\nSubmitted captures:");
for (const item of submitted) {
  console.log(`- ${item.label}: ${item.id}`);
}
