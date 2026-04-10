# Mock Shipping Rates API

A simple mock REST API for testing Adobe Commerce checkout starter kit shipping method integration.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/rates` | Returns mock shipping rates |
| GET | `/api/health` | Health check |

## Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub

1. Create a new GitHub repo (e.g. `mock-shipping-rates-api`)
2. Push this folder to it:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/mock-shipping-rates-api.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to https://vercel.com and sign in (free account)
2. Click **Add New → Project**
3. Import your GitHub repo
4. Under **Environment Variables**, add:
   - `API_KEY` = any string you want (e.g. `my-secret-key-123`)
5. Click **Deploy**

Your API will be live at:
```
https://your-project.vercel.app/api/rates
```

### Step 3 — Update Commerce Admin UI

In your Adobe Commerce Admin:
- Go to **Apps → Tax management → Mock shipping rates**
- Set **Service URL** to: `https://your-project.vercel.app/api/rates`
- Set **API key** to the same value you set in Vercel's `API_KEY` env var
- Fill in the Warehouse address
- Click **Save configuration**

### Step 4 — Update your .env

Update `COMMERCE_WEBHOOKS_PUBLIC_KEY` if needed, and make sure `MOCK_RATES_ENCRYPTION_KEY` is set.

## Request format

Commerce sends this payload to your `/api/rates` endpoint:

```json
{
  "shipment": {
    "ship_to": {
      "name": "Customer",
      "address_line1": "123 Main St",
      "city_locality": "Los Angeles",
      "state_province": "CA",
      "postal_code": "90001",
      "country_code": "US"
    },
    "ship_from": {
      "name": "Warehouse",
      "address_line1": "456 Warehouse Blvd",
      "city_locality": "San Jose",
      "state_province": "CA",
      "postal_code": "95110",
      "country_code": "US"
    },
    "packages": [
      { "weight": { "value": 2.5, "unit": "pound" } }
    ]
  },
  "rate_options": {
    "carrier_ids": []
  }
}
```

## Response format

```json
{
  "success": true,
  "shipment_id": "ship_abc123xyz",
  "timestamp": "2026-04-10T20:00:00.000Z",
  "rates": [
    {
      "service_code": "mock_standard",
      "service_name": "Standard Shipping",
      "carrier_friendly_name": "USPS Ground",
      "shipping_amount": { "amount": "5.99", "currency": "USD" },
      "shipment_cost": { "amount": "5.99", "currency": "USD" },
      "cost": "5.99",
      "delivery_days": "3-5",
      "delivery_date": "2026-04-15"
    },
    {
      "service_code": "mock_express",
      "service_name": "Express Shipping",
      "carrier_friendly_name": "FedEx Overnight",
      "shipping_amount": { "amount": "12.99", "currency": "USD" },
      "shipment_cost": { "amount": "12.99", "currency": "USD" },
      "cost": "12.99",
      "delivery_days": "1-2",
      "delivery_date": "2026-04-12"
    }
  ]
}
```

## Local development

```bash
npm install
npm run dev
```

Then test locally:

```bash
curl -X POST http://localhost:3000/api/rates \
  -H "Content-Type: application/json" \
  -H "API-Key: mock-api-key-change-me" \
  -d '{"shipment":{"ship_to":{"country_code":"US"},"ship_from":{},"packages":[]},"rate_options":{"carrier_ids":[]}}'
```
