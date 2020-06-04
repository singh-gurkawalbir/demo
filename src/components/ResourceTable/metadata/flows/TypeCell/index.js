// import React from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';

export default function TypeCell({ flowId }) {
  const type = useSelector(state => selectors.flowType(state, flowId));

  return type;
}
