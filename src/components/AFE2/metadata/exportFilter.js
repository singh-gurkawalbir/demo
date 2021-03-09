import ToggleFilterMode from '../Drawer/actions/ToggleFilterMode';
import filterMetadata from './filter';
import javascriptMetadata from './javascript';

export default {
  type: 'exportFilter',
  label: 'Define output filter',
  description: 'Filters data',
  panels: ({ activeProcessor }) => {
    if (activeProcessor === 'javascript') {
      return javascriptMetadata.panels;
    }

    return filterMetadata.panels;
  },
  drawer: {
    showLayoutToggle: true,
    actions: [
      { component: ToggleFilterMode, position: 'right' },
    ],
  },
};
