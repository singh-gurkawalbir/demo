import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import XmlParseRules from '../Editor/panels/XmlParseRules';

export default {
  type: 'xmlParser',
  fieldId: 'file.xml',
  label: 'XML parser',
  description: 'Converts XML data into JSON',
  panels: [
    {
      title: 'Parse options',
      area: 'rule',
      Panel: XmlParseRules,
    },
    {
      title: 'XML document',
      area: 'data',
      Panel: DataPanel,
      props: {
        mode: 'xml',
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
