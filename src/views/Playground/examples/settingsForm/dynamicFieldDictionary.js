const sampleData = {
  fieldMap: {
    exportSelect: {
      id: 'exportSelect',
      name: 'exportSelect',
      type: 'exportSelect',
      label: 'Export select',
      devPlayGroundSpecificField: 'It is dev form specific field and should not be used anywhere. Actual dynamic calls will not work here. it will show dummy data here.',
      resource: {
        virtual: {
          _connectionId: 'connId',
          asynchronous: true,
          netsuite: {
            type: 'restlet',
            skipGrouping: true,
            statsOnly: false,
            restlet: {
              recordType: 'shipitem',
              criteria: [
                {
                  field: 'isinactive',
                  operator: 'is',
                  searchValue: 'F',
                },
              ],
              columns: [
                {
                  name: 'itemid',
                  label: 'label',
                },
                {
                  name: 'internalid',
                  label: 'value',
                },
              ],
              useSS2Restlets: false,
            },
          },
        },
      },
    },
    exportMultiSelect: {
      id: 'exportMultiSelect',
      name: 'exportMultiSelect',
      type: 'exportSelect',
      label: 'Export multi select',
      multiselect: true,
      devPlayGroundSpecificField: 'It is dev form specific field and should not be used anywhere. Actual dynamic calls will not work here. it will show dummy data here.',
      resource: {
        virtual: {
          _connectionId: 'connId',
          asynchronous: true,
          netsuite: {
            type: 'restlet',
            skipGrouping: true,
            statsOnly: false,
            restlet: {
              recordType: 'shipitem',
              criteria: [
                {
                  field: 'isinactive',
                  operator: 'is',
                  searchValue: 'F',
                },
              ],
              columns: [
                {
                  name: 'itemid',
                  label: 'label',
                },
                {
                  name: 'internalid',
                  label: 'value',
                },
              ],
              useSS2Restlets: false,
            },
          },
        },
      },
    },
    refreshableselect: {
      id: 'refreshableselect',
      name: 'refreshableselect',
      label: 'Refreshable select',
      type: 'refreshableselect',
      devPlayGroundSpecificField: 'It is dev form specific field and should not be used anywhere. Actual dynamic calls will not work here. it will show dummy data here.',
      placeholder: 'Please select a field',
      connectionId: 'connId',
      filterKey: 'suitescript-recordTypes',
      refreshOptionsOnChangesTo: ['exportMultiSelect'],
    },
    netsuitelookup: {
      id: 'netsuitelookup',
      name: 'netsuitelookup',
      isLoggable: true,
      type: 'netsuitelookup',
      label: 'Netsuite lookup',
      disableFetch: true,
    },
    staticMap: {
      id: 'staticMap',
      name: 'staticMap',
      type: 'staticMap',
      label: '',
      keyName: 'export',
      keyLabel: 'Source field value',
      valueName: 'import',
      valueLabel: 'Destination field value',
      columns: [
        {
          id: 'import',
          label: 'Destination field value',
          required: false,
          type: 'input',
          supportsRefresh: false,
        },
        {
          id: 'export',
          label: 'Source field value',
          required: false,
          type: 'input',
          supportsRefresh: false,
        },
      ],
    },
  },
};

export default {
  key: 'dynamic-form-field-dictionary',
  type: 'settingsForm',
  name: 'Dynamic field dictionary',
  description: 'Sample form demonstrating available fields',
  data: JSON.stringify(sampleData, null, 2),
};

