import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../DynaForm';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import Spinner from '../../../../Spinner';
import useIntegration from '../../../../../hooks/useIntegration';

const useStyles = makeStyles({
  spinnerWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: 'auto',
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

  // TODO:verify this behaviour
  const formKey = useFormInitWithPermissions({
    remount: formState.key,
    onChange: onFormChange,
    disabled,
    fieldMeta: formState.meta,
    resourceId,
    resourceType,
  });

  if (formState && formState.error) {
    return (
      <div>
        <Typography>{formState.error}</Typography>
        {isDeveloper && !isViewMode && (
          <Button
            data-test="toggleEditor"
            variant="contained"
            onClick={onToggleClick}>
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
        <Button
          data-test="toggleEditor"
          variant="outlined"
          color="secondary"
          onClick={onToggleClick}>
          Toggle form editor
        </Button>
      )}
<<<<<<< HEAD
      <DynaForm formKey={formKey} fieldMeta={formState.meta} />
    </Fragment>
=======
      <DynaForm
        key={formState.key}
        onChange={onFormChange}
        disabled={disabled}
        fieldMeta={formState.meta}
        resourceId={resourceId}
        resourceType={resourceType}
      />
    </div>
>>>>>>> f57506aa55763abb028d86ba3998e62e56af8e72
  );
}
