import React, { useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import { CeligoTabWrapper } from '../../../CeligoTabLayout/CeligoTabWrapper';
import CeligoPillTabs from '../../../CeligoTabLayout/CeligoPillTabs';
import CeligoTabPanel from '../../../CeligoTabLayout/CeligoTabPanel';
import DefaultPanel from '../../../CeligoTabLayout/CustomPanels/DefaultPanel';
import DownloadBlobPanel from './DownloadBlobPanel';
import PanelLoader from '../../../PanelLoader';

const TABS = [
  { label: 'Body', value: 'body' },
  { label: 'Headers', value: 'headers' },
  { label: 'Other', value: 'others' },
];

const useStyles = makeStyles(theme => ({
  error: {
    marginTop: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.error.main,
  },
  container: {
    height: '95%',
    margin: theme.spacing(2),
  },
}));

const defaultObj = {};

export default function ViewHttpRequestResponse({ flowId, resourceId, reqAndResKey, isRequest }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const httpDocStatus = useSelector(state =>
    selectors.errorHttpDocStatus(state, reqAndResKey)
  );
  const errorHttpDoc = useSelector(state =>
    selectors.errorHttpDoc(state, reqAndResKey, isRequest) || defaultObj
  );
  const errorHttpDocError = useSelector(state =>
    selectors.errorHttpDocError(state, reqAndResKey)
  );

  const s3BlobKey = useSelector(state =>
    selectors.s3HttpBlobKey(state, reqAndResKey, isRequest)
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
    <div className={classes.container}>
      <CeligoTabWrapper>
        <CeligoPillTabs tabs={TABS} />
        <CeligoTabPanel panelId="body">
          {
            s3BlobKey
              ? <DownloadBlobPanel flowId={flowId} resourceId={resourceId} s3BlobKey={s3BlobKey} />
              : <DefaultPanel value={errorHttpDoc.body} />
          }
        </CeligoTabPanel>
        <CeligoTabPanel panelId="headers">
          <DefaultPanel value={errorHttpDoc.headers} />
        </CeligoTabPanel>
        <CeligoTabPanel panelId="others">
          <DefaultPanel value={errorHttpDoc.others} />
        </CeligoTabPanel>
      </CeligoTabWrapper>
    </div>
  );
}
