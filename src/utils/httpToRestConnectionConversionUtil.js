const _ = require('lodash');

/**
 * Generates rest sub document using http subdocument and
 * adds rest sub document to connection object and
 * changes connection.type to rest.
 * Note: In many test cases, plain normal js object is passed while creating export.
 * @param {object} conn - connection plain json object
 * @returns {object} - connection plain json object
 */
function convertConnJSONObjHTTPtoREST(conn) {
  if (!_.isEmpty(conn.http)) {
    /* eslint-disable no-param-reassign */
    /* eslint-disable no-use-before-define */
    conn.rest = generateConnectionRestSubDocFromHttpSubDoc(
      conn.http,
      conn.assistant
    );
    conn.type = 'rest';
    delete conn.http;
  }

  return conn;
}

/**
 * Converts HTTP connection subdocument to REST connection subdocument.
 *
 * @param {object} httpDoc - connection's rest subdocument
 * @param {object} assistantName - connection's assistantName
 * @returns {object} - connection's http subdocument
 */
function generateConnectionRestSubDocFromHttpSubDoc(httpDoc, assistantName) {
  const connPropMap = {
    mediaType: 'mediaType',
    baseURI: 'baseURI',
    disableStrictSSL: 'disableStrictSSL',
    retryHeader: 'retryHeader',
    headers: 'headers',
    encrypted_crypt: 'encrypted_crypt',
    encrypted_salt: 'encrypted_salt',
    encrypted: 'encrypted',
    encryptedFields: 'encryptedFields',
    unencrypted: 'unencrypted',
    _iClientId: '_iClientId',
    concurrencyLevel: 'concurrencyLevel',
    'ping.relativeURI': 'pingRelativeURI',
    'ping.method': 'pingMethod',
    'ping.body': 'pingBody',
    'ping.successPath': 'pingSuccessPath',
    'ping.successValues': 'pingSuccessValues',
    'ping.failurePath': 'pingFailurePath',
    'ping.failureValues': 'pingFailureValues',
    'auth.type': 'authType',
    'auth.basic.username': 'basicAuth.username',
    'auth.basic.password_crypt': 'basicAuth.password_crypt',
    'auth.basic.password_salt': 'basicAuth.password_salt',
    'auth.basic.password': 'basicAuth.password', // For test cases
    'auth.oauth.authURI': 'authURI',
    'auth.oauth.tokenURI': 'oauthTokenURI',
    'auth.oauth.scope': 'scope',
    'auth.oauth.scopeDelimiter': 'scopeDelimiter',
    'auth.oauth.accessTokenPath': 'oauth.accessTokenPath',
    'auth.oauth.grantType': 'oauth.grantType',
    'auth.oauth.username': 'oauth.username',
    'auth.oauth.password_crypt': 'oauth.password_crypt',
    'auth.oauth.password_salt': 'oauth.password_salt',
    'auth.oauth.password': 'oauth.password', // For test cases
    'auth.token.token_crypt': 'bearerToken_crypt',
    'auth.token.token_salt': 'bearerToken_salt',
    'auth.token.token': 'bearerToken', // For test cases
    'auth.token.headerName': 'authHeader',
    'auth.token.scheme': 'authScheme',
    'auth.token.location': 'tokenLocation',
    'auth.token.paramName': 'tokenParam',
    'auth.token.refreshMethod': 'refreshTokenMethod',
    'auth.token.refreshMediaType': 'refreshTokenMediaType',
    'auth.token.refreshRelativeURI': 'refreshTokenURI',
    'auth.token.refreshBody': 'refreshTokenBody',
    'auth.token.refreshTokenPath': 'refreshTokenPath',
    'auth.token.refreshHeaders': 'refreshTokenHeaders',
    'auth.token.refreshToken_crypt': 'refreshToken_crypt',
    'auth.token.refreshToken_salt': 'refreshToken_salt',
    'auth.token.refreshToken': 'refreshToken', // For test cases
    'auth.cookie.uri': 'cookieAuth.uri',
    'auth.cookie.body': 'cookieAuth.body',
    'auth.cookie.method': 'cookieAuth.method',
    'auth.cookie.successStatusCode': 'cookieAuth.successStatusCode',
  };
  let restDoc = {};

  _.forEach(connPropMap, (value, key) => {
    const restPath = value;
    const httpPath = key;

    extractAndSet(httpDoc, httpPath, restDoc, restPath);
  });

  // firstData uses HMAC and it should work fine without any custom logic here as the logic is already hardcoded - TBC
  // need to implement reverse logic for magento
  // need to handle media-types

  handleAssistantsHTTPtoREST(httpDoc, restDoc, assistantName);
  restDoc = _.cloneDeep(restDoc);
  replaceHTTPHandlebarExpression(restDoc);

  return restDoc;
}

function handleAssistantsHTTPtoREST(httpDoc, restDoc, assistantName) {
  if (!assistantName) {
    return;
  }

  if (assistantName === 'magento') {
    handleMagentoAssistantHTTPtoREST(httpDoc, restDoc);
  }
}

function handleMagentoAssistantHTTPtoREST(httpDoc, restDoc) {
  if (_.has(httpDoc, 'unencrypted') && httpDoc.unencrypted.username) {
    restDoc.basicAuth = restDoc.basicAuth || {};
    restDoc.basicAuth.username = httpDoc.unencrypted.username;
  }

  if (
    httpDoc &&
    httpDoc.auth &&
    httpDoc.auth.token &&
    httpDoc.auth.token.refreshBody
  ) {
    restDoc.refreshTokenBody =
      '{"username":"{{{connection.rest.basicAuth.username}}}", "password":"{{{connection.rest.encrypted.password}}}"}';
  }
}

function extractAndSet(source, sPath, target, tPath, ...prcs) {
  if (_.has(source, sPath)) {
    let sVal = _.get(source, sPath);

    if (prcs) {
      prcs.forEach(prc => {
        if (_.isFunction(prc)) {
          sVal = prc(sVal);
        }
      });
    }

    if (!_.isUndefined(sVal)) {
      _.set(target, tPath, sVal);
    }
  }
}

function replaceHTTPPlaceholdersinHandlebarstoREST(string) {
  if (!string) {
    return;
  }

  // search for indices at which this regex found and replace them accordingly
  const regexStr = /connection\.http\.+?/; // this should be changed based on the doc type. Exports and Imports can have references to connections and Exports/Imports

  /* eslint-disable no-cond-assign */
  while (regexStr.exec(string) !== null) {
    string = replaceHTTPrefWithCorrespondingREST(string);
  }

  return string;
}

function replaceHTTPHandlebarExpression(doc) {
  // iterate through array and process each key, value
  /* eslint-disable no-restricted-syntax */
  for (const key in doc) {
    if (typeof doc[key] === 'object') {
      if (_.isArray(doc[key])) {
        // iterate through array and process each value
        for (const idx in doc[key]) {
          if (typeof doc[key][idx] === 'object') {
            replaceHTTPHandlebarExpression(doc[key][idx]);
          } else {
            doc[key][idx] = replaceHTTPPlaceholdersinHandlebarstoREST(
              doc[key][idx]
            );
          }
        }
      } else {
        replaceHTTPHandlebarExpression(doc[key]);
      }
    } else {
      doc[key] = replaceHTTPPlaceholdersinHandlebarstoREST(doc[key]);
    }
  }
}

function replaceHTTPrefWithCorrespondingREST(str) {
  if (str.indexOf('connection.http.encrypted') !== -1) {
    return str.replace(
      'connection.http.encrypted',
      'connection.rest.encrypted'
    );
  } else if (str.indexOf('connection.http.unencrypted') !== -1) {
    return str.replace(
      'connection.http.unencrypted',
      'connection.rest.unencrypted'
    );
  } else if (str.indexOf('connection.http.auth.basic') !== -1) {
    return str.replace(
      'connection.http.auth.basic',
      'connection.rest.basicAuth'
    );
  } else if (str.indexOf('connection.http.auth.token.refreshToken') !== -1) {
    return str.replace(
      'connection.http.auth.token.refreshToken',
      'connection.rest.refreshToken'
    );
  } else if (str.indexOf('connection.http.auth.token.token') !== -1) {
    return str.replace(
      'connection.http.auth.token.token',
      'connection.rest.bearerToken'
    );
  }
}

exports.convertConnJSONObjHTTPtoREST = convertConnJSONObjHTTPtoREST;
