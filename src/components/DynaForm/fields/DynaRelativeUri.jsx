import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import DynaURI from './DynaURI';

export default function DynaRelativeUri({ value, arrayIndex, ...props }) {
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', props.connectionId)
  );
  const description = useMemo(() => {
    const { type } = connection || {};

    return type === 'http' || type === 'rest'
      ? `Relative to: ${connection[type].baseURI}`
      : '';
  }, [connection]);
  const inputValue = useMemo(
    () =>
      typeof arrayIndex === 'number' && Array.isArray(value)
        ? value[arrayIndex]
        : value,
    [arrayIndex, value]
  );

  return <DynaURI {...props} value={inputValue} description={description} />;
}
