import { chromium } from "playwright";

const CAPTURES = [
  { id: "5535f3b3-68b6-4e29-bc5e-f368433eb13f", url: "http://localhost:5173/?scenario=full-onboarding&screen=onboarding-2&figma=1", name: "03 · Онбординг 2" },
  { id: "eafe9597-860b-4dd5-8e05-359787abdb42", url: "http://localhost:5173/?scenario=full-onboarding&screen=onboarding-3&figma=1", name: "04 · Онбординг 3" },
  { id: "76f90f27-1e44-442e-b3e7-bf0c7b111517", url: "http://localhost:5173/?scenario=full-onboarding&screen=onboarding-4&figma=1", name: "05 · Онбординг 4" },
  { id: "c0f4138d-b546-4077-b9b4-d13f189d441b", url: "http://localhost:5173/?scenario=multi-subject&screen=home&figma=1", name: "06 · Главный" },
  { id: "8641cf10-afbf-4f96-b452-77f604914276", url: "http://localhost:5173/?scenario=skipped&screen=home&figma=1", name: "07 · Главный (неполный)" },
  { id: "ed39d979-0080-4781-9269-2c447893a2da", url: "http://localhost:5173/?scenario=skipped&screen=lesson-collect&figma=1", name: "08 · Сбор профиля" },
  { id: "9ded9e3f-9536-407e-93f3-25b94960a670", url: "http://localhost:5173/?scenario=multi-subject&screen=lesson-context&figma=1", name: "09 · Выбор связки" },
  { id: "9d01056f-2329-4db8-a4ba-15e8e3fa8ed9", url: "http://localhost:5173/?scenario=multi-subject&screen=lesson-pick&figma=1", name: "10 · Выбор урока" },
  { id: "6d87ca05-ee15-4a1d-93f9-74a0c4486888", url: "http://localhost:5173/?scenario=multi-subject&screen=lesson-edit&figma=1", name: "11 · Редактирование" },
  { id: "ac16e860-92da-4fb6-88f4-8c6a7bebdcf2", url: "http://localhost:5173/?scenario=multi-subject&screen=lesson-generating&figma=1", name: "12 · Генерация" },
  { id: "db4cf2be-f547-4199-9b84-d01b40114f97", url: "http://localhost:5173/?scenario=multi-subject&screen=lesson-workspace&figma=1", name: "13 · Материалы урока" },
];

function captureUrl(base, captureId) {
  const endpoint = encodeURIComponent(`https://mcp.figma.com/mcp/capture/${captureId}/submit?bindVariables=true`);
  return `${base}#figmacapture=${captureId}&figmaendpoint=${endpoint}&figmadelay=2500`;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const item of CAPTURES) {
  console.log(`Capturing ${item.name}...`);
  await page.goto(captureUrl(item.url, item.id), { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(10000);
  console.log(`  submitted ${item.id}`);
}

await browser.close();
console.log("All hash captures triggered.");
