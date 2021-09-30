import React from 'react';
import { useSelector } from 'react-redux';
import DynaText from '../DynaText';
import { selectors } from '../../../../reducers';

export default function DynaTextWithConnectionContext(props) {
  const { formKey, connectionId } = props;

  // boolean once field is only visible if media type is either json or urlencoded
  const isVisible = useSelector(state => {
    const requestMediaType = selectors.fieldState(state, formKey, 'http.requestMediaType')?.value;
    const connection = selectors.resource(state, 'connections', connectionId);
    const connMediaType = connection?.http?.mediaType;

    // give preference to override media type field
    if (requestMediaType === 'json' || requestMediaType === 'urlencoded') {
      return true;
    }
    if (!requestMediaType && (connMediaType === 'json' || connMediaType === 'urlencoded')) {
      return true;
    }

    return false;
  });

  return isVisible ? (
    <DynaText {...props} />
  ) : null;
}
