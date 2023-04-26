import React, { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../reducers';
import { CeligoTabWrapper } from '../../CeligoTabLayout/CeligoTabWrapper';
import CeligoPillTabs from '../../CeligoTabLayout/CeligoPillTabs';
import RequestResponsePanel from '../../CeligoTabLayout/CustomPanels/RequestResponsePanel';
import CeligoTabPanel from '../../CeligoTabLayout/CeligoTabPanel';
import actions from '../../../actions';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';

const useStyles = makeStyles({
  previewWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
  },
});
const tabs = [
  { label: 'HTTP request', value: 'request' },
  { label: 'HTTP response', value: 'response' },
];

export default function PreviewLogDetails({ flowId, resourceId }) {
  const classes = useStyles();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const activeLogKey = useSelector(state => selectors.activeLogKey(state, resourceId));
  const logDetails = useSelector(state => selectors.logDetails(state, resourceId, activeLogKey), shallowEqual);
  const {changeIdentifier, key: errorKey, error: errorMsg} = useSelector(state => selectors.flowStepErrorMsg(state, resourceId), shallowEqual);

  useEffect(() => {
    if (activeLogKey) {
      dispatch(actions.logs.flowStep.requestLogDetails(flowId, resourceId, activeLogKey));
    }
  }, [dispatch, resourceId, flowId, activeLogKey]);

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
    return <Spinner center="screen" />;
  }

  return (
    <div className={classes.previewWrapper}>
      <CeligoTabWrapper>
        <CeligoPillTabs tabs={tabs} />
        <CeligoTabPanel panelId="request">
          <RequestResponsePanel value={request} />
        </CeligoTabPanel>
        <CeligoTabPanel panelId="response">
          <RequestResponsePanel value={response} />
        </CeligoTabPanel>
      </CeligoTabWrapper>
    </div>
  );
}
