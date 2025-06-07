const strapi = require('@strapi/strapi');
const metricsRouter = require('./metrics');

strapi().start().then(app => {
  app.use(metricsRouter.routes()).use(metricsRouter.allowedMethods());
});
