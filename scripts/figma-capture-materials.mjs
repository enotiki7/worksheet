import { chromium } from "playwright";

const CAPTURES = [
  {
    id: "ec686634-4db9-4c99-b82a-10cec65dcae4",
    label: "A · Главный",
    path: "/?scenario=materials-at-pick&figma=1&screen=home",
  },
  {
    id: "53fe6e21-e252-4750-a426-ef4a27d7c7cd",
    label: "A · Сбор профиля",
    path: "/?scenario=materials-at-pick&figma=1&screen=lesson-collect",
  },
  {
    id: "e2dc0cf9-d6c7-42b6-88a9-99a878ba13cb",
    label: "A · Выбор урока + библиотека",
    path: "/?scenario=materials-at-pick&figma=1&screen=lesson-pick",
  },
  {
    id: "bbf63256-36bf-4871-a324-7f9442069058",
    label: "B · Главный",
    path: "/?scenario=materials-at-edit&figma=1&screen=home",
  },
  {
    id: "e74312b5-2566-4cd6-9c99-27aa5bc5e9a2",
    label: "B · Сбор профиля",
    path: "/?scenario=materials-at-edit&figma=1&screen=lesson-collect",
  },
  {
    id: "6629fe53-a7d3-404b-9653-58914695f0f1",
    label: "B · Редактирование + библиотека",
    path: "/?scenario=materials-at-edit&figma=1&screen=lesson-edit",
  },
  {
    id: "ad31cc1e-b6b1-4502-bbaf-433a61bb8f74",
    label: "C · Главный",
    path: "/?scenario=materials-at-workspace&figma=1&screen=home",
  },
  {
    id: "dcf67ce0-80d7-419a-b999-3058dbba6fe7",
    label: "C · Сбор профиля",
    path: "/?scenario=materials-at-workspace&figma=1&screen=lesson-collect",
  },
  {
    id: "a9169b84-03d0-4ba4-a678-955c32809b24",
    label: "C · Рабочая область + библиотека",
    path: "/?scenario=materials-at-workspace&figma=1&screen=lesson-workspace",
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
