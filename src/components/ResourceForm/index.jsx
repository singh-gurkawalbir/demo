import { Component } from 'react';
import ResourceForm from './GenericResourceForm';
import ConnectionForm from './ConnectionForm';

export default class ResourceFormFactory extends Component {
  render() {
    const { resourceType } = this.props;

    if (resourceType === 'connections') {
      return <ConnectionForm {...this.props} />;
    }

    return <ResourceForm {...this.props} />;
  }
}
