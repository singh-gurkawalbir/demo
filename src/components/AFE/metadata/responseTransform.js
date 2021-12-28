import ToggleTransformMode from '../Drawer/actions/ToggleTransformMode';
import transformMetadata from './transform';
import javascriptMetadata from './javascript';
import ResponseTransformTitleHelp from '../Editor/panels/Transform/ResponseTransformTitleHelp';

export default {
  type: 'responseTransform',
  label: 'Define transformation',
  description: 'Transforms raw data to desired structure',
  panels: ({ activeProcessor }) => {
    if (activeProcessor === 'javascript') {
      return javascriptMetadata.panels;
    }

    return transformMetadata.panels;
  },
  drawer: {
    showLayoutToggle: true,
    actions: [
      { component: ToggleTransformMode, position: 'right' },
      { component: ResponseTransformTitleHelp, position: 'left'},
    ],
  },
};
