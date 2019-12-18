import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import DynaText from './DynaText';
import * as selectors from '../../../reducers';

export default function DynaLagOffset(props) {
  const { flowId } = props;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));

  return (
    <Fragment>
      {(flow ? !flow._keepDeltaBehindFlowId : true) && <DynaText {...props} />}
    </Fragment>
  );
}
