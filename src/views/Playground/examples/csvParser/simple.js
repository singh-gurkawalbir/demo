export default {
  key: 'csvParse1',
  type: 'csvParser',
  name: 'Simple CSV',
  description: 'Simple CSV text file',
  data: `id, name, age
1, Bob, 34
2, Bill, 45
3, Dan, 33`,
  rule: {
    columnDelimiter: ',',
    hasHeaderRow: true,
    rowsToSkip: 0,
  },
};
