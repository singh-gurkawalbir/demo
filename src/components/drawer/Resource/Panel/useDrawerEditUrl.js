import { useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';

export default function useDrawerEditUrl(resourceType, id, pathname) {
  const segments = pathname.split('/');
  const { length } = segments;
  const lookupProcessorResource = useSelector(state =>
    selectors.lookupProcessorResourceType(state, id)
  );

  segments[length - 1] = id;
  segments[length - 3] = 'edit';

  if (resourceType === 'pageGenerator') {
    segments[length - 2] = 'exports';
  } else if (resourceType === 'pageProcessor') {
    segments[length - 2] = lookupProcessorResource;
  }

  const url = segments.join('/');

  return url;
}
