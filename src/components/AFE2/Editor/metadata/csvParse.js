import DataPanel from '../panels/Data';
import ResultPanel from '../panels/Result';
import CsvParseRules from '../panels/CsvParseRules';

export default {
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
};
