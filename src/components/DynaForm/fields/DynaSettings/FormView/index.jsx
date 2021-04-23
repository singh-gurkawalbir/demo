import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../..';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import Spinner from '../../../../Spinner';
import useFormContext from '../../../../Form/FormContext';
import { isFormTouched } from '../../../../../forms/formFactory/utils';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles({
  wrapper: {
    width: '100%',
  },
});

export default function FormView({
  resourceId,
  resourceType,
  sectionId,
  disabled,
  onFormChange,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const settingsFormState = useSelector(state =>
    selectors.customSettingsForm(state, resourceId)
  );

  const settingsForm = useSelectorMemo(selectors.mkGetCustomFormPerSectionId, resourceType, resourceId, sectionId) ?.settingsForm;
  const settings = useSelectorMemo(selectors.mkGetCustomFormPerSectionId, resourceType, resourceId, sectionId) ?.settings;

  useEffect(() => {
    // use effect will fire any time formState changes but...
    // Only if the formState is missing do we need to perform an init.
    if (!settingsFormState) {
      dispatch(actions.customSettings.formRequest(resourceType, resourceId, sectionId));
    }
  }, [dispatch, settingsFormState, resourceId, resourceType, sectionId]);

  useEffect(
    () => () => {
      // reload settings form when the settingsForm or settings changes
      dispatch(actions.customSettings.formClear(resourceId));
    },
    [dispatch, resourceId, settingsForm, settings]
  );

  // TODO:verify this behaviour
  const formKey = useFormInitWithPermissions({
    remount: settingsFormState?.key,
    disabled,
    fieldMeta: settingsFormState?.meta,
    resourceId,
    resourceType,
  });

  const {fields, value, isValid} = useFormContext(formKey);

  const isTouched = (fields && isFormTouched(Object.values(fields))) || false;

  useEffect(() => {
    if (isTouched) { onFormChange(value, isValid); }
  }, [isTouched, isValid, onFormChange, value]);

  if (settingsFormState && settingsFormState.error) {
    return (
      <div>
        <Typography>{settingsFormState.error}</Typography>
      </div>
    );
  }

  if (!settingsFormState || settingsFormState.status === 'request') {
    return (

      <Spinner centerAll />

    );
  }

  return (
    <div className={classes.wrapper}>
      <DynaForm formKey={formKey} />
    </div>
  );
}
