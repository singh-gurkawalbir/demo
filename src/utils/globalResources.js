import { useSelector } from 'react-redux';
import * as selectors from '../reducers';

export default function Resources(resourceType) {
  return useSelector(
    state => selectors.resourceList(state, { type: resourceType }).resources
  );
}
