import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../..';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import Spinner from '../../../../Spinner';
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
}) {
  const settingsFormKey = `settingsForm-${resourceId}`;
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
  const updatedMeta = useMemo(() => {
    // sanitize all a tag elements within help texts

    if (!settingsFormState?.meta) { return null; }
    const {fieldMap, layout} = settingsFormState.meta;

    const fieldMapWithEscapeUnsecuredDomains = Object.keys(fieldMap).reduce((acc, key) => {
      acc[key] = {...fieldMap[key], escapeUnsecuredDomains: true};

      return acc;
    }, {});

    return {layout, fieldMap: fieldMapWithEscapeUnsecuredDomains};
  }, [settingsFormState?.meta]);

  useFormInitWithPermissions({
    formKey: settingsFormKey,
    remount: settingsFormState?.key,
    disabled,
    fieldMeta: updatedMeta,
    resourceId,
    resourceType,
  });

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
      <DynaForm formKey={settingsFormKey} />
    </div>
  );
}
