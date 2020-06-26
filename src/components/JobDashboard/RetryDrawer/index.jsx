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
    padding: theme.spacing(2, 2, 2, 2),
  },
  spinner: {
    marginRight: theme.spacing(1),
  },
}));

function DrawerContent() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const retryId = match.params?.retryId;

  const retryData = useSelector(state => {
    if (!retryId) return undefined;

    const meta = selectors.jobErrorRetryObject(state, retryId);
    return meta?.retryData;
  });

  const [data, setData] = useState(retryData?.data);
  const [error, setError] = useState();

  const handleSubmit = useCallback(() => {
    const parsedData = JSON.parse(data);

    // console.log({ ...retryData, data: parsedData }, retryId);
    dispatch(
      actions.job.updateRetryData({
        retryId,
        retryData: { ...retryData, data: parsedData },
      })
    );
  }, [dispatch, retryData, retryId, data]);

  const handleChange = useCallback(value => {
    try {
      JSON.parse(value);
      setError();
      setData(value);
    } catch (e) {
      setError('Your retry data is not a valid JSON object.');
    }
  }, []);

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

  return (
    <div className={classes.root}>
      <CodeEditor name="retryEditor" mode="json" value={data} onChange={handleChange} />
      {error && <Typography component="div" color="error">{error}</Typography>}
      <ButtonGroup className={classes.actions}>
        <Button disabled={!!error} variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
        <Button disabled={!!error} variant="contained" onClick={handleSubmit}>Save and Close</Button>
        <Button
          variant="text"
          // eslint-disable-next-line react/jsx-handler-names
          onClick={history.goBack}>Cancel
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default function RetryDrawer() {
  return (
    <RightDrawer
      path="editRetry/:retryId"
      height="short"
      width="medium"
      title="Edit retry data"
      variant="permanent">
      <DrawerContent />
    </RightDrawer>
  );
}
