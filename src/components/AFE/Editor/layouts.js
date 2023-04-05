export default {
  // Make sure all the grid-template-areas to be in a string in one line .
  compact: {
    gridTemplateColumns: '1fr auto 1fr',
    gridTemplateRows: '1fr auto 1fr auto 0fr',
    gridTemplateAreas:
      '"rule dragBar_v_0 data" "rule dragBar_v_0 dragBar_h_0" "rule dragBar_v_0 result" "dragBar_h_1 dragBar_h_1 dragBar_h_1" "error error error"',
  },
  compact2: {
    gridTemplateColumns: '1fr 1fr 1fr auto 1fr',
    gridTemplateRows: '1fr auto 1fr auto 0fr',
    gridTemplateAreas:
      '"rule rule rule dragBar_v_0 data" "rule rule rule dragBar_v_0 dragBar_h_0" "rule rule rule dragBar_v_0 result" "dragBar_h_1 dragBar_h_1 dragBar_h_1 dragBar_h_1 dragBar_h_1" "error error error error error"',
  },
  row: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr auto 1fr auto 1fr auto 0fr',
    gridTemplateAreas:
      '"rule" "dragBar_h_0" "data" "dragBar_h_1" "result" "dragBar_h_2" "error"',
  },
  compactRow: {
    gridTemplateColumns: '1fr auto 1fr',
    gridTemplateRows: '1fr auto 1fr auto 0fr',
    gridTemplateAreas:
      '"rule rule rule" "dragBar_h_0 dragBar_h_0 dragBar_h_0" "data dragBar_v_0 result" "dragBar_h_1 dragBar_h_1 dragBar_h_1" "error error error"',
  },
  column: {
    gridTemplateColumns: '1fr auto 1fr auto 1fr',
    gridTemplateRows: '4fr auto 0fr',
    gridTemplateAreas:
      '"rule dragBar_v_0 data dragBar_v_1 result" "dragBar_h_0 dragBar_h_0 dragBar_h_0 dragBar_h_0 dragBar_h_0" "error error error error error"',
  },
  jsonFormBuilder: {
    gridTemplateColumns: '2fr auto 2fr',
    gridTemplateRows: '1fr auto 1fr auto 0fr',
    gridTemplateAreas:
      '"meta dragBar_v_0 form" "meta dragBar_v_0 dragBar_h_0" "meta dragBar_v_0 values" "dragBar_h_1 dragBar_h_1 dragBar_h_1" "error error error"',
  },
  scriptFormBuilder: {
    gridTemplateColumns: '2fr auto 2fr',
    gridTemplateRows: '1fr auto 1fr auto 0fr',
    gridTemplateAreas:
      '"meta dragBar_v_0 form" "dragBar_h_0 dragBar_h_0 dragBar_h_0" "hook dragBar_v_1 values" "dragBar_h_1 dragBar_h_1 dragBar_h_1" "error error error"',
  },
  readme: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr auto 1fr auto 0fr',
    gridTemplateAreas: '"rule" "dragBar_h_0" "result" "dragBar_h_1" "error"',
  },
  lookupFilter: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr',
    gridTemplateAreas: '"rule"',
  },
  assistantRight: {
    gridTemplateColumns: '1fr auto 1fr',
    gridTemplateRows: '1fr auto 0fr',
    gridTemplateAreas:
      '"rule dragBar_v_0 assistant" "dragBar_h_0 dragBar_h_0 dragBar_h_0" "error error error"',
  },
  assistantTopRight: {
    gridTemplateColumns: '1fr auto 1fr',
    gridTemplateRows: '1fr auto 1fr auto 0fr',
    gridTemplateAreas:
      '"rule dragBar_v_0 assistant" "dragBar_h_0 dragBar_h_0 dragBar_h_0" "data dragBar_v_1 result" "dragBar_h_1 dragBar_h_1 dragBar_h_1" "error error error"',
  },
};
