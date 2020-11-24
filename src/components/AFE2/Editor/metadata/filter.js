import DataPanel from '../panels/Data';
import ResultPanel from '../panels/Result';
import FilterPanel from '../panels/Filter';

export default {
  type: 'filter',
  label: 'Filter editor',
  description: 'Constructs filter rules against raw data',
  layout: 'compact',
  panels: [
    {
      title: 'Rules',
      area: 'rule',
      Panel: FilterPanel,
    },
    {
      title: 'Input',
      area: 'data',
      Panel: DataPanel,
      props: {
        mode: 'json',
      },
    },
    {
      title: 'Output',
      area: 'result',
      Panel: ResultPanel,
      props: {
        mode: 'text',
      },
    },
  ],
};
