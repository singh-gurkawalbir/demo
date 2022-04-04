import ToggleFilterMode from '../Drawer/actions/ToggleFilterMode';
import ViewAliases from '../Drawer/actions/ViewAliases';
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
      { component: ViewAliases, position: 'right' },
      { component: ToggleFilterMode, position: 'right' },
    ],
  },
};
