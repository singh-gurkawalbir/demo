import ToggleTransformMode from '../Drawer/actions/ToggleTransformMode';
import ToggleLayout from '../Drawer/actions/ToggleLayout';
import transformMetadata from './transform';
import javascriptMetadata from './javascript';

export default {
  type: 'flowTransform',
  label: 'Define transformation',
  description: 'Transforms raw data to desired structure',
  panels: ({ activeProcessor }) => {
    if (activeProcessor === 'javascript') {
      return javascriptMetadata.panels;
    }

    return transformMetadata.panels;
  },
  drawer: {
    size: 'large',
    actions: [ToggleTransformMode, ToggleLayout],
  },
};
