
export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name',
      type: 'httpConnectorName',
      isVanConnector: true,
      isApplicationPlaceholder: false },
    'van.as2Id': {
      fieldId: 'van.as2Id',
      type: 'text',
    },
    'van.contentBasedFlowRouter': {
      fieldId: 'van.contentBasedFlowRouter',
      isLoggable: true,
      type: 'routingrules',
      label: 'Routing rules editor',
      required: false,
      editorResultMode: 'text',
      hookStage: 'contentBasedFlowRouter',
      helpKey: 'connection.van.contentBasedFlowRouter',
      disablePortal: false,
      title: 'Choose a script and function name to use for determining VAN message routing',
      isVanConnector: true,
      preHookData: {
        httpHeaders: {
          'as2-from': 'OpenAS2_appA',
          'as2-to': 'OpenAS2_appB',
        },
        mimeHeaders: {
          'content-type': 'application/edi-x12',
          'content-disposition': 'Attachment; filename=rfc1767.dat',
        },
        rawMessageBody: 'sample message',
      },
    },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: [
          'name',
          'application',
        ],
      },
      {
        collapsed: false,
        label: 'Configure routing for shared connections',
        fields: [
          'van.contentBasedFlowRouter',
        ],
      },
    ],
  },
  actions: [
    {
      id: 'saveandclosegroup',
    },
  ],
};
