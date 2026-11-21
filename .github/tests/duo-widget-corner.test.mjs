// ركن ودجت iPhone Duo: صفحات الموقع ثابتة بلا علامات Duo، فلا يجوز أن تحجز ركناً بحجم النافذة وحده.
// الحجز بالعرض وحده كان يطابق كل iPhone عادي (390–430) ونافذة الحاسوب الضيقة فيترك شريطاً فارغاً بنحو 124px على اليمين.
// التشغيل: node --test .github/tests/duo-widget-corner.test.mjs
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const ROOT = new URL('../../', import.meta.url).pathname;
const pages = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === 'node_modules') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) pages.push(p);
  }
};
walk(ROOT);

test('الصفحات موجودة', () => assert.ok(pages.length >= 4, `وُجدت ${pages.length} صفحات فقط`));

for (const page of pages) {
  test(`${page.slice(ROOT.length)}: لا حجز لركن الودجت بحجم النافذة وحده`, () => {
    const css = readFileSync(page, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of css.matchAll(/@media([^{]*)\{((?:[^{}]*\{[^{}]*\})*[^{}]*)\}/g)) {
      const body = m[2];
      // متغير حجز غير صفري (--widget أو --duo-widget-* أو --duo-cutout-*) داخل استعلام حجم.
      const reserve = body.match(/--(?:widget|duo-widget-[\w-]+|duo-cutout-[\w-]+)\s*:\s*(?!0px\b)[^;}]+/);
      assert.equal(reserve, null, `حجز بحجم النافذة وحده في @media${m[1]}: ${reserve && reserve[0]}`);
    }
    // ولا حشوة ثابتة بقيمة الركن القديمة على الرأس أو البطل.
    assert.doesNotMatch(css, /padding-right:calc\([^)]*(?:104px|96px|116px)/, 'حشوة ثابتة بقيمة ركن الودجت');
  });
}
