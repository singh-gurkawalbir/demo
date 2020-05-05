import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';

export default function DebugOnly({ children }) {
  const debugOn = useSelector(state => selectors.debugOn(state));

  if (debugOn) {
    return children || null;
  }

  return null;
}
