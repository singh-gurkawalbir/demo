import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';

export default function ResourceName({resourceType, resourceId}) {
  return useSelector(state =>
    selectors.resource(state, resourceType, resourceId)?.name || resourceId
  );
}
