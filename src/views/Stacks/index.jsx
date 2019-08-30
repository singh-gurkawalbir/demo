import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RowDetail from './RowDetail';
import ResourceList from '../../components/ResourceList';
import LoadResources from '../../components/LoadResources';
import actions from '../../actions';
import * as selectors from '../../reducers';

export default function Stacks() {
  const dispatch = useDispatch();
  const resourceList = useSelector(state =>
    selectors.resourceList(state, { type: 'sshares' })
  );

  useEffect(() => {
    dispatch(actions.resource.requestCollection('sshares'));
  }, [dispatch]);

  return (
    <LoadResources resources={['stacks']}>
      <ResourceList resourceType="stacks" displayName="Stacks">
        <RowDetail stackShareCollection={resourceList.resources} />
      </ResourceList>
    </LoadResources>
  );
}
