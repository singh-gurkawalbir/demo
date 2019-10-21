export default {
  allow_empty: true,
  sort_filters: true,
  operators: [
    { type: 'equal', optgroup: 'basic' },
    { type: 'not_equal', optgroup: 'basic' },
    { type: 'in', optgroup: 'basic' },
    { type: 'not_in', optgroup: 'basic' },
    { type: 'less', optgroup: 'numbers' },
    { type: 'less_or_equal', optgroup: 'numbers' },
    { type: 'greater', optgroup: 'numbers' },
    { type: 'greater_or_equal', optgroup: 'numbers' },
    { type: 'between', optgroup: 'numbers' },
    { type: 'not_between', optgroup: 'numbers' },
    { type: 'begins_with', optgroup: 'strings' },
    { type: 'not_begins_with', optgroup: 'strings' },
    { type: 'contains', optgroup: 'strings' },
    { type: 'not_contains', optgroup: 'strings' },
    { type: 'ends_with', optgroup: 'strings' },
    { type: 'not_ends_with', optgroup: 'strings' },
    { type: 'is_empty' },
    { type: 'is_not_empty' },
    { type: 'is_null' },
    { type: 'is_not_null' },
  ],

  filters: [
    {
      id: 'name',
      field: 'username',
      label: {
        en: 'Name',
        fr: 'Nom',
      },
      icon: 'glyphicon glyphicon-user',
      value_separator: ',',
      type: 'string',
      optgroup: '',
      default_value: 'Mistic',
      size: 30,
      validation: {
        allow_empty_value: true,
      },
      unique: true,
    },
    {
      id: 'label1',
      label: 'Label With Text',
      icon: 'glyphicon glyphicon-calendar',
      type: 'integer',
      input: 'text',
      value_separator: '|',
      optgroup: '',
      description(rule) {
        if (
          rule.operator &&
          ['in', 'not_in'].indexOf(rule.operator.type) !== -1
        ) {
          return 'Use a pipe (|) to separate multiple values with "in" and "not in" operators';
        }
      },
    },
    {
      id: 'label2',
      label: 'Label With Text Area',
      icon: 'glyphicon glyphicon-qrcode',
      type: 'string',
      input: 'textarea',
      operators: ['equal'],
      size: 30,
      rows: 3,
    },

    {
      id: 'labelWithCategory',
      label: 'Label With Category',
      icon: 'glyphicon glyphicon-th-list',
      type: 'integer',
      input: 'checkbox',
      optgroup: '',
      values: {
        1: 'Yes',
        2: 'No',
        3: 'Not Decided',
      },
      colors: {
        1: 'foo',
        2: 'warning',
        5: 'success',
      },
      operators: [
        'equal',
        'not_equal',
        'in',
        'not_in',
        'is_null',
        'is_not_null',
      ],
      default_operator: 'in',
    },
    {
      id: 'label3',
      label: 'Label With Drop Down',
      icon: 'glyphicon glyphicon-globe',
      type: 'string',
      input: 'select',
      optgroup: '',
      placeholder: 'Select',
      values: [
        {
          label: 'Cash Flow',
          value: 'cash_flow',
        },
        {
          label: 'Option 2',
          value: 'option2',
        },
        {
          label: 'Option 3',
          value: 'option3',
        },

        {
          label: 'Option 3',
          value: 'option3',
        },

        {
          label: 'Option 4',
          value: 'option4',
        },
      ],
      operators: ['equal', 'not_equal', 'is_null', 'is_not_null'],
    },

    {
      id: 'label5',
      label: 'Field With Increment decimal',
      icon: 'glyphicon glyphicon-usd',
      type: 'double',
      size: 5,
      validation: {
        min: 0,
        step: 1,
      },
      data: {
        class: 'com.example.PriceTag',
      },
    },
  ],
};
