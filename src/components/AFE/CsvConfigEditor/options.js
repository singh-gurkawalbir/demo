export default {
  ColumnDelimiterOptions: [
    { label: 'Comma (,)', value: ',' },
    { label: 'Pipe (|)', value: '|' },
    { label: 'Semicolon (;)', value: ';' },
    { label: 'Space', value: ' ' },
    { label: 'Tab', value: '\t' },
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
