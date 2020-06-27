import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { makeStyles, Button, Typography } from '@material-ui/core';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import RightDrawer from '../../drawer/Right';
import Spinner from '../../Spinner';
import CodeEditor from '../../CodeEditor';
import ButtonGroup from '../../ButtonGroup';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: '100%',
  },
  actions: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    // height: theme.spacing(10),
    marginTop: theme.spacing(1),
    padding: theme.spacing(2, 0, 1, 0),
    display: 'flex',
    justifyContent: 'space-between',
  },
  spinner: {
    marginRight: theme.spacing(1),
  },
  errorText: {
    marginTop: theme.spacing(1),
  },
}));

function DrawerContent({jobId, flowJobId}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const retryId = match.params?.retryId;

  const [error, setError] = useState();
  const [touched, setTouched] = useState(false);

  const retryData = useSelector(state => {
    if (!retryId) return undefined;

    const meta = selectors.jobErrorRetryObject(state, retryId);
    return meta?.retryData;
  });

  const [data, setData] = useState(retryData?.data);

  const handleSave = useCallback(() => {
    const parsedData = JSON.parse(data);

    // console.log({ ...retryData, data: parsedData }, retryId);
    dispatch(
      actions.job.updateRetryData({
        retryId,
        retryData: { ...retryData, data: parsedData },
      })
    );
    setTouched(false);
  }, [dispatch, retryData, retryId, data]);

  const handleSaveAndClose = useCallback(() => {
    handleSave();
    history.goBack();
  }, [handleSave, history]);

  const handleChange = useCallback(value => {
    try {
      JSON.parse(value);
      setError();
      setData(value);
      setTouched(true);
    } catch (e) {
      setError('Your retry data is not a valid JSON object.');
    }
  }, []);

  const handleRetry = useCallback(() => {
    dispatch(
      actions.job.retrySelectedRetries({
        jobId, flowJobId, selectedRetryIds: [retryId],
      })
    );
    history.goBack(2);
  }, [dispatch, flowJobId, history, jobId, retryId]);

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
    return <Spinner className={classes.spinner} />;
  }

  const disabled = !!error || !touched;

  return (
    <div className={classes.root}>
      <CodeEditor name="retryEditor" mode="json" value={data} onChange={handleChange} />

      {error && <Typography className={classes.errorText} component="div" color="error">{error}</Typography>}

      <div className={classes.actions}>
        <ButtonGroup>
          <Button disabled={disabled} variant="outlined" color="primary" onClick={handleSave}>Save</Button>
          <Button disabled={disabled} variant="outlined" color="secondary" onClick={handleSaveAndClose}>Save and Close</Button>
          <Button
            variant="text"
            // eslint-disable-next-line react/jsx-handler-names
            onClick={history.goBack}>Cancel
          </Button>
        </ButtonGroup>
        <Button disabled={!!error || touched} variant="outlined" color="secondary" onClick={handleRetry}>Retry</Button>
      </div>
    </div>
  );
}

export default function RetryDrawer({height, jobId, flowJobId}) {
  return (
    <RightDrawer
      path="editRetry/:retryId"
      height={height}
      width="medium"
      title="Edit retry data"
      variant="permanent">
      <DrawerContent jobId={jobId} flowJobId={flowJobId} />
    </RightDrawer>
  );
}
