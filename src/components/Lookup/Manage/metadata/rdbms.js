import getFailedRecordDefault from './util';

export default {
  getLookupMetadata: ({ lookup, showDynamicLookupOnly, sampleData, resourceId,
    resourceType,
    flowId }) => {
    const fieldMeta = {
      fieldMap: {
        _mode: {
          id: '_mode',
          name: '_mode',
          type: 'radiogroup',
          label: 'Lookup type',
          required: true,
          helpKey: 'mapping.lookup.mode',
          defaultValue: lookup?.map ? 'static' : 'dynamic',
          options: [
            {
              items: [
                { label: 'Dynamic search', value: 'dynamic' },
                { label: 'Static: Value to value', value: 'static' },
              ],
            },
          ],
        },
        _query: {
          id: '_query',
          name: '_query',
          type: 'query',
          label: 'SQL query',
          required: true,
          helpText: 'The query that fetches records to be exported.',
          sampleData,
          resourceId,
          resourceType,
          flowId,
          defaultValue: lookup.query,
          visibleWhen: [
            {
              field: '_mode',
              is: ['dynamic'],
            },
          ],
        },
        _extract: {
          id: '_extract',
          name: '_extract',
          type: 'text',
          label: 'Column',
          required: true,
          helpText:
            'When integrator.io runs this lookup it will read the column named in this field from the SQL result set and return that single value as the result of the lookup. Please make sure this field contains a valid column name from your database table.',
          defaultValue: lookup.extract,
          visibleWhen: [
            {
              field: '_mode',
              is: ['dynamic'],
            },
          ],
        },
        _mapList: {
          id: '_mapList',
          name: '_mapList',
          type: 'staticMap',
          label: '',
          keyName: 'export',
          keyLabel: 'Export field',
          valueName: 'import',
          valueLabel: 'Import field',
          map: lookup && lookup.map,
          visibleWhen: [
            {
              field: '_mode',
              is: ['static'],
            },
          ],
        },
        _name: {
          id: '_name',
          name: '_name',
          type: 'text',
          label: 'Name',
          required: true,
          defaultValue: lookup.name,
          placeholder: 'Alphanumeric characters only please',
          helpText:
            'Name of the lookups that will be exposed to the mapping to refer.',
          validWhen: {
            matchesRegEx: {
              pattern: '^[\\S]+$',
              message: 'Name should not contain spaces.',
            },
          },
        },
        _failRecord: {
          id: '_failRecord',
          name: '_failRecord',
          type: 'radiogroup',
          label: 'Action to take if unique match not found',
          showOptionsVertically: true,
          defaultValue: getFailedRecordDefault(lookup) || 'disallowFailure',
          options: [
            {
              items: [
                {
                  label: 'Fail record',
                  value: 'disallowFailure',
                },
                {
                  label: 'Use empty string as default value',
                  value: 'useEmptyString',
                },
                {
                  label: 'Use null as default value',
                  value: 'useNull',
                },
                {
                  label: 'Use custom default value',
                  value: 'default',
                },
              ],
            },
          ],
        },
        _default: {
          id: '_default',
          name: '_default',
          type: 'text',
          label: 'Enter default value',
          defaultValue: lookup.default,
          placeholder: 'Enter default value',
          visibleWhen: [
            {
              field: '_failRecord',
              is: ['default'],
            },
          ],
        },
      },
      layout: {
        fields: [
          '_mode',
          '_query',
          '_extract',
          '_mapList',
          '_name',
          '_failRecord',
          '_default',
        ],
      },
    };

    if (showDynamicLookupOnly) {
      const { fieldMap, layout } = fieldMeta;

      delete fieldMap._mode;
      delete fieldMap._mapList;
      delete fieldMap._query.visibleWhen;
      delete fieldMap._extract.visibleWhen;
      layout.fields = layout.fields.filter(
        el => el !== '_mode' && el !== '_mapList'
      );
    }

    return fieldMeta;
  },
};
