import React, { useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import { CeligoTabWrapper } from '../../../CeligoTabLayout/CeligoTabWrapper';
import CeligoPillTabs from '../../../CeligoTabLayout/CeligoPillTabs';
import CeligoTabPanel from '../../../CeligoTabLayout/CeligoTabPanel';
import DefaultPanel from '../../../CeligoTabLayout/CustomPanels/DefaultPanel';
import PanelLoader from '../../../PanelLoader';

const TABS = [
  { label: 'Body', value: 'body' },
  { label: 'Headers', value: 'headers' },
  { label: 'Others', value: 'others' },
];

const HTTP_DOC = {
  body: { test: 5 },
  headers: { 'content-type': 'application/json' },
  others: { status: 200 },
};

const useStyles = makeStyles(theme => ({
  error: {
    marginTop: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.error.main,
  },
}));

export default function ViewHttpRequestResponse({ flowId, resourceId, reqAndResKey, isRequest }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const httpDocStatus = useSelector(state =>
    selectors.errorHttpDocStatus(state, reqAndResKey)
  );
  const errorHttpDoc = useSelector(state =>
    HTTP_DOC || selectors.errorHttpDoc(state, reqAndResKey, isRequest)
  );
  const errorHttpDocError = useSelector(state =>
    'S3 key is expired' || selectors.errorHttpDocError(state, reqAndResKey)
  );

  useEffect(() => {
    if (!httpDocStatus) {
      dispatch(actions.errorManager.errorHttpDoc.request(flowId, resourceId, reqAndResKey));
    }
  }, [dispatch, flowId, resourceId, httpDocStatus, reqAndResKey]);

  if (httpDocStatus === 'requested') {
    return <PanelLoader />;
  }

  if (httpDocStatus === 'error' && errorHttpDocError) {
    return <div className={classes.error}> {errorHttpDocError} </div>;
  }

  return (
    <CeligoTabWrapper>
      <CeligoPillTabs tabs={TABS} />
      <CeligoTabPanel panelId="body">
        <DefaultPanel value={errorHttpDoc.body} />
      </CeligoTabPanel>
      <CeligoTabPanel panelId="headers">
        <DefaultPanel value={errorHttpDoc.headers} />
      </CeligoTabPanel>
      <CeligoTabPanel panelId="others">
        <DefaultPanel value={errorHttpDoc.others} />
      </CeligoTabPanel>
    </CeligoTabWrapper>
  );
}
