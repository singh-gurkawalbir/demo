export default [
  {
    type: 'handlebars',
    label: 'Handlebars',
    description: 'Constructs JSON or XML template against raw data',
  },
  {
    type: 'csvParser',
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
    type: 'formBuilder',
    label: 'Form builder',
    description: 'Construct a form from metadata',
  },
  {
    type: 'sql',
    label: 'SQL query builder',
    description: 'Construct a SQL query using handlebars',
  },
];
