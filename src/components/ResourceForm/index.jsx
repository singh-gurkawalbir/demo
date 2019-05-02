import { Component } from 'react';
import ResourceForm from './GenericResourceForm';
import ConnectionForm from './ConnectionForm';

const connectionFormConnections = ['ftp', 's3'];

export default class ResourceFormFactory extends Component {
  render() {
    const { resourceType, resource } = this.props;

    if (
      resourceType === 'connections' &&
      resource &&
      connectionFormConnections.includes(resource.type)
    ) {
      return <ConnectionForm {...this.props} />;
    }

    return <ResourceForm {...this.props} />;
  }
}
