import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import JobErrorTable from './JobErrorTable';
import ModalDialog from '../../ModalDialog';
import Help from '../../Help';
import customCloneDeep from '../../../utils/customCloneDeep';

export default function JobErrorDialog({
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

  return (
    <ModalDialog show minWidth="md" maxWidth="xl" onClose={handleCloseClick}>
      <>
        <div>{`${job && job.name}`}</div>

        <Help
          data-test="help-helpSummary"
          title="Job Errors"
          sx={{
            position: 'absolute',
            top: 18,
            right: 70,
            color: 'text.hint',
            '&:hover': {
              bgcolor: 'background.paper',
              '& > span': {
                color: 'primary.main',
              },
            },
            '&:after': {
              content: '""',
              height: 18,
              width: 1,
              position: 'absolute',
              right: -10,
              bgcolor: 'secondary.lightest',
            },
          }}
          helpKey="jobErrors.helpSummary"
          fieldId="helpSummary"
          resourceType="jobErrors"
        />
      </>

      <div>
        <JobErrorTable
          jobErrors={customCloneDeep(jobErrors)}
          errorCount={numError}
          job={customCloneDeep(job)}
          onCloseClick={onCloseClick}
          ssLinkedConnectionId={ssLinkedConnectionId}
          integrationId={integrationId}
        />
      </div>
    </ModalDialog>
  );
}
