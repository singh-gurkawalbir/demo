import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import JobErrorTable from './JobErrorTable';
import ModalDialog from '../../ModalDialog';
import Help from '../../Help';

const useStyles = makeStyles(theme => ({
  iconButton: {
    position: 'absolute',
    top: 18,
    right: 70,
    padding: 0,
    color: theme.palette.text.hint,
    '&:hover': {
      background: theme.palette.background.paper,
      '& > span': {
        color: theme.palette.primary.main,
      },
    },
    '&:after': {
      content: '""',
      height: 18,
      width: 1,
      position: 'absolute',
      right: -10,
      background: theme.palette.secondary.lightest,
    },
  },
  spinner: {
    left: '0px',
    right: '0px',
    background: 'rgba(106, 123, 137, 0.7)',
    width: '100%',
    position: 'absolute',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'inherit',
    '& div': {
      width: '20px !important',
      height: '20px !important',
    },
    '& span': {
      marginLeft: '10px',
      color: theme.palette.background.paper,
    },
  },
}));

function JobErrorDialog({
  jobId,
  jobType,
  numError = 0,
  onCloseClick,
  ssLinkedConnectionId,
  integrationId,
}) {
  const dispatch = useDispatch();
  const job = useSelector(state =>
    selectors.suiteScriptJob(state, {
      ssLinkedConnectionId,
      integrationId,
      jobId,
      jobType,
    })
  );

  useEffect(
    () => () => {
      dispatch(actions.suiteScript.job.error.clear());
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(
      actions.suiteScript.job.requestErrors({
        ssLinkedConnectionId,
        integrationId,
        jobId,
        jobType,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, ssLinkedConnectionId, integrationId, jobId, jobType]);

  const jobErrors = useSelector(state =>
    selectors.suiteScriptJobErrors(state, { jobId, jobType })
  );

  function handleCloseClick() {
    onCloseClick();
  }

  const classes = useStyles();

  return (
    <ModalDialog show minWidth="md" maxWidth="xl" onClose={handleCloseClick}>
      <>
        <div>{`${job && job.name}`}</div>

        <Help
          key="help-helpSummary"
          data-test="help-helpSummary"
          title="Job Errors"
          className={classes.iconButton}
          helpKey="jobErrors.helpSummary"
          fieldId="helpSummary"
          resourceType="jobErrors"
        />
      </>

      <div>
        <JobErrorTable
          jobErrors={jobErrors}
          errorCount={numError}
          job={job}
          onCloseClick={onCloseClick}
          ssLinkedConnectionId={ssLinkedConnectionId}
          integrationId={integrationId}
        />
      </div>
    </ModalDialog>
  );
}

export default JobErrorDialog;
