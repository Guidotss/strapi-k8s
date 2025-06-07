const Router = require('@koa/router');
const client = require('prom-client');

const router = new Router();

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5]
});


router.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const duration = (Date.now() - start) / 1000;
  httpRequestDurationMicroseconds
    .labels(ctx.method, ctx.path, ctx.status.toString())
    .observe(duration);
});

router.get('/metrics', async (ctx) => {
  ctx.set('Content-Type', client.register.contentType);
  ctx.body = await client.register.metrics();
});

module.exports = router;
