import ToggleFilterMode from '../Drawer/actions/ToggleFilterMode';
import ToggleLayout from '../Drawer/actions/ToggleLayout';
import filterMetadata from './filter';
import javascriptMetadata from './javascript';

export default {
  type: 'inputFilter',
  label: 'Define input filter',
  description: 'Filters data for PP',
  panels: ({ activeProcessor }) => {
    if (activeProcessor === 'javascript') {
      return javascriptMetadata.panels;
    }

    return filterMetadata.panels;
  },
  drawer: {
    actions: [ToggleFilterMode, ToggleLayout],
  },
};
