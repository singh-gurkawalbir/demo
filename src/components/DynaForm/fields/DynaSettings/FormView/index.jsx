import { useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../DynaForm';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';

export default function FormView({
  resourceId,
  resourceType,
  onFormChange,
  onToggleClick,
  disabled,
}) {
  const dispatch = useDispatch();
  const formState = useSelector(state =>
    selectors.customSettingsStatus(state, resourceId)
  );
  const isDeveloper = useSelector(
    state => selectors.userProfile(state).developer
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
      <Fragment>
        <Typography>{formState.error.message}</Typography>
        {isDeveloper && (
          <Button variant="contained" onClick={onToggleClick}>
            Toggle form editor
          </Button>
        )}
      </Fragment>
    );
  }

  if (!formState || formState.status === 'request') {
    return <Typography>Initializing form...</Typography>;
  }

  return (
    <Fragment>
      {isDeveloper && (
        <Button variant="contained" onClick={onToggleClick}>
          Toggle form editor
        </Button>
      )}
      <DynaForm formKey={formKey} fieldMeta={formState.meta} />
    </Fragment>
  );
}
