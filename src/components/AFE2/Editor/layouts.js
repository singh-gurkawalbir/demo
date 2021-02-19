export default {
  compact: {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr 0fr',
    gridTemplateAreas: '"rule data" "rule result" "error error"',
  },
  compact2: {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr 0fr',
    gridTemplateAreas: '"rule data" "result data" "error error"',
  },
  row: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr 1ft 1fr 0fr',
    gridTemplateAreas: '"rule" "data" "result" "error"',
  },
  column: {
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: '4fr 0fr',
    gridTemplateAreas: '"rule data result" "error error error"',
  },
  jsonFormBuilder: {
    gridTemplateColumns: '2fr 2fr',
    gridTemplateRows: '1fr 1fr 0fr',
    gridTemplateAreas: '"meta form" "meta values" "error error"',
  },
  scriptFormBuilder: {
    gridTemplateColumns: '2fr 2fr',
    gridTemplateRows: '1fr 1fr 0fr',
    gridTemplateAreas: '"meta form" "hook values" "error error"',
  },
  readme: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas: '"rule" "result"',
  },
};
