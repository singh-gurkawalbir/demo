export default {
  key: 'csvParse1',
  type: 'csvParser',
  name: 'Simple CSV',
  description: 'Simple CSV text file',
  data: 'id, name, age\n1, Bob, 34\n2, Bill, 45\n3, Dan, 33',
  rule: {
    columnDelimiter: ',',
    hasHeaderRow: true,
    rowsToSkip: 0,
  },
};
