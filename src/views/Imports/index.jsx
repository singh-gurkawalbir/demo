import { hot } from 'react-hot-loader';
import { Component } from 'react';
import RowDetail from './RowDetail';
import ResourceList from '../../components/ResourceList';
import LoadResources from '../../components/LoadResources';

@hot(module)
export default class Imports extends Component {
  render() {
    return (
      <LoadResources resources={['imports', 'connections']}>
        <ResourceList resourceType="imports" displayName="Imports">
          <RowDetail />
        </ResourceList>
      </LoadResources>
    );
  }
}
