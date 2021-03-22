import React, { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { selectors } from '../../../reducers';
import { CeligoTabWrapper } from '../../CeligoTabLayout/CeligoTabWrapper';
import CeligoPillTabs from '../../CeligoTabLayout/CeligoPillTabs';
import RequestResponsePanel from '../../CeligoTabLayout/CustomPanels/RequestResponsePanel';
import CeligoTabPanel from '../../CeligoTabLayout/CeligoTabPanel';
import actions from '../../../actions';
import Spinner from '../../Spinner';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';

const tabs = [
  { label: 'HTTP request', value: 'request' },
  { label: 'HTTP response', value: 'response' },
];

export default function PreviewLogDetails({ flowId, exportId }) {
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const activeLogKey = useSelector(state => selectors.activeLogKey(state, exportId));
  const logDetails = useSelector(state => selectors.logDetails(state, exportId, activeLogKey), shallowEqual);
  const {changeIdentifier, key: errorKey, error: errorMsg} = useSelector(state => selectors.listenerErrorMsg(state, exportId), shallowEqual);

  useEffect(() => {
    if (activeLogKey) {
      dispatch(actions.logs.listener.requestLogDetails(flowId, exportId, activeLogKey));
    }
  }, [dispatch, exportId, flowId, activeLogKey]);

  useEffect(() => {
    if (errorKey && errorMsg) {
      enqueueSnackbar({
        message: `${errorKey}: ${errorMsg}`,
        variant: 'error',
      });
    }
    // only if we have the failed action again, we show the error msg
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeIdentifier]);

  const { status } = logDetails;
  const { request, response } = logDetails;

  if (status === 'requested') {
    return <Spinner />;
  }

  return (
    <CeligoTabWrapper>
      <CeligoPillTabs tabs={tabs} />
      <CeligoTabPanel panelId="request">
        <RequestResponsePanel value={request} />
      </CeligoTabPanel>
      <CeligoTabPanel panelId="response">
        <RequestResponsePanel value={response} />
      </CeligoTabPanel>
    </CeligoTabWrapper>
  );
}
