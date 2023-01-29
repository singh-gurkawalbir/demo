const sampleData = {
  fieldMap: {
    radiogroup: {
      id: 'radiogroup',
      name: 'radiogroup',
      type: 'radiogroup',
      label: 'Radio button A',
      description: 'This example uses a simple item set',
      defaultValue: 'Create',
      options: [
        {
          items: ['Create', 'Update', 'Delete'],
        },
      ],
    },
    radiogroup2: {
      id: 'radiogroup2',
      name: 'radiogroup2',
      type: 'radiogroup',
      label: 'Radio button B',
      description:
          'This example defined separate labels and values for each item',
      defaultValue: 'cdn',
      options: [
        {
          items: [
            { label: 'United States', value: 'us' },
            { label: 'Canada', value: 'cdn' },
            { label: 'India', value: 'in' },
          ],
        },
      ],
    },
    select: {
      id: 'select',
      name: 'select',
      type: 'select',
      label: 'Select List',
      defaultValue: 'USA',
      options: [
        {
          items: ['USA', 'Canada', 'India'],
        },
      ],
    },
    visibleWhenAll: {
      id: 'visibleWhenAll',
      name: 'visibleWhenAll',
      type: 'select',
      label: 'Visible when all',
      defaultValue: 'Hyderabad',
      description: 'This field will be visible only when radiogroup is set as create and select is set as USA',
      options: [
        {
          items: ['Delhi', 'Hyderabad', 'Chennai'],
        },
      ],
      visibleWhenAll: [
        {
          field: 'radiogroup',
          is: ['Create'],
        },
        {
          field: 'select',
          is: ['USA'],
        },
      ],
    },
    visibleWhen: {
      id: 'visibleWhen',
      name: 'visibleWhen',
      type: 'select',
      label: 'Visible when',
      defaultValue: 'Hyderabad',
      description: 'This field will be visible when one of the radiogroup is set as create or select is set as India',
      options: [
        {
          items: ['Delhi', 'Hyderabad', 'Chennai'],
        },
      ],
      visibleWhen: [
        {
          field: 'radiogroup',
          is: ['Create'],
        },
        {
          field: 'select',
          is: ['India'],
        },
      ],
    },
    defaultVisible: {
      id: 'defaultVisible',
      name: 'defaultVisible',
      type: 'select',
      label: 'Default Visible',
      defaultVisible: 'false',
      options: [
        {
          items: ['Delhi', 'Hyderabad', 'Chennai'],
        },
      ],
    },
    disabledWhenAll: {
      id: 'disabledWhenAll',
      name: 'disabledWhenAll',
      type: 'select',
      label: 'Disabled when all',
      defaultValue: 'Hyderabad',
      description: 'This field will be disabled only when radiogroup is set as create and select is set as USA',
      options: [
        {
          items: ['Delhi', 'Hyderabad', 'Chennai'],
        },
      ],
      disabledWhenAll: [
        {
          field: 'radiogroup',
          is: ['Create'],
        },
        {
          field: 'select',
          is: ['USA'],
        },
      ],
    },
    disabledWhen: {
      id: 'disabledWhen',
      name: 'disabledWhen',
      type: 'select',
      label: 'Disable when',
      defaultValue: 'Hyderabad',
      description: 'This field will be disabled when one of the radiogroup is set as create or select is set as India',
      options: [
        {
          items: ['Delhi', 'Hyderabad', 'Chennai'],
        },
      ],
      disabledWhen: [
        {
          field: 'radiogroup',
          is: ['Create'],
        },
        {
          field: 'select',
          is: ['India'],
        },
      ],
    },
    defaultDisabled: {
      id: 'defaultDisabled',
      name: 'defaultDisabled',
      type: 'select',
      label: 'Default disabled',
      defaultValue: 'Hyderabad',
      defaultDisabled: true,
      options: [
        {
          items: ['Delhi', 'Hyderabad', 'Chennai'],
        },
      ],
    },
    requiredWhenAll: {
      id: 'requiredWhenAll',
      name: 'requiredWhenAll',
      type: 'select',
      label: 'Required when all',
      defaultValue: 'Hyderabad',
      description: 'This field will be required only when radiogroup is set as create and select is set as USA',
      options: [
        {
          items: ['Delhi', 'Hyderabad', 'Chennai'],
        },
      ],
      requiredWhenAll: [
        {
          field: 'radiogroup',
          is: ['Create'],
        },
        {
          field: 'select',
          is: ['USA'],
        },
      ],
    },
    requiredWhen: {
      id: 'requiredWhen',
      name: 'requiredWhen',
      type: 'select',
      label: 'Required when',
      defaultValue: 'Hyderabad',
      description: 'This field will be required when one of the radiogroup is set as create or select is set as India',
      options: [
        {
          items: ['Delhi', 'Hyderabad', 'Chennai'],
        },
      ],
      requiredWhen: [
        {
          field: 'radiogroup',
          is: ['Create'],
        },
        {
          field: 'select',
          is: ['India'],
        },
      ],
    },
    defaultRequired: {
      id: 'defaultRequired',
      name: 'defaultRequired',
      type: 'select',
      label: 'Default required',
      defaultValue: 'Hyderabad',
      defaultRequired: true,
      options: [
        {
          items: ['Delhi', 'Hyderabad', 'Chennai'],
        },
      ],
    },
    touched: {
      id: 'touched',
      name: 'touched',
      type: 'select',
      label: 'Touched',
      defaultValue: 'Hyderabad',
      touched: true,
      description: 'Test form will be enabled by default if touched flag set to true.',
      options: [
        {
          items: ['Delhi', 'Hyderabad', 'Chennai'],
        },
      ],
    },
    omitWhenHidden: {
      id: 'omitWhenHidden',
      name: 'omitWhenHidden',
      type: 'select',
      label: 'Omit when hidden',
      defaultValue: 'Hyderabad',
      defaultVisible: false,
      options: [
        {
          items: ['Delhi', 'Hyderabad', 'Chennai'],
        },
      ],
    },
    omitWhenValueIs: {
      id: 'omitWhenValueIs',
      name: 'omitWhenValueIs',
      type: 'select',
      label: 'Omit when values is',
      defaultValue: 'Hyderabad',
      touched: true,
      omitWhenValueIs: ['Hyderabad'],
      options: [
        {
          items: ['Delhi', 'Hyderabad', 'Chennai'],
        },
      ],
    },
  },
};

export default {
  key: 'form-conditions',
  type: 'settingsForm',
  name: 'Conditions form',
  description: 'Sample form demonstrating all conditions',
  data: JSON.stringify(sampleData, null, 2),
};

