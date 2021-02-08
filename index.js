const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const config = require('./config.json');
const { createProxyMiddleware } = require('http-proxy-middleware');
const addQueryStringParameter = require('./utils/addQueryStringParameter.js');

const app = express();
const PORT = config.port || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimit(config['rate-limit']));

config.list.forEach((route) => {
  const [apiKeyParamName, apiKeyParamValue] = route.api_key_param.split('=');

  const proxyMiddleware = createProxyMiddleware({
    target: route.api_base_url,
    changeOrigin: true,
    pathRewrite: function (path, req) {
      const pathWithoutKeyWord = path.replace(`${route.proxy_route}/`, '');
      const pathWithAPIKeyParam = addQueryStringParameter(
        pathWithoutKeyWord,
        apiKeyParamName,
        apiKeyParamValue
      );

      return pathWithAPIKeyParam;
    },
  });

  app.all(`/${route.proxy_route}/*`, proxyMiddleware);
});

app.listen(PORT, () => {
  console.log(`Running proxy server at port ${PORT}`);
});
