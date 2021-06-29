import React from 'react';
import { useSelector } from 'react-redux';
import DynaText from '../DynaText';
import { selectors } from '../../../../reducers';

export default function DynaTextWithConnectionContext(props) {
  const { formKey, resourceId, resourceType } = props;

  // boolean once field is only visible if media type is either json or urlencoded
  const isVisible = useSelector(state => {
    const requestMediaType = selectors.fieldState(state, formKey, 'http.requestMediaType')?.value;
    const resource = selectors.resource(state, resourceType, resourceId);
    const connection = selectors.resource(state, 'connections', resource?._connectionId);
    const connMediaType = connection?.http?.mediaType;

    // give preference to override media type field
    if (requestMediaType === 'json' || requestMediaType === 'urlencoded') {
      return true;
    }
    if (connMediaType === 'json' || connMediaType === 'urlencoded') {
      return true;
    }

    return false;
  });

  return isVisible ? (
    <DynaText {...props} />
  ) : null;
}
