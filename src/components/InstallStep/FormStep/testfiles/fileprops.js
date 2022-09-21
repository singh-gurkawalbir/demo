export const formProps = {
  parentContext: {},
  disabled: false,
  showValidationBeforeTouched: false,
  conditionalUpdate: false,
  fieldMeta: {
    fieldMap: {
      selectSourceApplications: {
        id: 'selectSourceApplications',
        name: 'selectSourceApplications',
        type: 'multiselect',
        helpText: 'Choose your data sources. You can always choose more data sources later.',
        label: 'Choose data sources',
        options: [
          {
            items: [
              {
                label: 'Magento 2',
                value: 'magento',
              },
              {
                label: 'Zendesk Support',
                value: 'zendesk',
              },
              {
                label: 'Shopify',
                value: 'shopify',
              },
              {
                label: 'Mailchimp',
                value: 'mailchimp',
              },
              {
                label: 'HubSpot',
                value: 'hubspot',
              },
              {
                label: 'BigCommerce',
                value: 'bigcommerce',
              },
              {
                label: 'Returnly',
                value: 'returnly',
              },
              {
                label: 'Loop Returns',
                value: 'loopreturns',
              },
            ],
          },
        ],
      },
    },
    layout: {
      fields: [
        'selectSourceApplications',
      ],
    },
  },
  remountKey: true,
  formIsDisabled: false,
  resetTouchedState: false,
  fields: {
    selectSourceApplications: {
      id: 'selectSourceApplications',
      name: 'selectSourceApplications',
      type: 'multiselect',
      helpText: 'Choose your data sources. You can always choose more data sources later.',
      label: 'Choose data sources',
      options: [
        {
          items: [
            {
              label: 'Magento 2',
              value: 'magento',
            },
            {
              label: 'Zendesk Support',
              value: 'zendesk',
            },
            {
              label: 'Shopify',
              value: 'shopify',
            },
            {
              label: 'Mailchimp',
              value: 'mailchimp',
            },
            {
              label: 'HubSpot',
              value: 'hubspot',
            },
            {
              label: 'BigCommerce',
              value: 'bigcommerce',
            },
            {
              label: 'Returnly',
              value: 'returnly',
            },
            {
              label: 'Loop Returns',
              value: 'loopreturns',
            },
          ],
        },
      ],
      touched: false,
      visible: true,
      required: false,
      disabled: false,
      isValid: true,
      isDiscretelyInvalid: false,
      errorMessages: '',
    },
  },
  value: {},
  isValid: true,
};

