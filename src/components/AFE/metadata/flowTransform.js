import ToggleMode from '../Drawer/actions/ToggleMode';
import transformMetadata from './transform';
import javascriptMetadata from './javascript';

export default {
  type: 'flowTransform',
  label: 'Define transformation',
  description: 'Transforms raw data to desired structure',
  helpKey: 'lookup.transform',
  panels: ({ activeProcessor }) => {
    if (activeProcessor === 'javascript') {
      return javascriptMetadata.panels;
    }

    return transformMetadata.panels;
  },
  drawer: {
    showLayoutToggle: true,
    actions: [
      { component: ToggleMode, position: 'right', variant: 'transform' },
    ],
  },
};
