import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../..';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import Spinner from '../../../../Spinner';

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
  customSettingsEditorId,
}) {
  const settingsFormKey = `settingsForm-${resourceId}`;
  const classes = useStyles();
  const dispatch = useDispatch();
  const settingsFormState = useSelector(state =>
    selectors.customSettingsForm(state, resourceId)
  );
  const editorSaveStatus = useSelector(state => selectors.editor(state, customSettingsEditorId)?.saveStatus);

  // this hook evaluates if any of the settings props are different thereby if an initialization call is necessary
  // const isCustomsettingsPropsDiff = useIsCustomSettingsFormPropsDiff({settingsForm, settings, script});

  useEffect(() => {
    // only if settingsForm, settings, script is different do you reinitialize
    dispatch(actions.customSettings.formRequest(resourceType, resourceId, sectionId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // when editor has completed to we fetch custom settings
    if (editorSaveStatus === 'success') { dispatch(actions.customSettings.formRequest(resourceType, resourceId, sectionId)); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorSaveStatus]);

  useEffect(
    () => () => {
      // clear settings on unmount
      dispatch(actions.customSettings.formClear(resourceId));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
