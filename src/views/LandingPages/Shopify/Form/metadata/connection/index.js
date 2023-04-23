import fieldDefinitions from '../../../../../../forms/fieldDefinitions/resources/connection';
import metadata from '../../../../../../forms/definitions/connections/custom/http/shopify';
import { SHOPIFY_SCOPES } from '../../../../../../constants';

export default {
  getMetaData: ({
    isIA,
    url,
    useNew,
    clientId,
    connId,
  }) => {
    const resourceFilter = {
      $and: [
        {
          $or: [
            {
              type: 'rest',
            },
            {
              type: 'http',
            },
          ],
        },
        {
          _connectorId: {$exists: isIA},
        },
        {
          assistant: 'shopify',
        },
      ],
    };

    let MainlayoutFields = ['http.unencrypted.version', 'http.storeName', 'http.auth.type'];

    if (!useNew) {
      MainlayoutFields = ['resourceId', ...MainlayoutFields];
    } else {
      MainlayoutFields = ['name', ...MainlayoutFields];
    }

    if (!isIA) {
      MainlayoutFields = [...MainlayoutFields, 'http.auth.oauth.scope'];
    } else {
      MainlayoutFields = ['_integrationId', ...MainlayoutFields];
    }
    const fieldMeta = {
      preSave: metadata.preSave,
      fieldMap: {
        _integrationId: {
          id: '_integrationId',
          name: '/_integrationId',
          label: 'IO integration name',
          type: 'ianameselect',
          required: true,
          placeholder: 'Select',
          helpKey: 'connection._integrationId',
          defaultValue: '',
          appLabel: 'Shopify',
          link: '/marketplace/shopify',
          clientId,
          visible: isIA,
          options: {
            connectionId: connId,
            useNew,
          },
          refreshOptionsOnChangesTo: isIA && !useNew ? ['resourceId'] : undefined,
        },
        resourceId: {
          id: 'resourceId',
          name: '/resourceId',
          type: 'shopifyconnectionselect',
          placeholder: 'Select',
          resourceType: 'connections',
          required: true,
          label: 'Connection',
          options: {
            filter: resourceFilter,
            appType: 'shopify',
          },
          isValueValid: true,
          defaultValue: '',
          appTypeIsStatic: !isIA,
          removeHelperText: true,
          refreshOptionsOnChangesTo: isIA && !useNew ? ['_integrationId'] : undefined,
          visibleWhen: isIA && !useNew ? [
            {
              field: '_integrationId',
              isNot: [''],
            },
          ] : undefined,
          visible: !useNew,
          getItemInfo: r => {
            const baseUri = r?.http?.baseURI;

            return baseUri?.substring(
              baseUri.indexOf('https://') + 8,
              baseUri.indexOf('.myshopify.com')
            );
          },
        },
        name: {
          id: 'name',
          name: '/name',
          label: 'Name your connection',
          helpKey: 'connection.name',
          required: true,
          type: 'text',
          placeholder: 'e.g., Shopify connection',
          visible: useNew,
        },
        'http.unencrypted.version': {
          id: 'http.unencrypted.version',
          name: '/http/unencrypted/version',
          type: 'select',
          label: 'API version',
          required: true,
          helpKey: 'shopify.connection.http.unencrypted.version',
          defaultValue: '2023-01',
          options: metadata.fieldMap['http.unencrypted.version'].options,
          visible: useNew && !isIA,
        },
        'http.storeName': {
          id: 'http.storeName',
          name: '/http/storeName',
          type: 'shopifystorename',
          label: 'Store name',
          helpKey: 'shopify.connection.http.storeURL',
          required: true,
          validWhen: {
            matchesRegEx: {
              pattern: '^[a-zA-Z0-9][a-zA-Z0-9-]*',
              message: 'not a valid Store name.',
            },
          },
          defaultValue: url?.substring(0, url?.indexOf('.myshopify.com')),
          defaultDisabled: true,
          visible: useNew,
        },
        'http.auth.type': {
          id: 'http.auth.type',
          name: '/http/auth/type',
          type: 'select',
          label: 'Auth type',
          required: true,
          helpKey: 'shopify.connection.http.auth.type',
          options: [
            {
              items: [
                { label: 'Basic', value: 'basic' },
                { label: 'OAuth 2.0', value: 'oauth' },
              ],
            },
          ],
          defaultValue: 'oauth',
          defaultDisabled: true,
          visible: useNew,
        },
        'http.auth.oauth.scope': {
          id: 'http.auth.oauth.scope',
          name: '/http/auth/oauth/scope',
          type: 'selectscopes',
          isLoggable: true,
          label: 'Configure scopes',
          scopes: metadata.fieldMap['http.auth.oauth.scope'].scopes,
          helpKey: 'connection.http.auth.oauth.scope',
          required: true,
          defaultValue: SHOPIFY_SCOPES,
          pathToScopeField: 'http.auth.oauth.scope',
          refreshOptionsOnChangesTo: ['resourceId'],
          visibleWhen: !isIA && !useNew ? [
            {
              field: 'resourceId',
              isNot: [''],
            },
          ] : undefined,
          visible: false,
        },
        _borrowConcurrencyFromConnectionId: {
          id: '_borrowConcurrencyFromConnectionId',
          ...fieldDefinitions._borrowConcurrencyFromConnectionId,
          name: '/_borrowConcurrencyFromConnectionId',
          visible: useNew,
          defaultValue: '',
        },
        'http.concurrencyLevel': {
          id: 'http.concurrencyLevel',
          ...fieldDefinitions['http.concurrencyLevel'],
          name: '/http/concurrencyLevel',
          visible: useNew,
        },
      },
      layout: {
        containers: [
          {
            type: useNew ? 'box' : 'blank',
            containers: [
              {
                fields: MainlayoutFields,
              },
            ],
          },
          {
            type: 'collapse',
            containers: [
              {
                collapsed: true,
                label: 'Advanced',
                fields: useNew ? [
                  '_borrowConcurrencyFromConnectionId',
                  'http.concurrencyLevel',
                ] : [],
              },
            ],
          },
        ],
      },
      actions: [
        {
          id: 'oauthandcancel',
        },
      ],
      patchSet: () => {
        const patchValues = [
          {path: '/adaptorType', op: 'add', value: {}},
          {op: 'replace', path: '/adaptorType', value: 'RESTConnection'},
          {path: '/application', op: 'add', value: {}},
          {op: 'replace', path: '/application', value: 'Shopify'},
          {path: '/assistant', op: 'add', value: {}},
          {op: 'replace', path: '/assistant', value: 'shopify'},
          {path: '/type', op: 'add', value: {}},
          {op: 'replace', path: '/type', value: 'rest'},
        ];

        if (isIA) {
          // any IA specific patches
          if (useNew) {
            patchValues.push({op: 'add', path: '/newIA', value: true});
          }
        }

        return patchValues;
      },
      optionsHandler: (fieldId, fields) => {
        const resourceId = fields.find(
          field => field.id === 'resourceId'
        );

        if (fieldId === 'http.auth.oauth.scope') {
          return {
            resourceType: 'connections',
            resourceId: resourceId?.value,
          };
        }

        if (fieldId === 'resourceId') {
          const integrationId = fields.find(
            field => field.id === '_integrationId'
          );

          if (integrationId?.value) {
            return {
              filter: {
                $and: [
                  { _integrationId: integrationId?.value },
                  ...resourceFilter.$and,
                ],
              },
              appType: 'shopify',
            };
          }
        }

        if (fieldId === '_integrationId') {
          if (resourceId?.value) {
            return {
              connectionId: resourceId?.value,
              useNew,
            };
          }
        }

        return null;
      },
    };

    if (!useNew) {
      delete fieldMeta.fieldMap.name;
      delete fieldMeta.fieldMap._borrowConcurrencyFromConnectionId;
      delete fieldMeta.fieldMap['http.concurrencyLevel'];
    } else {
      delete fieldMeta.fieldMap.resourceId;
    }

    if (!isIA) {
      delete fieldMeta.fieldMap._integrationId;
    } else {
      delete fieldMeta.fieldMap['http.auth.oauth.scope'];
    }

    return fieldMeta;
  },
};
