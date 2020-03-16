import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';

export default function DebugOnly({ children }) {
  const debug = useSelector(state => {
    const { debug } = selectors.userPreferences(state);

    return !!debug;
  });

  if (debug) {
    return children || null;
  }

  return null;
}
