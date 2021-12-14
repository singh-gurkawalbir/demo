import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import { CeligoTabWrapper } from '../../../CeligoTabLayout/CeligoTabWrapper';
import CeligoPillTabs from '../../../CeligoTabLayout/CeligoPillTabs';
import CeligoTabPanel from '../../../CeligoTabLayout/CeligoTabPanel';
import DefaultPanel from '../../../CeligoTabLayout/CustomPanels/DefaultPanel';
import Spinner from '../../../Spinner';
import { getHttpReqResFields } from '../../../../utils/http';
import CodePanel from '../../../AFE/Editor/panels/Code';

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
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
}));

const defaultObj = {};

export default function ViewHttpRequestResponse({ flowId, resourceId, reqAndResKey, isRequest, isResourceNetsuite }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const httpDocStatus = useSelector(state =>
    selectors.errorHttpDocStatus(state, reqAndResKey)
  );
  const errorHttpDoc = useSelector(state =>
    selectors.errorHttpDoc(state, reqAndResKey, isRequest) || defaultObj
  );

  const formattedErrorHttpDoc = useMemo(() => getHttpReqResFields(errorHttpDoc, null, isResourceNetsuite), [errorHttpDoc, isResourceNetsuite]);

  const errorHttpDocError = useSelector(state =>
    selectors.errorHttpDocError(state, reqAndResKey)
  );

  useEffect(() => {
    if (!httpDocStatus) {
      dispatch(actions.errorManager.errorHttpDoc.request(flowId, resourceId, reqAndResKey));
    }
  }, [dispatch, flowId, resourceId, httpDocStatus, reqAndResKey]);

  if (httpDocStatus === 'requested') {
    return <Spinner centerAll />;
  }

  if (httpDocStatus === 'error' && errorHttpDocError) {
    return <div className={classes.error}> {errorHttpDocError} </div>;
  }

  return (
    <div className={classes.container}>
      {isResourceNetsuite ? (
        <CodePanel
          mode="text"
          name="error"
          readOnly
          value={formattedErrorHttpDoc}
          />
      )
        : (
          <CeligoTabWrapper>
            <CeligoPillTabs tabs={TABS} />
            <CeligoTabPanel panelId="body">
              <DefaultPanel value={formattedErrorHttpDoc.body} />
            </CeligoTabPanel>
            <CeligoTabPanel panelId="headers">
              <DefaultPanel value={formattedErrorHttpDoc.headers} />
            </CeligoTabPanel>
            <CeligoTabPanel panelId="others">
              <DefaultPanel value={formattedErrorHttpDoc.others} />
            </CeligoTabPanel>
          </CeligoTabWrapper>
        )}
    </div>
  );
}
