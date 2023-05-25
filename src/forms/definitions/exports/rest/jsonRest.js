import url from 'url';
import qs from 'query-string';
import { isNewId } from '../../../../utils/resource';
import { safeParse } from '../../../../utils/string';
import { LAST_EXPORT_DATE_TIME_REGEX_STRING } from '../../../../constants';

function isValidArray(value) {
  if (Array.isArray(value) && value[0]) {
    return true;
  }

  return false;
}

const restPreSave = formValues => {
  const retValues = { ...formValues };

  const restToHttpFieldMap = {
    '/rest/method': '/http/method',
    '/rest/blobMethod': '/http/blobMethod',
    '/rest/headers': '/http/headers',
    '/rest/resourcePath': '/http/response/resourcePath',
    '/rest/successPath': '/http/response/successPath',
    '/rest/successValues': '/http/response/successValues',
    '/rest/blobFormat': '/http/response/blobFormat',
    '/rest/once/relativeURI': '/http/once/relativeURI',
    '/rest/lastPageStatusCode': '/http/paging/lastPageStatusCode',
    '/rest/lastPagePath': '/http/paging/lastPagePath',
  };

  Object.keys(restToHttpFieldMap).forEach(restField => {
    const httpField = restToHttpFieldMap[restField];

    if (retValues[httpField]) {
      retValues[restField] = retValues[httpField];
    } else {
      retValues[restField] = undefined;
    }
    delete retValues[httpField];
  });

  if (retValues['/type'] === 'all') {
    retValues['/type'] = undefined;
    retValues['/test'] = undefined;
    retValues['/delta'] = undefined;
    retValues['/once'] = undefined;
    retValues['/rest/once'] = undefined;
    delete retValues['/test/limit'];
    delete retValues['/delta/dateFormat'];
    delete retValues['/delta/lagOffset'];
    delete retValues['/once/booleanField'];
    delete retValues['/rest/once/relativeURI'];
    delete retValues['/rest/once/postBody'];
    delete retValues['/rest/once/method'];
  } else if (retValues['/type'] === 'test') {
    retValues['/delta'] = undefined;
    retValues['/once'] = undefined;
    retValues['/rest/once'] = undefined;
    delete retValues['/delta/dateFormat'];
    delete retValues['/delta/lagOffset'];
    delete retValues['/once/booleanField'];
    delete retValues['/rest/once/relativeURI'];
    delete retValues['/rest/once/postBody'];
    delete retValues['/rest/once/method'];
  } else if (retValues['/type'] === 'delta') {
    retValues['/once'] = undefined;
    retValues['/rest/once'] = undefined;
    retValues['/test'] = undefined;
    delete retValues['/test/limit'];
    delete retValues['/once/booleanField'];
    delete retValues['/rest/once/relativeURI'];
    delete retValues['/rest/once/postBody'];
    delete retValues['/rest/once/method'];
  } else if (retValues['/type'] === 'once') {
    retValues['/delta'] = undefined;
    retValues['/test'] = undefined;
    delete retValues['/test/limit'];
    delete retValues['/delta/dateFormat'];
    delete retValues['/delta/lagOffset'];
  }

  if (
    retValues['/rest/successValues'] &&
    !retValues['/rest/successValues'].length
  ) {
    retValues['/rest/successValues'] = undefined;
  }

  if (retValues['/outputMode'] === 'blob') {
    retValues['/type'] = 'blob';
    retValues['/rest/method'] = retValues['/rest/blobMethod'];
  }

  delete retValues['/outputMode'];
  delete retValues['/rest/blobMethod'];

  if (retValues['/rest/pagingMethod'] === 'pageargument') {
    retValues['/rest/nextPageRelativeURI'] = undefined;
    retValues['/rest/nextPagePath'] = undefined;
    retValues['/rest/linkHeaderRelation'] = undefined;
    retValues['/rest/pagingPostBody'] = undefined;
    retValues['/rest/skipArgument'] = undefined;
  } else if (retValues['/rest/pagingMethod'] === 'nextpageurl') {
    retValues['/rest/linkHeaderRelation'] = undefined;
    retValues['/rest/nextPageRelativeURI'] = undefined;
    retValues['/rest/pagingPostBody'] = undefined;
    retValues['/rest/pageArgument'] = undefined;
    retValues['/rest/skipArgument'] = undefined;
    retValues['/rest/nextPagePath'] = retValues['/rest/nextPageURLPath'];
  } else if (retValues['/rest/pagingMethod'] === 'relativeuri') {
    retValues['/rest/nextPagePath'] = undefined;
    retValues['/rest/linkHeaderRelation'] = undefined;
    retValues['/rest/pagingPostBody'] = undefined;
    retValues['/rest/pageArgument'] = undefined;
    retValues['/rest/skipArgument'] = undefined;
  } else if (retValues['/rest/pagingMethod'] === 'linkheader') {
    retValues['/rest/nextPageRelativeURI'] = undefined;
    retValues['/rest/nextPagePath'] = undefined;
    retValues['/rest/pagingPostBody'] = undefined;
    retValues['/rest/pageArgument'] = undefined;
    retValues['/rest/skipArgument'] = undefined;
  } else if (retValues['/rest/pagingMethod'] === 'skipargument') {
    retValues['/rest/nextPageRelativeURI'] = undefined;
    retValues['/rest/nextPagePath'] = undefined;
    retValues['/rest/linkHeaderRelation'] = undefined;
    retValues['/rest/pagingPostBody'] = undefined;
    retValues['/rest/pageArgument'] = undefined;
  } else if (retValues['/rest/pagingMethod'] === 'token') {
    retValues['/rest/nextPageRelativeURI'] = undefined;
    retValues['/rest/linkHeaderRelation'] = undefined;
    retValues['/rest/pagingPostBody'] = undefined;
    retValues['/rest/skipArgument'] = undefined;
    retValues['/rest/nextPagePath'] = retValues['/rest/nextPageTokenPath'];
    retValues['/rest/pageArgument'] = retValues['/rest/tokenPageArgument'];
  } else if (retValues['/rest/pagingMethod'] === 'postbody') {
    retValues['/rest/nextPagePath'] = undefined;
    retValues['/rest/linkHeaderRelation'] = undefined;
    retValues['/rest/nextPageRelativeURI'] = undefined;
    retValues['/rest/pageArgument'] = undefined;
    retValues['/rest/skipArgument'] = undefined;
  } else {
    retValues['/rest/pagingMethod'] = undefined;
    retValues['/rest/nextPagePath'] = undefined;
    retValues['/rest/linkHeaderRelation'] = undefined;
    retValues['/rest/nextPageRelativeURI'] = undefined;
    retValues['/rest/pageArgument'] = undefined;
    retValues['/rest/skipArgument'] = undefined;
    retValues['/rest/maxPagePath'] = undefined;
    retValues['/rest/maxCountPath'] = undefined;
    retValues['/rest/lastPageStatusCode'] = undefined;
    retValues['/rest/lastPagePath'] = undefined;
    retValues['/rest/lastPageValue'] = undefined;
  }

  // delete UI only fields
  retValues['/rest/nextPageURLPath'] = undefined;
  retValues['/rest/tokenPageArgument'] = undefined;
  retValues['/rest/nextPageTokenPath'] = undefined;

  retValues['/http'] = undefined;
  retValues['/mockOutput'] = safeParse(retValues['/mockOutput']);

  return {
    ...retValues,
  };
};

export default {
  preSave: (formValues, resource, options = {}) => {
    const retValues = { ...formValues };
    const { connection } = options;

    // For Edit cases, if resource was originally created as REST export or if connection has isHTTP as false, save it as REST export
    if ((resource?.adaptorType === 'RESTExport' && resource._id && !isNewId(resource._id)) ||
        (resource?.['/adaptorType'] === 'RESTExport' && resource['/_id'] && !isNewId(resource['/_id'])) ||
         connection?.isHTTP === false
    ) {
      return restPreSave(formValues);
    }

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
      retValues['/test'] = undefined;
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
      retValues['/http/once'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/delta/dateFormat'];
      delete retValues['/delta/lagOffset'];
      delete retValues['/once/booleanField'];
      delete retValues['/http/once/relativeURI'];
      delete retValues['/rest/once/postBody'];
      delete retValues['/rest/once/method'];
    } else if (retValues['/type'] === 'test') {
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
      retValues['/http/once'] = undefined;
      delete retValues['/delta/dateFormat'];
      delete retValues['/delta/lagOffset'];
      delete retValues['/once/booleanField'];
      delete retValues['/http/once/relativeURI'];
      delete retValues['/rest/once/postBody'];
      delete retValues['/rest/once/method'];
    } else if (retValues['/type'] === 'delta') {
      retValues['/once'] = undefined;
      retValues['/http/once'] = undefined;
      retValues['/test'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/once/booleanField'];
      delete retValues['/http/once/relativeURI'];
      delete retValues['/rest/once/postBody'];
      delete retValues['/rest/once/method'];
    } else if (retValues['/type'] === 'once') {
      retValues['/delta'] = undefined;
      retValues['/test'] = undefined;
      retValues['/http/once/method'] = retValues['/rest/once/method'];
      retValues['/http/once/body'] = retValues['/rest/once/postBody'];
      delete retValues['/rest/once/method'];
      delete retValues['/rest/once/postBody'];
      delete retValues['/test/limit'];
      delete retValues['/delta/dateFormat'];
      delete retValues['/delta/lagOffset'];
    }

    retValues['/http/relativeURI'] = retValues['/rest/relativeURI'];
    delete retValues['/rest/relativeURI'];

    retValues['/http/body'] = retValues['/rest/postBody'];
    delete retValues['/rest/postBody'];

    const pagingMethodMap = {
      nextpageurl: 'url',
      pageargument: 'page',
      relativeuri: 'relativeuri',
      linkheader: 'linkheader',
      skipargument: 'skip',
      token: 'token',
      postbody: 'body',
    };

    retValues['/http/paging/method'] = pagingMethodMap[retValues['/rest/pagingMethod']];
    delete retValues['/rest/pagingMethod'];

    if (
      !retValues['/http/response/successValues'] || (retValues['/http/response/successValues'] &&
      !retValues['/http/response/successValues'].length)
    ) {
      retValues['/http/response/successValues'] = undefined;
    }

    if (!retValues['/http/response/successPath']) {
      retValues['/http/response/successPath'] = undefined;
    }
    if (retValues['/outputMode'] === 'blob') {
      retValues['/type'] = 'blob';
      retValues['/http/method'] = retValues['/http/blobMethod'];
    }

    delete retValues['/outputMode'];
    delete retValues['/http/blobMethod'];

    if (retValues['/http/paging/method'] === 'page') {
      retValues['/rest/nextPageURLPath'] = undefined;
      retValues['/rest/nextPageTokenPath'] = undefined;
      retValues['/http/paging/path'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/http/paging/body'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/rest/tokenPageArgument'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
    } else if (retValues['/http/paging/method'] === 'url') {
      retValues['/rest/nextPageTokenPath'] = undefined;
      retValues['/http/paging/path'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/http/paging/body'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/rest/tokenPageArgument'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/http/paging/path'] = retValues['/rest/nextPageURLPath'];
      delete retValues['/rest/nextPageURLPath'];
    } else if (retValues['/http/paging/method'] === 'relativeuri') {
      retValues['/rest/nextPageTokenPath'] = undefined;
      retValues['/rest/nextPageURLPath'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/http/paging/body'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/rest/tokenPageArgument'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
    } else if (retValues['/http/paging/method'] === 'linkheader') {
      retValues['/rest/nextPageTokenPath'] = undefined;
      retValues['/rest/nextPageURLPath'] = undefined;
      retValues['/http/paging/path'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/http/paging/body'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/rest/tokenPageArgument'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
    } else if (retValues['/http/paging/method'] === 'skip') {
      retValues['/rest/nextPageTokenPath'] = undefined;
      retValues['/rest/nextPageURLPath'] = undefined;
      retValues['/http/paging/path'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/http/paging/body'] = undefined;
      retValues['/rest/tokenPageArgument'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
    } else if (retValues['/http/paging/method'] === 'token') {
      retValues['/rest/nextPageURLPath'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/http/paging/body'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/http/paging/path'] = retValues['/rest/nextPageTokenPath'];
      delete retValues['/rest/nextPageTokenPath'];
    } else if (retValues['/http/paging/method'] === 'body') {
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/rest/nextPageTokenPath'] = undefined;
      retValues['/rest/nextPageURLPath'] = undefined;
      retValues['/http/paging/path'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
      retValues['/rest/tokenPageArgument'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
    } else {
      retValues['/http/paging/method'] = undefined;
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/body'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/rest/nextPageTokenPath'] = undefined;
      retValues['/rest/nextPageURLPath'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/rest/tokenPageArgument'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/maxPagePath'] = undefined;
      retValues['/rest/maxCountPath'] = undefined;
      retValues['/http/paging/lastPageStatusCode'] = undefined;
      retValues['/http/paging/lastPagePath'] = undefined;
      retValues['/rest/lastPageValue'] = undefined;
    }
    if (retValues['/rest/lastPageValue']) {
      retValues['/http/paging/lastPageValues'] = [retValues['/rest/lastPageValue']];
      delete retValues['/rest/lastPageValue'];
    } else {
      retValues['/http/paging/lastPageValues'] = undefined;
    }
    retValues['/http/paging/maxPagePath'] = retValues['/rest/maxPagePath'];
    retValues['/http/paging/maxCountPath'] = retValues['/rest/maxCountPath'];

    if (retValues['/http/paging/method'] === 'relativeuri') {
      retValues['/http/paging/relativeURI'] = retValues['/rest/nextPageRelativeURI'] || retValues['/http/relativeURI'];
      delete retValues['/rest/nextPageRelativeURI'];
    } else if (retValues['/http/paging/method'] === 'token') {
      const path = retValues['/http/relativeURI'].split('?')[0];
      const uriObj = url.parse(retValues['/http/relativeURI'], true);

      uriObj.search = null;
      if (retValues['/rest/tokenPageArgument']) {
        uriObj.query[retValues['/rest/tokenPageArgument']] = '{{{export.http.paging.token}}}';
      }
      const tp = qs.stringify(uriObj.query, { encode: false });

      retValues['/http/paging/relativeURI'] = `${path}?${tp}`; // url.format(uriObj) will encode the handlebar expression if present on relativeURI
      delete retValues['/rest/tokenPageArgument'];
    } else if (retValues['/http/paging/method'] === 'skip') {
      if (retValues['/http/relativeURI']) {
        const path = retValues['/http/relativeURI'].split('?')[0];
        const uriObj = url.parse(retValues['/http/relativeURI'], true);
        const skipArgument = retValues['/rest/skipArgument'] || 'skip';

        let tp;

        // eslint-disable-next-line eqeqeq
        if (uriObj.query[skipArgument] || uriObj.query[skipArgument] == 0) { // if url already contains ?skip=..
          retValues['/http/paging/skip'] = Number(uriObj.query[skipArgument]);
          uriObj.search = null;
          uriObj.query[skipArgument] = '{{{export.http.paging.skip}}}';
          tp = qs.stringify(uriObj.query, { encode: false });
          retValues['/http/paging/relativeURI'] = `${path}?${tp}`;
        } else {
          retValues['/http/paging/skip'] = 0;
          uriObj.search = null;
          tp = qs.stringify(uriObj.query, { encode: false });

          uriObj.query = {}; // adding '#' to the query parameters will urlencode it while formating the URL. The below logic will fail if the URL contains hash component
          // The REST skipArgument paging will not work if # component is present. Hence we can ignore hash scenario

          tp = `${((tp === '') ? '{{#compare export.http.paging.skip "!=" "0"}}?' : `?${tp}{{#compare export.http.paging.skip "!=" "0"}}&`) + skipArgument}={{export.http.paging.skip}}{{/compare}}`;
          retValues['/http/paging/relativeURI'] = path + tp;
        }

        retValues['/http/relativeURI'] = retValues['/http/paging/relativeURI'];
      }
      delete retValues['/rest/skipArgument'];
    } else if (retValues['/http/paging/method'] === 'page') {
      if (retValues['/http/relativeURI']) {
        const path = retValues['/http/relativeURI'].split('?')[0];
        const uriObj = url.parse(retValues['/http/relativeURI'], true);
        const pageArgument = retValues['/rest/pageArgument'] || 'page';
        let tp;

        if (uriObj.query[pageArgument]) { // if url already contains ?page=...
          retValues['/http/paging/page'] = Number(uriObj.query[pageArgument]);
          uriObj.search = null;
          uriObj.query[pageArgument] = '{{{export.http.paging.page}}}';

          tp = qs.stringify(uriObj.query, { encode: false });
          retValues['/http/paging/relativeURI'] = `${path}?${tp}`;
        } else {
          retValues['/http/paging/page'] = 1;
          uriObj.search = null;
          tp = qs.stringify(uriObj.query, { encode: false });

          uriObj.query = {}; // adding '#' to the query parameters will urlencode it while formating the URL. The below logic will fail if the URL contains hash component
          // The REST pageArgument paging will not work if # component is present. Hence we can ignore hash scenario

          tp = `${((tp === '') ? '{{#compare export.http.paging.page "!=" "1"}}?' : `?${tp}{{#compare export.http.paging.page "!=" "1"}}&`) + pageArgument}={{export.http.paging.page}}{{/compare}}`;
          retValues['/http/paging/relativeURI'] = path + tp;
        }

        retValues['/http/relativeURI'] = retValues['/http/paging/relativeURI'];
      }
      delete retValues['/rest/pageArgument'];
    } else if (retValues['/http/paging/method'] === 'linkheader' && retValues['/rest/linkHeaderRelation']) {
      retValues['/http/paging/linkHeaderRelation'] = retValues['/rest/linkHeaderRelation'];
      delete retValues['/rest/linkHeaderRelation'];
    } else if (retValues['/http/paging/method'] === 'body') {
      retValues['/http/paging/body'] = (typeof retValues['/rest/pagingPostBody'] === 'string') ? retValues['/rest/pagingPostBody'] : JSON.stringify(retValues['/rest/pagingPostBody']);
      delete retValues['/rest/pagingPostBody'];
    }

    if (retValues['/http/response/successPath'] && !isValidArray(retValues['/http/response/successPath'])) {
      retValues['/http/response/allowArrayforSuccessPath'] = true;
    } else {
      retValues['/http/response/allowArrayforSuccessPath'] = undefined;
    }
    // set the successMediaType on Export according to the connection
    // the request media-type is always json/urlencoded for REST, others are not supported in REST
    // CSV/XML media type could be successMediaTypes for REST Export
    retValues['/http/errorMediaType'] = 'json';
    retValues['/http/successMediaType'] = connection?.http?.successMediaType || connection?.rest?.mediaType || 'json';
    if (retValues['/http/successMediaType'] === 'urlencoded') {
      retValues['/http/successMediaType'] = 'json';
    }
    // we can also validate if method is other than GET or DELETE and throw an error in case of mediatype being XML/CSV
    // there shouldn't be successPath or failPath in REST docs when the mediatype is XML/CSV
    if (!retValues['/http/requestMediaType']) {
    // export.http.requestMediaType is a new property and a mandatory field when http method is POST or PUT.
    // If user tries to update and save an old export without requestMediaType field
    // then we need to set connection.http.mediaType as requestMediaType.
      if (typeof retValues['/http/method'] === 'string' && (retValues['/http/method'].toLowerCase() === 'post' || retValues['/http/method'].toLowerCase() === 'put')) {
        retValues['/http/requestMediaType'] = connection?.http?.successMediaType || connection?.rest?.mediaType;
      }
    }
    retValues['/adaptorType'] = 'HTTPExport';
    retValues['/http/formType'] = 'rest';
    delete retValues['/rest'];

    return {
      ...retValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (
      fieldId === 'http.once.relativeURI' ||
      fieldId === 'dataURITemplate' ||
      fieldId === 'http.relativeURI' ||
      fieldId === 'rest.once.postBody' ||
      fieldId === 'rest.postBody' ||
      fieldId === 'http.paging.body'
    ) {
      const nameField = fields.find(field => field.fieldId === 'name');

      return {
        resourceName: nameField && nameField.value,
      };
    }
  },
  fieldMap: {
    common: { formId: 'common' },
    outputMode: {
      id: 'outputMode',
      type: 'radiogroup',
      label: 'Output mode',
      required: true,
      visible: false,
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob keys', value: 'blob' },
          ],
        },
      ],
      defaultValue: r => {
        if (r.resourceType === 'lookupFiles' || r.type === 'blob') return 'blob';

        return 'records';
      },
    },
    'http.method': {
      fieldId: 'http.method',
    },
    'http.blobMethod': {
      fieldId: 'http.blobMethod',
    },
    'http.headers': { fieldId: 'http.headers' },
    'rest.relativeURI': {
      fieldId: 'rest.relativeURI',
      defaultValue: r => r?._rest?.relativeURI,
    },
    'rest.postBody': {
      fieldId: 'rest.postBody',
      defaultValue: r => r?.http?.body,
      visibleWhen: [{ field: 'http.method', is: ['POST', 'PUT'] }],
    },
    'http.response.resourcePath': { fieldId: 'http.response.resourcePath' },
    'http.response.successPath': { fieldId: 'http.response.successPath' },
    'http.response.successValues': { fieldId: 'http.response.successValues' },
    'http.response.blobFormat': { fieldId: 'http.response.blobFormat' },
    type: {
      id: 'type',
      type: 'selectwithvalidations',
      label: 'Export type',
      isLoggable: true,
      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        if (isNew) return '';
        const output = r && r.type;

        return output || 'all';
      },
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
      required: true,
      skipSort: true,
      options: [
        {
          items: [
            { label: 'All – always export all data', value: 'all' },
            { label: 'Delta – export only modified data',
              value: 'delta',
              regex: LAST_EXPORT_DATE_TIME_REGEX_STRING,
              description: 'Add {{lastExportDateTime}} to either the relative URI or HTTP request body to complete the setup.',
              helpKey: 'export.delta',
              fieldsToValidate: ['rest.relativeURI', 'rest.postBody'] },

            { label: 'Once – export records only once', value: 'once' },
            { label: 'Limit – export a set number of records', value: 'test' },
          ],
        },
      ],
    },
    'test.limit': {fieldId: 'test.limit'},
    'delta.dateFormat': {
      fieldId: 'delta.dateFormat',
    },
    'delta.lagOffset': {
      fieldId: 'delta.lagOffset',
    },
    'once.booleanField': {
      id: 'once.booleanField',
      type: 'textwithconnectioncontext',
      label: 'Boolean field to mark records as exported',
      isLoggable: true,
      visibleWhen: [{ field: 'type', is: ['once'] }],
      connectionId: r => r?._connectionId,
    },
    'http.once.relativeURI': {
      fieldId: 'http.once.relativeURI',
    },
    'rest.once.method': {
      fieldId: 'rest.once.method',
      defaultValue: r => r?.http?.once?.method,
      visibleWhen: [{ field: 'type', is: ['once'] }],
    },
    'rest.once.postBody': {
      fieldId: 'rest.once.postBody',
      visibleWhen: [{ field: 'type', is: ['once'] }],
      defaultValue: r => r?.http?.once?.body,
    },
    'rest.pagingMethod': {
      fieldId: 'rest.pagingMethod',
      defaultValue: r => r?._rest?.pagingMethod,
    },
    'rest.nextPageURLPath': {
      fieldId: 'rest.nextPageURLPath',
      defaultValue: r => r?._rest?.nextPagePath,
    },
    'rest.nextPageTokenPath': {
      fieldId: 'rest.nextPageTokenPath',
      defaultValue: r => r?._rest?.nextPagePath,
    },
    'rest.linkHeaderRelation': {
      fieldId: 'rest.linkHeaderRelation',
      defaultValue: r => r?._rest?.linkHeaderRelation,
    },
    'rest.skipArgument': {
      fieldId: 'rest.skipArgument',
      defaultValue: r => r?._rest?.skipArgument,
    },
    'rest.nextPageRelativeURI': {
      fieldId: 'rest.nextPageRelativeURI',
      defaultValue: r => r?._rest?.nextPageRelativeURI,
    },
    'rest.pageArgument': {
      fieldId: 'rest.pageArgument',
      defaultValue: r => r?._rest?.pageArgument,
    },
    'rest.tokenPageArgument': {
      fieldId: 'rest.tokenPageArgument',
      defaultValue: r => r?._rest?.pageArgument,
    },
    'rest.pagingPostBody': {
      fieldId: 'rest.pagingPostBody',
      defaultValue: r => r?._rest?.pagingPostBody,
    },
    'rest.maxPagePath': {
      fieldId: 'rest.maxPagePath',
      defaultValue: r => r?._rest?.maxPagePath,
    },
    'rest.maxCountPath': {
      fieldId: 'rest.maxCountPath',
      defaultValue: r => r?._rest?.maxCountPath,
    },
    'http.paging.lastPageStatusCode': { fieldId: 'http.paging.lastPageStatusCode' },
    'http.paging.lastPagePath': { fieldId: 'http.paging.lastPagePath' },
    'rest.lastPageValue': {
      fieldId: 'rest.lastPageValue',
      defaultValue: r => r?._rest?.lastPageValue,
    },
    exportOneToMany: { formId: 'exportOneToMany' },
    advancedSettings: {
      formId: 'advancedSettings',
    },
    formView: { fieldId: 'formView' },
    mockOutput: {fieldId: 'mockOutput'},
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['common', 'outputMode', 'exportOneToMany', 'formView'] },
      {
        collapsed: true,
        label: r => {
          if (r.resourceType === 'lookupFiles' || r.type === 'blob') return 'Where would you like to transfer from?';

          return 'What would you like to export?';
        },
        fields: [
          'http.method',
          'http.blobMethod',
          'rest.relativeURI',
          'http.headers',
          'rest.postBody',
          'http.response.blobFormat',
        ],
      },
      {
        collapsed: true,
        label: 'Configure export type',
        fields: [
          'type',
          'test.limit',
          'delta.dateFormat',
          'delta.lagOffset',
          'once.booleanField',
          'rest.once.method',
          'http.once.relativeURI',
          'rest.once.postBody',
        ],
      },
      {
        collapsed: true,
        label: 'Does this API use paging?',
        fields: [
          'rest.pagingMethod',
          'rest.nextPageURLPath',
          'rest.nextPageTokenPath',
          'rest.linkHeaderRelation',
          'rest.skipArgument',
          'rest.nextPageRelativeURI',
          'rest.pageArgument',
          'rest.tokenPageArgument',
          'rest.pagingPostBody',
          'rest.maxPagePath',
          'rest.maxCountPath',
          'http.paging.lastPageStatusCode',
          'http.paging.lastPagePath',
          'rest.lastPageValue',
        ],
      },
      {
        collapsed: true,
        label: 'Non-standard API response patterns',
        fields: [
          'http.response.resourcePath',
          'http.response.successPath',
          'http.response.successValues',
        ],
      },
      {
        collapsed: true,
        actionId: 'mockOutput',
        label: 'Mock output',
        fields: ['mockOutput'],
      },
      {
        collapsed: 'true',
        label: 'Advanced',
        fields: ['advancedSettings'],
      },
    ],
  },
};
