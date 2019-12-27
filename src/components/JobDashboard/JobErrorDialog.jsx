import { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import actions from '../../actions';
import * as selectors from '../../reducers';
import JobErrorTable from './JobErrorTable';
import Spinner from '../Spinner';
import ModalDialog from '../ModalDialog';
import Help from '../Help';

const useStyles = makeStyles(theme => ({
  /**
   * TODO Azhar needs to fix the styles so that the help icon shows on the left side of the close icon.
   */
  iconButton: {
    color: theme.palette.text.hint,
    '&:hover': {
      background: theme.palette.background.paper,
      '& > span': {
        color: theme.palette.primary.main,
      },
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
  parentJobId,
  showResolved,
  numError = 0,
  numResolved = 0,
  onCloseClick,
  integrationName,
}) {
  const dispatch = useDispatch();
  const [childJobId, setChildJobId] = useState(parentJobId ? jobId : undefined);
  const [errorCount, setErrorCount] = useState(
    childJobId ? numError + numResolved : undefined
  );
  const flowJob = useSelector(state =>
    selectors.flowJob(state, { jobId: parentJobId || jobId })
  );
  const [flowJobChildrenLoaded, setFlowJobChildrenLoaded] = useState(
    !!(flowJob && flowJob.children && flowJob.children.length > 0)
  );

  useEffect(
    () => () => {
      dispatch(actions.job.error.clear());
    },
    [dispatch]
  );

  useEffect(() => {
    if (flowJob && flowJob.children && flowJob.children.length > 0) {
      setFlowJobChildrenLoaded(true);
    }
  }, [flowJob]);

  useEffect(() => {
    if (childJobId) {
      if (errorCount < 1000) {
        dispatch(
          actions.job.requestErrors({
            jobId: childJobId,
          })
        );
      }
    } else if (flowJobChildrenLoaded) {
      const jobWithErrors = flowJob.children.find(j =>
        showResolved ? j.numResolved > 0 : j.numError > 0
      );

      if (jobWithErrors) {
        setErrorCount(jobWithErrors.numError + jobWithErrors.numResolved);
        setChildJobId(jobWithErrors._id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, childJobId, flowJobChildrenLoaded]);

  let job;

  if (childJobId) {
    job = flowJob.children.find(j => j._id === childJobId);
  }

  const jobErrors = useSelector(state =>
    selectors.jobErrors(state, childJobId)
  );

  function handleCloseClick() {
    onCloseClick();
  }

  const classes = useStyles();

  return (
    <ModalDialog show minWidth="md" maxWidth="xl" onClose={handleCloseClick}>
      <Fragment>
        <div>{`${integrationName} > ${flowJob && flowJob.name}`}</div>

        <Help
          key="help-helpSummary"
          data-test="help-helpSummary"
          title="Job Errors"
          className={classes.iconButton}
          helpKey="jobErrors.helpSummary"
          fieldId="helpSummary"
          resourceType="jobErrors"
        />
      </Fragment>

      <div>
        {!job ? (
          <div className={classes.spinner}>
            <Spinner /> <span>Loading child jobs...</span>
          </div>
        ) : (
          <JobErrorTable
            jobErrors={jobErrors}
            errorCount={errorCount}
            job={job}
            onCloseClick={onCloseClick}
          />
        )}
      </div>
    </ModalDialog>
  );
}

export default JobErrorDialog;
