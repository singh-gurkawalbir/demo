import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RowDetail from './RowDetail';
import ResourceList from '../../components/ResourceList';
import LoadResources from '../../components/LoadResources';
import actions from '../../actions';
import * as selectors from '../../reducers';

export default function Stacks() {
  const dispatch = useDispatch();
  const stackShareCollection = useSelector(state =>
    selectors.getStackShareCollection(state)
  );

  useEffect(() => {
    dispatch(actions.stack.requestStackShareCollection());
  }, [dispatch]);

  return (
    <LoadResources resources={['stacks']}>
      <ResourceList resourceType="stacks" displayName="Stacks">
        <RowDetail stackShareCollection={stackShareCollection} />
      </ResourceList>
    </LoadResources>
  );
}
