const sampleData = {
  fieldMap: {
    text: {
      id: 'text',
      name: 'text',
      type: 'text',
      helpText: 'This is the most basic input. It models an http form input',
      label: 'Text',
    },
    number: {
      id: 'number',
      name: 'number',
      type: 'text',
      inputType: 'number',
      label: 'Number',
      description:
        'It is possible to restrict user input to numerical values by setting the inputType prop to "number"',
    },
    delimitedText: {
      id: 'delimitedText',
      name: 'delimitedText',
      type: 'text',
      delimiter: ',',
      label: 'Delimited text',
      description: `Often a form needs to collect a simple set of values as a delimited string (comma or other). 
        Fail/Success status codes is one example.  Use the optional "delimiter" prop to 
        set the character(s) to split and observe the field value in the form output.`,
    },
    multiline: {
      id: 'multiline',
      name: 'multiline',
      type: 'text',
      multiline: true,
      // rowsMin: 2, // not supported?
      rowsMax: 5,
      helpText:
        'Consider this equivalent to a HTML textarea, with configuration for max-rows and starting rows',
      label: 'Multi-line text',
      description:
        'As you enter text, hit the return/enter key to observe the max row behavior.',
    },
    checkbox: {
      id: 'checkbox',
      name: 'checkbox',
      type: 'checkbox',
      label: 'Check me!',
    },
    radiogroup: {
      id: 'radiogroup',
      name: 'radiogroup',
      type: 'radiogroup',
      label: 'Radio button A',
      description: 'This example uses a simple item set',
      options: [
        {
          items: ['Create', 'Update', 'Delete'],
        },
      ],
    },
    // skipping this. it doesnt render properly in the preview form as
    // th component has some fixed height CSS.
    // selectapplication: {
    //   id: 'selectapplication',
    //   name: 'selectapplication',
    //   type: 'selectapplication',
    //   label: 'Application picker',
    // },
    radiogroup2: {
      id: 'radiogroup2',
      name: 'radiogroup2',
      type: 'radiogroup',
      label: 'Radio button B',
      description:
        'This example defined separate labels and values for each item',
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
      options: [
        {
          items: ['USA', 'Canada', 'India'],
        },
      ],
    },
    multiselect: {
      id: 'multiselect',
      name: 'multiselect',
      type: 'multiselect',
      label: 'Select multiple items',
      options: [
        {
          items: [
            { label: 'USA', value: 'US' },
            { label: 'Canada', value: 'CDN' },
            { label: 'India', value: 'IN' },
            { label: 'China', value: 'CH' },
            { label: 'South Africa', value: 'SA' },
            { label: 'Spain', value: 'SP' },
            { label: 'Mexico', value: 'MX' },
          ],
        },
      ],
    },
    editor: {
      id: 'editor',
      name: 'editor',
      type: 'editor',
      label: 'Syntax highlighting editor',
      mode: 'json',
      description: 'Optional "modes" are: csv, text, xml, json',
    },
    keyValue: {
      id: 'keyvalue',
      name: 'keyvalue',
      type: 'keyvalue',
      keyName: 'theKey',
      valueName: 'theValue',
      showDelete: true,
      label: 'Key-value pairs',
      description:
        'This input is used to collect a set of key-value pairs. The item delete action is optional and set using th showDelete prop. Also note that he key and value names can be configured as well.',
    },
    toggle: {
      id: 'toggle',
      name: 'toggle',
      type: 'toggle',
      label: 'Toggle button',

      options: [
        { label: 'United States', value: 'us' },
        { label: 'Canada', value: 'cdn' },
        { label: 'India', value: 'in' },
      ],
    },
  },
};

export default {
  key: 'form-field-dictionary',
  mode: 'json',
  name: 'Form field dictionary',
  data: JSON.stringify(sampleData, null, 2),
};
