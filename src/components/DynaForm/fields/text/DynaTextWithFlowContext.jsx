import React from 'react';
import { useSelector } from 'react-redux';
import DynaText from '../DynaText';
import * as selectors from '../../../../reducers';

export default function DynaTextWithFlowContext(props) {
  const { flowId } = props;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));

  return !flow || (flow && !flow._keepDeltaBehindFlowId) ? (
    <DynaText {...props} />
  ) : null;
}
