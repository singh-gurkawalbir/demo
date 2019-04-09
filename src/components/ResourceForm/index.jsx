import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ResourceForm from './GenericResourceForm';
import ConnectionForm from './ConnectionForm';

@withStyles(theme => ({
  actions: {
    textAlign: 'right',
    padding: theme.spacing.unit / 2,
  },
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}))
export default class ResourceFormFactory extends Component {
  render() {
    const { resourceType, resource } = this.props;

    if (resourceType === 'connections' && resource && resource.type === 'ftp') {
      return <ConnectionForm {...this.props} />;
    }

    return <ResourceForm {...this.props} />;
  }
}
