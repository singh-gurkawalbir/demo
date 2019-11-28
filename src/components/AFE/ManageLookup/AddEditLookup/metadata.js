import dynamicMetadata from './DynamicLookup/metadata';

const getFailedRecordDefault = (isEdit, lookup) => {
  if (!isEdit || !lookup || !lookup.allowFailures) {
    return 'disallowFailure';
  }

  switch (lookup.default) {
    case '':
      return 'useEmptyString';
    case null:
      return 'useNull';
    default:
      return 'default';
  }
};

export default {
  getLookupMetadata: ({
    lookup,
    isEdit,
    showDynamicLookupOnly,
    isSQLLookup,
    sampleData,
  }) => {
    const dynamicLookupMetadata = dynamicMetadata.getLookupMetadata({
      lookup,
      isEdit,
      showDynamicLookupOnly,
      isSQLLookup,
      sampleData,
    });
    const {
      fieldMap: dynamicFieldMap,
      layout: dynamicLayout,
    } = dynamicLookupMetadata;
    const { fields: dynamicLayoutFields } = dynamicLayout;
    const fieldMeta = {
      fieldMap: {
        mode: {
          id: 'mode',
          name: 'mode',
          type: 'radiogroup',
          label: '',
          defaultValue: isEdit && lookup && lookup.map ? 'static' : 'dynamic',
          options: [
            {
              items: [
                { label: 'Dynamic Search', value: 'dynamic' },
                { label: 'Static: Value to Value', value: 'static' },
              ],
            },
          ],
        },
        ...dynamicFieldMap,
        mapList: {
          id: 'mapList',
          name: 'mapList',
          type: 'staticMap',
          label: '',
          keyName: 'export',
          keyLabel: 'Export Field',
          valueName: 'import',
          valueLabel: 'Import Field (HTTP)',
          map: isEdit && lookup && lookup.map,
          visibleWhen: [
            {
              field: 'mode',
              is: ['static'],
            },
          ],
        },
        name: {
          id: 'name',
          name: 'name',
          type: 'text',
          label: 'Name',
          defaultValue: lookup.name,
          placeholder: 'Alphanumeric characters only please',
        },
        failRecord: {
          id: 'failRecord',
          name: 'failRecord',
          type: 'radiogroup',
          label: 'Action to take if unique match not found',
          showOptionsVertically: true,
          defaultValue:
            getFailedRecordDefault(isEdit, lookup) || 'disallowFailure',
          options: [
            {
              items: [
                {
                  label: 'Fail Record',
                  value: 'disallowFailure',
                },
                {
                  label: 'Use Empty String as Default Value',
                  value: 'useEmptyString',
                },
                {
                  label: 'Use Null as Default Value',
                  value: 'useNull',
                },
                {
                  label: 'Use Custom Default Value',
                  value: 'default',
                },
              ],
            },
          ],
        },
        default: {
          id: 'default',
          name: 'default',
          type: 'text',
          label: 'Enter Default Value',
          defaultValue: lookup.default,
          placeholder: 'Enter Default Value',
          visibleWhen: [
            {
              field: 'failRecord',
              is: ['default'],
            },
          ],
        },
      },
      layout: {
        fields: [
          'mode',
          ...dynamicLayoutFields,
          'mapList',
          'name',
          'failRecord',
          'default',
        ],
      },
    };

    if (showDynamicLookupOnly) {
      delete fieldMeta.fieldMap.mode;
      delete fieldMeta.fieldMap.mapList;
      fieldMeta.layout.fields = fieldMeta.layout.fields.filter(
        el => el !== 'mode' && el !== 'mapList'
      );
    }

    return fieldMeta;
  },
};
