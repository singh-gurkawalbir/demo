/* eslint-disable no-cond-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
import has from 'lodash/has';
import get from 'lodash/get';
import set from 'lodash/set';
import isFunction from 'lodash/isFunction';

function isValidArray(value) {
  if (Array.isArray(value) && value[0]) {
    return true;
  }

  return false;
}

function forEachPlaceHolder(srcString, prcs, options = {}) {
  const strParts = srcString.split(/({{+|}}+)/);
  const placeHolderIndexes = [];
  let ot = -1;
  let ct = -1;

  for (let i = 0; i < strParts.length; i += 1) {
    const str = strParts[i];

    if (ot === -1) {
      if (/{{+/.test(str)) {
        ot = i;
      } else {
        continue;
      }
    } else if (/}}+/.test(str)) {
      ct = i;
      if (strParts[ot].length !== strParts[ct].length) return str; // invalid placeholder i.e. {{..}}} or {{{..}}
      placeHolderIndexes.push(ot + 1);
      // eslint-disable-next-line no-multi-assign
      ot = ct = -1;
      continue;
    } else {
      if (/{{+/.test(str)) return str; // invalid placeholer i.e. two {{'s before }} - no need to process
      continue;
    }
  }

  placeHolderIndexes.forEach(i => {
    const placeHolderText = strParts[i];

    strParts[i] = prcs(placeHolderText, options);
  });

  return strParts.join('');
}

function getStringtoAddLookupPrefix(srcString, lookupName) {
  const strLength = srcString.length;

  for (let idx = 0; idx < strLength; idx += 1) {
    if (srcString[idx] === '[') {
      // eslint-disable-next-line no-plusplus
      let startIdx = idx++;

      let endIdx;

      while (idx < strLength && srcString[idx] !== ']') {
        if (srcString[idx] === '[') {
          startIdx = idx;
        }
        idx += 1;
      }

      if (idx === strLength) {
        return;
      } if (srcString[idx] === ']') {
        endIdx = idx;
      }

      const currSubString = srcString.substring(startIdx, endIdx + 1);

      if (currSubString && currSubString.includes(lookupName)) {
        return currSubString;
      }
    }
  }
}

function updateLookupField(srcString, options = {}) {
  const {lookupName} = options;

  if (!lookupName) return srcString;

  if (srcString.trim().length === 0) return srcString;

  if (lookupName.trim().includes(' ') && srcString.includes(lookupName)) {
    const replaceString = getStringtoAddLookupPrefix(srcString, lookupName);

    if (!replaceString) {
      // this shouldn't occur
      return srcString;
    }

    const resultStr = srcString.replace(replaceString, `lookup.${replaceString}`);

    return resultStr;
  }
  const stringTokens = srcString.split(/ +/);

  for (let i = 0; i < stringTokens.length; i += 1) {
    const token = stringTokens[i];

    if (lookupName === token) {
      stringTokens[i] = `lookup.${token}`;
    }
  }

  return stringTokens.join(' ');
}

function replaceLookupFieldsInPlaceHolders(lookupName, value) {
  if (typeof value === 'string') {
    return forEachPlaceHolder(value, updateLookupField, { lookupName });
  } if (Array.isArray(value)) {
    return value.map(item => replaceLookupFieldsInPlaceHolders(lookupName, item));
  }

  return value;
}

function constructLookupPlaceHolder(lookupName, httpDoc, path, options) {
  if (has(httpDoc, path)) {
    const destVal = get(httpDoc, path);

    const tempLookupValue = replaceLookupFieldsInPlaceHolders(lookupName, destVal, options);

    set(httpDoc, path, tempLookupValue);
  }
}

function restValidPlaceHoldersExists(str) {
  if (str.indexOf('connection.rest.encrypted') !== -1 || str.indexOf('connection.rest.unencrypted') !== -1 || str.indexOf('connection.rest.basicAuth') !== -1 ||
  str.indexOf('connection.rest.refreshToken') !== -1 || str.indexOf('connection.rest.bearerToken') !== -1) {
    return true;
  }

  return false;
}

function replaceRESTrefWithCorrespondingHTTP(str) {
  if (str.indexOf('connection.rest.encrypted') !== -1) {
    return str.replace('connection.rest.encrypted', 'connection.http.encrypted');
  } if (str.indexOf('connection.rest.unencrypted') !== -1) {
    return str.replace('connection.rest.unencrypted', 'connection.http.unencrypted');
  } if (str.indexOf('connection.rest.basicAuth') !== -1) {
    return str.replace('connection.rest.basicAuth', 'connection.http.auth.basic');
  } if (str.indexOf('connection.rest.refreshToken') !== -1) {
    return str.replace('connection.rest.refreshToken', 'connection.http.auth.token.refreshToken');
  } if (str.indexOf('connection.rest.bearerToken') !== -1) {
    return str.replace('connection.rest.bearerToken', 'connection.http.auth.token.token');
  }
}

function replaceRestPlaceholdersinHandlebarstoHTTP(string) {
  if (!string) {
    return string;
  }

  // search for valid rest placeholder refs and replace them with corresponding http placeholders
  while (restValidPlaceHoldersExists(string)) {
    // eslint-disable-next-line no-param-reassign
    string = replaceRESTrefWithCorrespondingHTTP(string);
  }

  return string;
}

function replaceRESTHandlebarExpression(doc, options = {}) {
  // iterate through array and process each key, value
  for (const key in doc) {
    if (typeof doc[key] === 'object') {
      if (Array.isArray(doc[key])) {
        // iterate through array and process each value
        for (const idx in doc[key]) {
          if (typeof doc[key][idx] === 'object') {
            // added the below if block as the json doc might have few mongoose elements in it
            if (!doc[key][idx] || isFunction(doc[key][idx].toObject)) {
              continue;
            }
            replaceRESTHandlebarExpression(doc[key][idx], options);
          } else if (typeof doc[key][idx] === 'string') {
            // eslint-disable-next-line no-param-reassign
            doc[key][idx] = replaceRestPlaceholdersinHandlebarstoHTTP(doc[key][idx], options);
          }
        }
      } else {
        replaceRESTHandlebarExpression(doc[key], options);
      }
    } else if (typeof doc[key] === 'string') {
      // eslint-disable-next-line no-param-reassign
      doc[key] = replaceRestPlaceholdersinHandlebarstoHTTP(doc[key], options);
    }
  }
}

function convertImportJSONObjRESTtoHTTP(imp) {
  const httpSubDoc = imp.http;

  if (!has(httpSubDoc, 'body') || !Array.isArray(httpSubDoc.body) || !httpSubDoc.body.length || !isValidArray(httpSubDoc.body)) {
    httpSubDoc.sendPostMappedData = true;
  }
  httpSubDoc.batchSize = 1;
  httpSubDoc.strictHandlebarEvaluation = true;

  if (Array.isArray(httpSubDoc.lookups)) {
    httpSubDoc.lookups.forEach(lookup => {
      if (lookup) {
        // HTTP imports do not allow lookup to have default value (in validation itself) if allowFailures is set to false.
        // whereas REST did not have any such strict check but in code we do not respect default value if allowFailures is
        // set to false. Since we have some docs with this combination we are taking care of them in conversion logic.
        if (lookup.allowFailures === false) {
          // eslint-disable-next-line no-param-reassign
          delete lookup.default;
        }

        if (!has(lookup, 'useImportHeaders')) {
          // eslint-disable-next-line no-param-reassign
          lookup.useImportHeaders = false;
        }
        constructLookupPlaceHolder(lookup.name, httpSubDoc, 'body');
        constructLookupPlaceHolder(lookup.name, httpSubDoc, 'relativeURI');
      }
    });
  }

  replaceRESTHandlebarExpression(httpSubDoc, { type: 'import'});

  return imp;
}

exports.convertImportJSONObjRESTtoHTTP = convertImportJSONObjRESTtoHTTP;
