export default [
  {
    name: 'handlebar',
    label: 'Handlebar editor',
    dataMediaType: 'json',
    description:
        'This editor lets you create and test URL templates against your raw data.',
  },
  {
    name: 'CsvParseEditor',
    label: 'CSV parser',
    dataMediaType: 'text',
    description: 'This processor converts comma-separated values into JSON.',
  },
  {
    name: 'XmlParseEditor',
    label: 'XML parser',
    dataMediaType: 'xml',
    description:
        'This processor converts XML to JSON, controlled by a set of parse options.',
  },
  {
    name: 'TransformEditor',
    label: 'Transform editor',
    dataMediaType: 'json',
    description:
        'This processor allows you to "reshape" a JSON object using simple {extract/generate} pairs.',
  },
  {
    name: 'JavaScriptEditor',
    label: 'JavaScript editor',
    dataMediaType: 'json',
    description:
        'This processor allows you to run JavaScript safely in a secure runtime environment.',
  },
  {
    name: 'FileDefinitionEditor',
    label: 'File-definition parser',
    dataMediaType: 'edi',
    description:
        'This processor allows you to parse junk data into a readable JSON format by applying a file-definition structure.',
  },
  {
    name: 'SQLQueryBuilderEditor',
    dataMediaType: 'json',
    label: 'SQL query editor',
    description:
        'This processor allows you to build SQL queries using handlebars and JSON.',
  },
  {
    name: 'FilterEditor',
    label: 'Filter editor',
    dataMediaType: 'json',
    description:
        'This editor allows you to visually define an expression for filtering records.',
  },
  {
    name: 'SettingsFormEditor',
    label: 'Settings form editor',
    dataMediaType: 'formMeta',
    description:
        'This editor allows you to build a custom form by providing a form definition in JSON and an optional JavaScript initialization function.',
  },
];
