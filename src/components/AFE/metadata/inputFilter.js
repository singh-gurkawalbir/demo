import ToggleMode from '../Drawer/actions/ToggleMode';
import filterMetadata from './filter';
import javascriptMetadata from './javascript';

export default {
  type: 'inputFilter',
  label: 'Define input filter',
  helpKey: 'afe.filters',
  description: 'Filters data for PP',
  panels: ({ activeProcessor }) => {
    if (activeProcessor === 'javascript') {
      return javascriptMetadata.panels;
    }

    return filterMetadata.panels;
  },
  drawer: {
    showLayoutToggle: true,
    actions: [
      { component: ToggleMode, position: 'right', type: 'filter' },
    ],
  },
};
