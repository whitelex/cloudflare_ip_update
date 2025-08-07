require('dotenv').config();
const axios = require('axios');

const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DOMAINS = process.env.DOMAINS ? process.env.DOMAINS.split(',') : [];
const ZONE_IDS = process.env.ZONE_IDS ? process.env.ZONE_IDS.split(',') : [];
const EMAIL = process.env.EMAIL;

if (!API_TOKEN || DOMAINS.length === 0 || ZONE_IDS.length === 0) {
  console.error('Missing required .env configuration.');
  process.exit(1);
}

async function getPublicIP() {
  const res = await axios.get('https://api.ipify.org?format=json');
  return res.data.ip;
}

async function getDNSRecord(zoneId, domain) {
  const res = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?type=A&name=${domain}`,
    { headers: { Authorization: `Bearer ${API_TOKEN}` } });
  return res.data.result[0];
}

async function updateDNSRecord(zoneId, recordId, domain, ip) {
  await axios.put(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`,
    { type: 'A', name: domain, content: ip, ttl: 1, proxied: false },
    { headers: { Authorization: `Bearer ${API_TOKEN}` } });
}

(async () => {
  const publicIP = await getPublicIP();
  for (let i = 0; i < DOMAINS.length; i++) {
    const domain = DOMAINS[i].trim();
    const zoneId = ZONE_IDS[i].trim();
    try {
      const record = await getDNSRecord(zoneId, domain);
      if (!record) {
        console.log(`No A record found for ${domain}`);
        continue;
      }
      if (record.content !== publicIP) {
        await updateDNSRecord(zoneId, record.id, domain, publicIP);
        console.log(`Updated ${domain} A record to ${publicIP}`);
      } else {
        console.log(`${domain} A record is up to date.`);
      }
    } catch (err) {
      console.error(`Error processing ${domain}:`, err.response ? err.response.data : err.message);
    }
  }
})();
