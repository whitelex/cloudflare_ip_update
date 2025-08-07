
# Cloudflare IP Update

This Node.js app checks your machine's current public IP, compares it to the DNS A record on Cloudflare for multiple domains, and updates the record if they are different.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your details:
   ```env
   CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
   DOMAINS=example.com,anotherdomain.com
   ZONE_IDS=zoneid1,zoneid2
   EMAIL=your_cloudflare_email
   ```
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API token with DNS edit permissions.
   - `DOMAINS`: Comma-separated list of domains to check/update.
   - `ZONE_IDS`: Comma-separated list of corresponding Cloudflare Zone IDs for each domain.
   - `EMAIL`: (Optional) Cloudflare account email (if needed for legacy API auth).

## Usage

To run the app manually:
```sh
npm start
```
The app will check the public IP and update the A records on Cloudflare if needed.

## Setting Up a Cron Job (Linux/macOS)

To run the app automatically every minute:

1. Open your terminal.
2. Run:
   ```sh
   crontab -e
   ```
3. Add this line (replace the path as needed):
   ```cron
   * * * * * cd /path/to/cloudflare_ip_update && /usr/bin/node index.js >> cron.log 2>&1
   ```
   - Adjust `/usr/bin/node` to your Node.js path (use `which node` to find it).
   - Adjust `/path/to/cloudflare_ip_update` to your project directory.
   - This will run the script every minute and log output to `cron.log`.

## Setting Up Scheduled Task (Windows)

1. Open Task Scheduler.
2. Create a new task:
   - Action: Start a program
   - Program/script: `node`
   - Add arguments: `index.js`
   - Start in: `C:\path\to\cloudflare_ip_update`
3. Set the trigger to repeat every 1 minute.

---

**Note:** Your `.env` file and `node_modules` are ignored by git for security and cleanliness.
