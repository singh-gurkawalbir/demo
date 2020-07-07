export default {
  ColumnDelimiterMap: {
    comma: ',',
    pipe: '|',
    semicolon: ';',
    space: ' ',
    tab: '\t',
  },
  ColumnDelimiterOptions: [
    { label: 'Comma (,)', value: 'comma' },
    { label: 'Pipe (|)', value: 'pipe' },
    { label: 'Semicolon (;)', value: 'semicolon' },
    { label: 'Space', value: 'space' },
    { label: 'Tab', value: 'tab' },
  ],
  RowDelimiterMap: {
    lf: '\n',
    cr: '\r',
    crlf: '\r\n',
  },
  RowDelimiterOptions: [
    { label: 'LF (\\n)', value: 'lf' },
    { label: 'CR (\\r)', value: 'cr' },
    { label: 'CRLF (\\r\\n)', value: 'crlf' },
  ],
};
