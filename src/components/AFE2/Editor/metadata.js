import DataPanel from './panels/DataPanel';
import ResultPanel from './panels/ResultPanel';
import CsvParseRules from './panels/CsvParseRules';

export default {
  csvParse: {
    type: 'csvParse',
    label: 'CSV Parser',
    description: 'Converts delimited data into JSON',
    layout: 'compact',
    panels: [
      {
        title: 'Parse options',
        area: 'rule',
        Panel: CsvParseRules,
      },
      {
        title: 'Input data',
        area: 'data',
        Panel: DataPanel,
        props: {
          mode: 'text',
        },
      },
      {
        title: 'Output record',
        area: 'result',
        Panel: ResultPanel,
        props: {
          mode: 'json',
        },
      },
    ],
  },
  ediParse: {
    type: 'ediParse',
    label: 'EDI Parser',
    description: 'Converts EDI files into JSON',
  },
  xmlParse: {
    type: 'xmlParse',
    label: 'XML Parser',
    description: 'Converts XML into JSON',
  },
  settingsForm: {
    type: 'settingsForm',
    label: 'Form builder',
    description: 'Construct a form from metadata',
  },
};

