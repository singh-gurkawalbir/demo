import DataPanel from '../panels/Data';
import ResultPanel from '../panels/Result';
import FilterPanel from '../panels/Filter';
import ToggleFilterMode from '../../Drawer/actions/ToggleFormMode';
import ToggleLayout from '../../Drawer/actions/ToggleLayout';

export default {
  type: 'filter',
  label: 'Filter editor',
  fieldId: 'transform',
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
  // sample metadata to support new features.
  drawer: {
    size: 'large',
    actions: [ToggleFilterMode, ToggleLayout],
  },
};
