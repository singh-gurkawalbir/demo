import ToggleTransformMode from '../Drawer/actions/ToggleTransformMode';
import transformMetadata from './transform';
import javascriptMetadata from './javascript';
import ViewAliases from '../Drawer/actions/ViewAliases';

export default {
  type: 'responseTransform',
  label: 'Define transformation',
  description: 'Transforms raw data to desired structure',
  helpKey: 'import.transform',
  panels: ({ activeProcessor }) => {
    if (activeProcessor === 'javascript') {
      return javascriptMetadata.panels;
    }

    return transformMetadata.panels;
  },
  drawer: {
    showLayoutToggle: true,
    actions: [
      { component: ViewAliases, position: 'right' },
      { component: ToggleTransformMode, position: 'right' },
    ],
  },
};
