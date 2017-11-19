// const fetch = require('node-fetch');
const urljoin = require('url-join');
const qs = require('qs');

const utils = require('../utils');

function handleError(json) {
  if (json.error) {
    throw new Error(json.error);
  }

  return json;
}

function makeUrl(params) {
  const { apiKey } = params;
  const baseUrl = urljoin(params.host, params.version, params.resource, params.action);
  const query = Object.assign(utils.object.removeUndefined(params.payload), { apiKey });

  return urljoin(baseUrl, `?${qs.stringify(utils.object.toSnakeCaseKeys(query))}`);
}

function makeHeaders(params) {
  if (params.auth) {
    return { Authorization: params.auth };
  }

  return {};
}

function makeRequest(method, headers, url, payload) {
  var requestConfig = {
    method,
    headers
  }
  if(requestConfig.method.toLowerCase()=='post'){
    requestConfig.body=payload;
  }
  return fetch(url, requestConfig)
                .then(response => response.json())
                .then(handleError)
                .then(json => utils.object.toCamelCaseKeys(json));
}


module.exports = {
  handleError,
  makeUrl,
  makeHeaders,
  makeRequest,
};
