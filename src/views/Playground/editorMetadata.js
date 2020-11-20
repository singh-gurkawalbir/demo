export default [
  {
    type: 'handlebars',
    label: 'Handlebars',
    description: 'Constructs JSON or XML template against raw data',
  },
  {
    type: 'csvParse',
    label: 'CSV Parser',
    description: 'Converts delimited data into JSON',
  },
  {
    type: 'ediParse',
    label: 'EDI Parser',
    description: 'Converts EDI files into JSON',
  },
  {
    type: 'xmlParse',
    label: 'XML Parser',
    description: 'Converts XML into JSON',
  },
  {
    type: 'filter',
    label: 'Filter editor',
    description:
      'This editor allows you to visually define an expression for filtering records.',
  },
  {
    type: 'formBuilder',
    label: 'Form builder',
    description: 'Construct a form from metadata',
  },
];
