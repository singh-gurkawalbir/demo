/* eslint-disable no-alert */
export default {
  integrations: {
    title: 'Jumpstart your data integration',
    subTitle: 'You can access, manage, and monitor flows within integrations on this page.',
    type: 'integrations',
    buttonLabel: 'create flow',
    linkLabel: 'Learn how to develop integrations in flow builder',
    handleButtonClick() {
      alert('Create Integrations button clicked');
    },
    handleLinkClick() {
      alert('integrations link clicked');
    },
  },
  connections: {
    title: 'You don’t have any connections',
    subTitle: 'You can create standalone connections and then add them to your various integrations as needed, as well as manage individual connections, on this page.',
    type: 'connections',
    buttonLabel: 'create connection',
    linkLabel: 'Learn how to establish connection',
    handleButtonClick() {
      alert('Create Connections button clicked');
    },
    handleLinkClick() {
      alert('connections link clicked');
    },
  },
  imports: {
    title: 'You don’t have any imports',
    subTitle: 'You can create standalone imports and then add them to your various integrations as needed, as well as manage individual imports, on this page.',
    type: 'imports',
    buttonLabel: 'create import',
    linkLabel: 'Learn more about imports',
    handleButtonClick() {
      alert('Create import button clicked');
    },
    handleLinkClick() {
      alert('import link clicked');
    },
  },
  exports: {
    title: 'You don’t have any exports',
    subTitle: 'You can create standalone exports and then add them to your various integrations as needed, as well as manage individual exports, on this page.',
    type: 'exports',
    buttonLabel: 'create export',
    linkLabel: 'Learn more about exports',
    handleButtonClick() {
      alert('Create export button clicked');
    },
    handleLinkClick() {
      alert('export link clicked');
    },
  },
  apitokens: {
    title: 'You don’t have any API tokens',
    subTitle: 'You can create standalone API tokens and then add them to your various integrations as needed, as well as manage individual API tokens, on this page.',
    type: 'apitokens',
    buttonLabel: 'create API token',
    linkLabel: 'Learn more about how to generate API tokens',
    handleButtonClick() {
      alert('Create Api tokens button clicked');
    },
    handleLinkClick() {
      alert('api tokens link clicked');
    },
  },
  agents: {
    title: 'You don’t have any agents',
    subTitle: 'You can create standalone agents and then add them to your various integrations as needed, as well as manage individual agents, on this page.',
    type: 'agents',
    buttonLabel: 'create agent',
    linkLabel: 'Integrate data through a firewall with an on-premise agent',
    handleButtonClick() {
      alert('Create agents button clicked');
    },
    handleLinkClick() {
      alert('agents link clicked');
    },
  },
  recyclebin: {
    title: 'Your recycle bin is empty.',
    subTitle: 'You can view all deleted items from your account on this page.',
    type: 'recyclebin',
  },

};
