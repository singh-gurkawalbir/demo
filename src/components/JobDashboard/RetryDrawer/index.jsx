import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { makeStyles, Button, Typography } from '@material-ui/core';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import Spinner from '../../Spinner';
import CodeEditor from '../../CodeEditor';
import ButtonGroup from '../../ButtonGroup';

const useStyles = makeStyles(theme => ({
  spinner: {
    marginRight: theme.spacing(1),
  },
  errorText: {
    margin: theme.spacing(1),
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

function RetryForm({jobId, flowJobId}) {
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
    return <Spinner className={classes.spinner} />;
  }

  const disabled = !!error || !touched;

  return (
    <>
      <DrawerContent>
        <div className={classes.content}>
          <CodeEditor name="retryEditor" mode="json" value={data} onChange={handleChange} />
          {error && <Typography className={classes.errorText} component="div" color="error">{error}</Typography>}
        </div>
      </DrawerContent>

      <DrawerFooter>
        <ButtonGroup>
          <Button disabled={disabled} variant="outlined" color="primary" onClick={handleSave}>Save</Button>
          <Button disabled={disabled} variant="outlined" color="secondary" onClick={handleSaveAndClose}>Save & close</Button>
          <Button
            variant="text"
            // eslint-disable-next-line react/jsx-handler-names
            onClick={history.goBack}>Cancel
          </Button>
        </ButtonGroup>
        <Button disabled={!!error || touched} variant="outlined" color="secondary" onClick={handleRetry}>Retry</Button>
      </DrawerFooter>
    </>
  );
}

export default function RetryDrawer({height, jobId, flowJobId}) {
  return (
    <RightDrawer
      path="editRetry/:retryId"
      height={height}
      width="large"
      variant="permanent">
      <DrawerHeader title="Edit retry data" />
      <RetryForm jobId={jobId} flowJobId={flowJobId} />
    </RightDrawer>
  );
}
