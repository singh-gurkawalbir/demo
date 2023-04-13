/* eslint-disable react/jsx-handler-names */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import isEqual from 'lodash/isEqual';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { drawerPaths } from '../../../utils/rightDrawer';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import CodeEditor from '../../CodeEditor';
import SaveAndCloseButtonGroupAuto from '../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto';
import { useFormOnCancel } from '../../FormOnCancelContext';
import { getAsyncKey } from '../../../utils/saveAndCloseButtons';
import { message } from '../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  errorText: {
    margin: theme.spacing(1),
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

function RetryForm({jobId, flowJobId, asyncKey}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const retryId = match.params?.retryId;

  const [error, setError] = useState();
  const [touched, setTouched] = useState(false);
  const status = useSelector(state => selectors.asyncTaskStatus(state, asyncKey));
  const retryData = useSelector(state => {
    if (!retryId) return undefined;

    const meta = selectors.jobErrorRetryObject(state, retryId);

    return meta?.retryData;
  });

  const [data, setData] = useState(retryData?.data);
  const isDirty = useMemo(() => {
    let valueChanged;

    try {
      valueChanged = typeof data === 'string' ? !isEqual(JSON.parse(data), retryData?.data) : !isEqual(data, retryData?.data);
    } catch (e) {
      valueChanged = false;
    }

    return valueChanged;
  }, [data, retryData?.data]);

  const handleSave = useCallback(() => {
    const parsedData = JSON.parse(data);

    // console.log({ ...retryData, data: parsedData }, retryId);
    dispatch(
      actions.job.updateRetryData({
        retryId,
        retryData: { ...retryData, data: parsedData },
        asyncKey,
      })
    );
    setTouched(false);
  }, [dispatch, retryData, retryId, data, asyncKey]);

  const handleChange = useCallback(value => {
    try {
      JSON.parse(value);
      setError();
      setData(value);
      setTouched(true);
    } catch (e) {
      setError(message.RETRY.INVALID_JSON);
    }
  }, []);

  const handleRetry = useCallback(() => {
    dispatch(
      actions.job.retrySelectedRetries({
        jobId,
        flowJobId,
        selectedRetryIds: [retryId],
        match,
      })
    );
    history.goBack(2);
  }, [dispatch, flowJobId, history, jobId, match, retryId]);

  useEffect(() => {
    if (retryId && !retryData) {
      dispatch(actions.job.requestRetryData({ retryId }));
    }
  }, [dispatch, retryData, retryId]);

  useEffect(() => {
    if (retryData) {
      setData(retryData?.data);
    }
  }, [retryData]);

  if (!retryData) {
    return <Spinner center="screen" />;
  }

  return (
    <>
      <DrawerContent noPadding>
        <div className={classes.content}>
          <CodeEditor name="retryEditor" mode="json" value={data} onChange={handleChange} />
          {error && <Typography className={classes.errorText} component="div" color="error">{error}</Typography>}
        </div>
      </DrawerContent>

      <DrawerFooter>
        <SaveAndCloseButtonGroupAuto
          asyncKey={asyncKey}
          isDirty={isDirty}
          status={status}
          onClose={history.goBack}
          onSave={handleSave}
          shouldHandleCancel
          />
        <Button disabled={!!error || touched} variant="outlined" color="secondary" onClick={handleRetry}>Retry</Button>
      </DrawerFooter>
    </>
  );
}

export default function RetryDrawer({height, jobId, flowJobId}) {
  const asyncKey = getAsyncKey(`retryDrawer-${jobId}`, flowJobId); // added retryDrawer to make it unique
  const {setCancelTriggered, disabled} = useFormOnCancel(asyncKey);

  return (
    <RightDrawer
      path={drawerPaths.ERROR_MANAGEMENT.V1.JOB_EDIT_RETRY}
      height={height}
      width="large" >
      <DrawerHeader handleClose={setCancelTriggered} disableClose={disabled} title="Edit retry data" />
      <RetryForm asyncKey={asyncKey} jobId={jobId} flowJobId={flowJobId} />
    </RightDrawer>
  );
}
