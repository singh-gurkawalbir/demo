import { isNewId, finalSuccessMediaType } from '../../../utils/resource';
import { safeParse } from '../../../utils/string';
import { initializeHttpForm } from '../../metaDataUtils/httpConnectorUtils';

export default {
  init: initializeHttpForm,
  preSave: (formValues, _, { connection } = {}) => {
    const retValues = { ...formValues };

    if (retValues['/http/successMediaType'] === 'csv') {
      retValues['/file/type'] = 'csv';
    } else if (
      retValues['/http/successMediaType'] === 'json' ||
      retValues['/http/successMediaType'] === 'xml'
    ) {
      delete retValues['/file/csv/rowsToSkip'];
      delete retValues['/file/csv/trimSpaces'];
      delete retValues['/file/csv/columnDelimiter'];
      delete retValues['/file/csv/rowDelimiter'];
      delete retValues['/file/csv/hasHeaderRow'];
      delete retValues['/file/csv/rowsPerRecord'];
      delete retValues['/file/csv/keyColumns'];
      retValues['/file'] = undefined;
      delete retValues['/file/type'];
      delete retValues['/file/csv/rowsToSkip'];
      delete retValues['/file/csv/trimSpaces'];
      delete retValues['/file/csv/columnDelimiter'];
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
      delete retValues['/http/once/body'];
      delete retValues['/http/once/method'];
    } else if (retValues['/type'] === 'test') {
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
      retValues['/http/once'] = undefined;
      delete retValues['/delta/dateFormat'];
      delete retValues['/delta/lagOffset'];
      delete retValues['/once/booleanField'];
      delete retValues['/http/once/relativeURI'];
      delete retValues['/http/once/body'];
      delete retValues['/http/once/method'];
    } else if (retValues['/type'] === 'delta') {
      retValues['/once'] = undefined;
      retValues['/test'] = undefined;
      retValues['/http/once'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/once/booleanField'];
      delete retValues['/http/once/relativeURI'];
      delete retValues['/http/once/body'];
      delete retValues['/http/once/method'];
    } else if (retValues['/type'] === 'once') {
      retValues['/delta'] = undefined;
      retValues['/test'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/delta/dateFormat'];
      delete retValues['/delta/lagOffset'];
    }

    if (
      retValues['/http/response/successValues'] &&
      !retValues['/http/response/successValues'].length
    ) {
      retValues['/http/response/successValues'] = undefined;
    }

    if (retValues['/http/response/successPath'] === '') {
      retValues['/http/response/successPath'] = undefined;
    }
    if (retValues['/http/response/successValues'] === '') {
      retValues['/http/response/successValues'] = undefined;
    }
    if (
      retValues['/http/response/failValues'] &&
      !retValues['/http/response/failValues'].length
    ) {
      retValues['/http/response/failValues'] = undefined;
    }

    if (retValues['/http/response/failPath'] === '') {
      retValues['/http/response/failPath'] = undefined;
    }
    if (retValues['/http/response/failValues'] === '') {
      retValues['/http/response/failValues'] = undefined;
    }

    if (retValues['/http/successMediaType'] === 'csv' ||
      (retValues['/http/response/successValues'] === undefined &&
      retValues['/http/response/successPath'] === undefined &&
      retValues['/http/response/failValues'] === undefined &&
      retValues['/http/response/failPath'] === undefined &&
      retValues['/http/response/resourcePath'] === '' &&
      retValues['/http/response/errorPath'] === ''
      )) {
      retValues['/http/response'] = undefined;
      delete retValues['/http/response/resourcePath'];
      delete retValues['/http/response/successValues'];
      delete retValues['/http/response/successPath'];
      delete retValues['/http/response/failValues'];
      delete retValues['/http/response/failPath'];
      delete retValues['/http/response/errorPath'];
    }

    if (retValues['/outputMode'] === 'blob') {
      retValues['/type'] = 'blob';
      retValues['/http/method'] = retValues['/http/blobMethod'];
    }
    if (retValues['/http/requestMediaType'] === ' ' || !retValues['/http/requestMediaType']) {
      retValues['/http/requestMediaType'] = undefined;
    }
    if (!retValues['/http/successMediaType']) {
      retValues['/http/successMediaType'] = undefined;
    }
    if (!retValues['/http/errorMediaType']) {
      retValues['/http/errorMediaType'] = undefined;
    }
    delete retValues['/http/blobMethod'];
    delete retValues['/outputMode'];

    if (retValues['/http/paging/method'] === 'page') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'url') {
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'relativeuri') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'linkheader') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'skip') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'token') {
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'body') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
    } else {
      retValues['/http/paging'] = undefined;
      delete retValues['/http/paging/method'];
      delete retValues['/http/paging/path'];
      delete retValues['/http/paging/relativeURI'];
      delete retValues['/http/paging/resourcePath'];
      delete retValues['/http/paging/token'];
      delete retValues['/http/paging/linkHeaderRelation'];
      delete retValues['/http/paging/skip'];
      delete retValues['/http/paging/pathAfterFirstRequest'];
      delete retValues['/http/paging/page'];
      delete retValues['/http/paging/maxPagePath'];
      delete retValues['/http/paging/maxCountPath'];
      delete retValues['/http/paging/body'];
      delete retValues['/http/paging/lastPageStatusCode'];
      delete retValues['/http/paging/lastPagePath'];
      delete retValues['/http/paging/lastPageValues'];
    }

    retValues['/statusExport'] = undefined;

    // we need 2 separate UI fields for path for url and token paging methods
    // to have diff help texts and labels
    if (retValues['/http/paging/method'] === 'url') {
      retValues['/http/paging/path'] = retValues['/http/paging/urlPath'];
    } else if (retValues['/http/paging/method'] === 'token') {
      retValues['/http/paging/path'] = retValues['/http/paging/tokenPath'];
    }
    delete retValues['/http/paging/urlPath'];
    delete retValues['/http/paging/tokenPath'];

    if (connection?.http?.type === 'Amazon-SP-API') {
      retValues['/unencrypted/apiType'] = 'Amazon-SP-API';
    }

    if (finalSuccessMediaType(formValues, connection) === 'xml' && retValues['/parsers']?.resourcePath !== '') {
      retValues['/http/response/resourcePath'] = retValues['/parsers'].resourcePath;
    }
    const parseStrategy = retValues['/parsers']?.[0]?.rules?.['V0_json'];

    if (finalSuccessMediaType(formValues, connection) !== 'xml' || parseStrategy) {
      retValues['/parsers'] = undefined;
    }
    if (finalSuccessMediaType(formValues, connection) === 'csv') {
      delete retValues['/http/response/resourcePath'];
      retValues['/http/response'] = undefined;
    }

    if (!retValues['/configureAsyncHelper']) {
      retValues['/http/_asyncHelperId'] = undefined;
    }
    retValues['/adaptorType'] = 'HTTPExport';

    retValues['/mockOutput'] = safeParse(retValues['/mockOutput']);

    return {
      ...retValues,
    };
  },

  optionsHandler: (fieldId, fields) => {
    if (fieldId !== 'http.body' && fieldId !== 'http.once.body') {
      return null;
    }

    const bodyFields = [];
    let requestMediaTypeField = {};

    fields.map(field => {
      if (field.fieldId === 'http.body' || field.fieldId === 'http.once.body') {
        bodyFields.push(field);
      } else if (field.fieldId === 'http.requestMediaType') { requestMediaTypeField = {...field}; }

      return null;
    });

    // reset http body field if requestMediaTypeField changed
    bodyFields.forEach(field => {
      const f = field;

      if (f?.requestMediaType !== requestMediaTypeField.value) {
        f.value = '';
        f.requestMediaType = requestMediaTypeField.value;
      }
    });

    return {
      contentType: requestMediaTypeField.value,
    };
  },

  fieldMap: {
    parsers: {
      fieldId: 'parsers',
      required: false,
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    common: { formId: 'common' },
    outputMode: {
      id: 'outputMode',
      type: 'mode',
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
    groupByFields: {
      fieldId: 'groupByFields',
      defaultValue: r => r.groupByFields,
      resourceSubType: 'http',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    'http.method': { fieldId: 'http.method' },
    'http.blobMethod': { fieldId: 'http.blobMethod' },
    'http.headers': { fieldId: 'http.headers' },
    'http.relativeURI': { fieldId: 'http.relativeURI' },
    'unencrypted.restrictedReportType': {fieldId: 'unencrypted.restrictedReportType'},
    'http.body': { fieldId: 'http.body' },
    'http.successMediaType': { fieldId: 'http.successMediaType' },
    'http.requestMediaType': { fieldId: 'http.requestMediaType' },
    'http.errorMediaType': { fieldId: 'http.errorMediaType' },
    'http.response.resourcePath': { fieldId: 'http.response.resourcePath' },
    'http.response.successPath': { fieldId: 'http.response.successPath' },
    'http.response.fileURLPaths': { fieldId: 'http.response.fileURLPaths' },
    'http.response.successValues': {
      fieldId: 'http.response.successValues',
    },
    'http.response.errorPath': { fieldId: 'http.response.errorPath' },
    'http.response.failPath': { fieldId: 'http.response.failPath' },
    'http.response.failValues': { fieldId: 'http.response.failValues' },
    type: {
      id: 'type',
      type: 'selectwithvalidations',
      label: 'Export type',
      isLoggable: true,
      required: true,
      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        // if (isNew) return '';
        const output = r && r.type;

        return isNew ? output : output || 'all';
      },
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
      skipSort: true,
      options: [
        {
          items: [
            { label: 'All – always export all data', value: 'all' },
            { label: 'Delta – export only modified data',
              value: 'delta',
              regex: /.*{{.*lastExportDateTime.*}}/,
              description: 'Add {{lastExportDateTime}} to either the relative URI or HTTP request body to complete the setup.',
              helpKey: 'export.delta',
              fieldsToValidate: ['http.relativeURI', 'http.body'] },

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
    'http.once.relativeURI': {
      fieldId: 'http.once.relativeURI',
    },
    'http.once.body': {
      fieldId: 'http.once.body',
    },
    'http.once.method': {
      fieldId: 'http.once.method',
    },
    'once.booleanField': {
      id: 'once.booleanField',
      type: 'textwithconnectioncontext',
      label: 'Boolean field to mark records as exported',
      isLoggable: true,
      visibleWhenAll: [
        { field: 'type', is: ['once'] },
      ],
      connectionId: r => r?._connectionId,
    },
    'http.paging.method': { fieldId: 'http.paging.method' },
    'http.paging.skip': { fieldId: 'http.paging.skip' },
    'http.paging.page': { fieldId: 'http.paging.page' },
    'http.paging.token': { fieldId: 'http.paging.token' },
    'http.paging.urlPath': { fieldId: 'http.paging.urlPath' },
    'http.paging.tokenPath': { fieldId: 'http.paging.tokenPath' },
    'http.paging.body': { fieldId: 'http.paging.body' },
    'http.paging.relativeURI': { fieldId: 'http.paging.relativeURI' },
    'http.paging.linkHeaderRelation': {
      fieldId: 'http.paging.linkHeaderRelation',
    },
    'http.paging.pathAfterFirstRequest': {
      fieldId: 'http.paging.pathAfterFirstRequest',
    },
    'http.paging.resourcePath': { fieldId: 'http.paging.resourcePath' },
    'http.paging.maxPagePath': { fieldId: 'http.paging.maxPagePath' },
    'http.paging.maxCountPath': { fieldId: 'http.paging.maxCountPath' },
    'http.paging.lastPageStatusCode': {
      fieldId: 'http.paging.lastPageStatusCode',
    },
    'http.paging.lastPagePath': { fieldId: 'http.paging.lastPagePath' },
    'http.paging.lastPageValues': { fieldId: 'http.paging.lastPageValues' },
    'http.response.blobFormat': { fieldId: 'http.response.blobFormat' },
    advancedSettings: {
      formId: 'advancedSettings',
    },
    'file.csv': {
      id: 'file.csv',
      type: 'csvparse',
      label: 'CSV parser helper',
      helpKey: 'file.csvParse',
      ignoreSortAndGroup: true,
      defaultValue: r => r?.file?.csv || {
        columnDelimiter: ',',
        rowDelimiter: '\n',
        hasHeaderRow: false,
        keyColumns: [],
        rowsToSkip: 0,
        trimSpaces: true,
      },
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
        {
          field: 'http.successMediaType',
          is: ['csv'],
        },
      ],
    },
    exportOneToMany: { formId: 'exportOneToMany' },
    configureAsyncHelper: {
      fieldId: 'configureAsyncHelper',
      defaultValue: r => !!(r && r.http && r.http._asyncHelperId),
      visible: r => !(r && r.statusExport),
      visibleWhen: r => {
        if (r && r.statusExport) return [];

        return [
          {
            field: 'outputMode',
            is: ['records'],
          },
        ];
      },
    },
    'http._asyncHelperId': {
      fieldId: 'http._asyncHelperId',
    },
    formView: {
      fieldId: 'formView',
    },
    semiassistantoperationselect: {
      fieldId: 'semiassistantoperationselect',
      visibleWhenAll: [{
        field: 'formView', isNot: ['true'],
      }],
    },
    'unencrypted.apiType': {
      fieldId: 'unencrypted.apiType',
    },
    mockOutput: {
      fieldId: 'mockOutput',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['common', 'outputMode', 'exportOneToMany', 'formView', 'semiassistantoperationselect'] },
      {
        collapsed: true,
        label: r => {
          if (r.resourceType === 'lookupFiles' || r.type === 'blob') return 'Where would you like to transfer from?';

          return 'What would you like to export?';
        },
        fields: [
          'unencrypted.apiType',
          'http.method',
          'http.blobMethod',
          'http.relativeURI',
          'unencrypted.restrictedReportType',
          'http.headers',
          'http.requestMediaType',
          'http.body',
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
          'http.once.method',
          'http.once.relativeURI',
          'http.once.body',
        ],
      },
      {
        collapsed: true,
        label: 'Does this API use paging?',
        fields: [
          'http.paging.method',
          'http.paging.skip',
          'http.paging.page',
          'http.paging.urlPath',
          'http.paging.tokenPath',
          'http.paging.token',
          'http.paging.relativeURI',
          'http.paging.linkHeaderRelation',
          'http.paging.pathAfterFirstRequest',
          'http.paging.body',
          'http.paging.resourcePath',
          'http.paging.maxPagePath',
          'http.paging.maxCountPath',
          'http.paging.lastPageStatusCode',
          'http.paging.lastPagePath',
          'http.paging.lastPageValues',
        ],
      },
      {
        collapsed: true,
        label: 'Non-standard API response patterns',
        containers: [
          {
            fields: [
              'http.response.resourcePath',
              'http.response.failPath',
              'http.response.failValues',
              'http.response.successPath',
              'http.response.successValues',
              'http.response.errorPath',
              'http.successMediaType',
            ],
          },
          {
            type: 'indent',
            containers: [
              {
                fields: [
                  'parsers',
                  'file.csv',
                ],
                header: (_, connection, formValues) => {
                  const isParserVisible = ['csv', 'xml'].some(parser => finalSuccessMediaType(formValues, connection) === parser);

                  return isParserVisible && 'Parse success responses';
                },
                helpKey: 'http.parseSuccessResponses',
              },
            ],
          },
          {
            fields: [
              'http.errorMediaType',
              'http.response.fileURLPaths',
            ],
          },
        ],
      },
      {
        collapsed: true,
        label: 'Would you like to group records?',
        fields: ['groupByFields'],
      },
      {
        collapsed: true,
        actionId: 'mockOutput',
        label: 'Mock output',
        fields: ['mockOutput'],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'configureAsyncHelper',
          'http._asyncHelperId',
          'advancedSettings',
        ],
      },
    ],
  },
};
