import { isNewId } from '../../../../utils/resource';
import { isLookupResource } from '../../../../utils/flows';

export default {
  init: (fieldMeta, resource = {}, flow) => {
    const exportPanelField = fieldMeta.fieldMap.exportPanel;

    if (isLookupResource(flow, resource)) {
      exportPanelField.visible = false;
    }

    return fieldMeta;
  },

  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
      retValues['/rdbms/once'] = undefined;
      delete retValues['/rdbms/once/query'];
    } else if (retValues['/type'] === 'test') {
      retValues['/test/limit'] = 1;
      retValues['/rdbms/once'] = undefined;
      delete retValues['/rdbms/once/query'];
    } else if (retValues['/type'] === 'delta') {
      retValues['/rdbms/once'] = undefined;
      delete retValues['/rdbms/once/query'];
    }

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    'rdbms.query': { fieldId: 'rdbms.query' },
    type: {
      id: 'type',
      type: 'select',
      label: 'Export type',
      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        if (isNew) return '';
        const output = r && r.type;

        return output || 'all';
      },
      required: true,
      options: [
        {
          items: [
            { label: 'All', value: 'all' },
            { label: 'Test', value: 'test' },
            { label: 'Delta', value: 'delta' },
            { label: 'Once', value: 'once' },
          ],
        },
      ],
    },
    'rdbms.once.query': {
      fieldId: 'rdbms.once.query',
      visibleWhen: [{ field: 'type', is: ['once'] }],
    },
    pageSize: { fieldId: 'pageSize' },
    dataURITemplate: { fieldId: 'dataURITemplate' },
    exportOneToMany: { formId: 'exportOneToMany' },
    exportPanel: {
      fieldId: 'exportPanel',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        fields: ['common'],
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: 'How should this export be parameterized?',
            fields: ['exportOneToMany'],
          },
          {
            collapsed: true,
            label: 'What would you like to export from rdbms?',
            fields: ['rdbms.query', 'type', 'rdbms.once.query'],
          },
          {
            collapsed: true,
            label: 'Advanced',
            fields: ['pageSize', 'dataURITemplate'],
          },
        ],
      },
      {
        fields: ['exportPanel'],
      },
    ],
  },
};
