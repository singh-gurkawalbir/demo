export default {
  global: {
    fullScreen: false,
    width: '70vw',
    height: '70vh',
    layout: 'Compact',
    autoEvaluate: true,

    showRules: true,
    rulesTitle: 'RULES',
    rulesMode: 'json',

    showData: true,
    dataTitle: 'DATA',
    dataMode: 'json',

    showResult: true,
    resultTitle: 'RESULT',
    resultMode: 'text',
  },
  handlebars: {
    layout: 'Row',
    width: '80vw',
    height: '60vh',
    rulesTitle: 'TEMPLATE',
    rulesMode: 'handlebars',
    dataTitle: 'SAMPLE DATA',
    resultTitle: 'RESULT',
  },
  javascript: {
    fullScreen: true,
    width: '80vw',
    height: '60vh',
    rulesTitle: 'SCRIPT',
    rulesMode: 'javascript',
    dataTitle: 'INPUT',
    resultTitle: 'OUTPUT',
  },
};
