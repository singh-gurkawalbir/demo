import React from 'react';
import { useSelector } from 'react-redux';
import DynaText from '../DynaText';
import { selectors } from '../../../../reducers';

export default function DynaTextWithConnectionContext(props) {
  const { formKey, resourceId, resourceType } = props;

  const isVisible = useSelector(state => {
    const requestMediaType = selectors.fieldState(state, formKey, 'http.requestMediaType')?.value;
    const resource = selectors.resource(state, resourceType, resourceId);
    const connection = selectors.resource(state, 'connections', resource?._connectionId);
    const connMediaType = connection?.http?.mediaType;

    if (requestMediaType) {
      return requestMediaType === 'json' || requestMediaType === 'urlencoded';
    } if (connMediaType === 'json' || connMediaType === 'urlencoded') {
      return true;
    }

    return false;
  });

  return isVisible ? (
    <DynaText {...props} />
  ) : null;
}
