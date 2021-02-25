import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import CsvGenerateRules from '../Editor/panels/CsvGenerateRules';

export default {
  type: 'csvGenerator',
  fieldId: 'file.csv',
  label: 'CSV generator helper',
  description: 'Converts JSON data into delimited file',
  panels: [
    {
      title: 'CSV generator options',
      area: 'rule',
      Panel: CsvGenerateRules,
    },
    {
      title: 'Sample flow data',
      area: 'data',
      Panel: DataPanel,
      props: {
        mode: 'json',
      },
    },
    {
      title: 'Generated CSV file',
      area: 'result',
      Panel: ResultPanel,
    },
  ],
};
