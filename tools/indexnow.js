// Ping IndexNow (Bing, Yandex, Seznam, Naver; Yahoo/DuckDuckGo/Ecosia follow Bing).
// Usage: node tools/indexnow.js [hubspot|main|all] [--changed]
//   hubspot = this repo's sitemap.xml -> hubspot.samcbarth.com
//   main    = live https://samcbarth.com/sitemap.xml (HubSpot-hosted)
//   --changed = only URLs whose <lastmod> is within the last 3 days
const fs = require('fs');
const path = require('path');

const KEY = fs.readdirSync(path.join(__dirname, '..')).find(f => /^[0-9a-f]{32}\.txt$/.test(f)).slice(0, -4);
const SITES = {
  hubspot: { host: 'hubspot.samcbarth.com', sitemap: () => fs.readFileSync(path.join(__dirname, '..', 'sitemap.xml'), 'utf8') },
  main: { host: 'samcbarth.com', sitemap: async () => (await fetch('https://samcbarth.com/sitemap.xml')).text() },
};

async function ping(name) {
  const { host, sitemap } = SITES[name];
  const xml = await sitemap();
  const cutoff = Date.now() - 3 * 864e5;
  let urls = [];
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(m[1]);
    const mod = /<lastmod>([^<]+)<\/lastmod>/.exec(m[1]);
    if (!loc) continue;
    if (process.argv.includes('--changed') && mod && Date.parse(mod[1]) < cutoff) continue;
    urls.push(loc[1].replace(/^https?:\/\/samcbarth\.com$/, 'https://samcbarth.com/'));
  }
  for (let i = 0; i < urls.length; i += 10000) {
    const body = { host, key: KEY, keyLocation: `https://${host}/${KEY}.txt`, urlList: urls.slice(i, i + 10000) };
    const r = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body),
    });
    console.log(`${host}: ${body.urlList.length} urls -> HTTP ${r.status} ${await r.text()}`);
  }
}

(async () => {
  const arg = process.argv[2];
  const names = !arg || arg.startsWith('--') || arg === 'all' ? Object.keys(SITES) : [arg];
  for (const n of names) await ping(n);
})();
