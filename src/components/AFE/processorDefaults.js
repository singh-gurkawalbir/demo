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
    rulesShowGutter: false,

    showData: true,
    dataTitle: 'DATA',
    dataMode: 'json',
    dataShowGutter: false,

    showResult: true,
    resultTitle: 'RESULT',
    resultMode: 'text',
    resultShowGutter: false,
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
    rulesShowGutter: true,
    dataTitle: 'INPUT',
    dataShowGutter: true,
    resultTitle: 'OUTPUT',
  },
};
