import javascriptMetadata from './javascript';

export default {
  type: 'postResponseMapHook',
  label: 'Script editor',
  description: 'Run JavaScript safely in a secure runtime environment.',
  panels: () => javascriptMetadata.panels,
};
