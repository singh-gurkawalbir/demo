import { hot } from 'react-hot-loader';
import { Component } from 'react';
import RowDetail from './RowDetail';
import ResourceList from '../../components/ResourceList';
import LoadResources from '../../components/LoadResources';

@hot(module)
export default class Exports extends Component {
  render() {
    return (
      <LoadResources resources={['exports', 'connections']}>
        <ResourceList resourceType="exports" displayName="Exports">
          <RowDetail />
        </ResourceList>
      </LoadResources>
    );
  }
}
