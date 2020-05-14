import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../DynaForm';
import Spinner from '../../../../Spinner';
import useIntegration from '../../../../../hooks/useIntegration';

const useStyles = makeStyles({
  spinnerWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function FormView({
  resourceId,
  resourceType,
  onFormChange,
  onToggleClick,
  disabled,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const formState = useSelector(state =>
    selectors.customSettingsForm(state, resourceId)
  );
  const isDeveloper = useSelector(
    state => selectors.userProfile(state).developer
  );
  const integrationId = useIntegration(resourceType, resourceId);
  const isViewMode = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );

  useEffect(() => {
    // use effect will fire any time formState changes but...
    // Only if the formState is missing do we need to perform an init.
    if (!formState) {
      dispatch(actions.customSettings.formRequest(resourceType, resourceId));
    }
  }, [dispatch, formState, resourceId, resourceType]);

  useEffect(
    () => () => {
      // console.log('cleaned up');
      dispatch(actions.customSettings.formClear(resourceId));
    },
    [dispatch, resourceId]
  );

  if (formState && formState.error) {
    return (
      <div>
        <Typography>{formState.error}</Typography>
        {isDeveloper && (
          <Button variant="contained" onClick={onToggleClick}>
            Toggle form editor
          </Button>
        )}
      </div>
    );
  }

  if (!formState || formState.status === 'request') {
    return (
      <div className={classes.spinnerWrapper}>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {isDeveloper && !isViewMode && (
        <Button variant="contained" onClick={onToggleClick}>
          Toggle form editor
        </Button>
      )}
      <DynaForm
        key={formState.key}
        onChange={onFormChange}
        disabled={disabled}
        fieldMeta={formState.meta}
        resourceId={resourceId}
        resourceType={resourceType}
      />
    </div>
  );
}
