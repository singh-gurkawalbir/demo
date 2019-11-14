import { useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import LoadResources from '../../../../components/LoadResources';

export default function CloneCrumb({ resourceId, resourceType }) {
  const resource = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)
  );

  return (
    <LoadResources resources={resourceType}>
      {resource ? resource.name : MODEL_PLURAL_TO_LABEL[resourceType]}
    </LoadResources>
  );
}
