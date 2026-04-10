/**
 * Health check endpoint
 * GET /api/health
 */
export default function handler(req, res) {
  return res.status(200).json({
    status: 'ok',
    service: 'mock-shipping-rates-api',
    timestamp: new Date().toISOString(),
  });
}
