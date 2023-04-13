import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../..';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import IsLoggableContextProvider from '../../../../IsLoggableContextProvider';
import { useSelectorMemo } from '../../../../../hooks';

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
  isLoggable,
  className,
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

    if (!fieldMap) return;
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
      <Typography className={className}>{settingsFormState.error}</Typography>
    );
  }

  if (!settingsFormState || settingsFormState.status === 'request') {
    return (<Spinner center="screen" />);
  }

  return (
    <div className={classes.wrapper}>
      <IsLoggableContextProvider isLoggable={isLoggable}>
        <DynaForm formKey={settingsFormKey} />
      </IsLoggableContextProvider>
    </div>
  );
}
