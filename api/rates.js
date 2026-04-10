/*
 * Mock Shipping Rates API
 * Vercel serverless function — returns mock shipping rates
 * for use with Adobe Commerce checkout starter kit.
 *
 * Expected request:
 *   POST /api/rates
 *   Headers: API-Key: <your-api-key>
 *   Body: { shipment: { ship_to, ship_from, packages }, rate_options }
 *
 * Response:
 *   { success: true, rates: [...], shipment_id, timestamp }
 */

const VALID_API_KEY = process.env.API_KEY || 'mock-api-key-change-me';

/**
 * Generates a random shipment ID
 * @returns {string}
 */
function generateShipmentId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = 'ship_';
  for (let i = 0; i < 9; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/**
 * Validates the incoming request
 * @param {import('@vercel/node').VercelRequest} req
 * @returns {{ valid: boolean, error?: string }}
 */
function validateRequest(req) {
  // Check HTTP method
  if (req.method !== 'POST') {
    return { valid: false, error: `Method ${req.method} not allowed. Use POST.` };
  }

  // Check API key
  const apiKey = req.headers['api-key'] || req.headers['API-Key'];
  if (!apiKey) {
    return { valid: false, error: 'Missing API-Key header.' };
  }
  if (apiKey !== VALID_API_KEY) {
    return { valid: false, error: 'Invalid API key.' };
  }

  // Check body
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object.' };
  }
  if (!body.shipment) {
    return { valid: false, error: 'Missing required field: shipment.' };
  }
  if (!body.shipment.ship_to) {
    return { valid: false, error: 'Missing required field: shipment.ship_to.' };
  }

  return { valid: true };
}

/**
 * Calculates a delivery date N days from now
 * @param {number} days
 * @returns {string} ISO date string YYYY-MM-DD
 */
function deliveryDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Main Vercel handler
 * @param {import('@vercel/node').VercelRequest} req
 * @param {import('@vercel/node').VercelResponse} res
 */
export default function handler(req, res) {
  // Log incoming request for debugging
  console.log(`[mock-rates] ${req.method} ${req.url}`);
  console.log(`[mock-rates] Headers:`, JSON.stringify(req.headers));
  console.log(`[mock-rates] Body:`, JSON.stringify(req.body));

  // Validate
  const { valid, error } = validateRequest(req);
  if (!valid) {
    console.error(`[mock-rates] Validation failed: ${error}`);
    return res.status(400).json({ success: false, error });
  }

  // Build mock rates response
  const response = {
    success: true,
    shipment_id: generateShipmentId(),
    timestamp: new Date().toISOString(),
    rates: [
      {
        service_code: 'mock_standard',
        service_name: 'Standard Shipping',
        carrier_friendly_name: 'USPS Ground',
        shipping_amount: {
          amount: '5.99',
          currency: 'USD',
        },
        shipment_cost: {
          amount: '5.99',
          currency: 'USD',
        },
        cost: '5.99',
        delivery_days: '3-5',
        delivery_date: deliveryDate(5),
      },
      {
        service_code: 'mock_express',
        service_name: 'Express Shipping',
        carrier_friendly_name: 'FedEx Overnight',
        shipping_amount: {
          amount: '12.99',
          currency: 'USD',
        },
        shipment_cost: {
          amount: '12.99',
          currency: 'USD',
        },
        cost: '12.99',
        delivery_days: '1-2',
        delivery_date: deliveryDate(2),
      },
    ],
  };

  console.log(`[mock-rates] Returning ${response.rates.length} rates`);
  return res.status(200).json(response);
}
