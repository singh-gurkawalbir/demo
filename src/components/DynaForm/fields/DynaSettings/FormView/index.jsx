import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import {isEqual} from 'lodash';
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

const isPropsDiff = (prev, curr) => Object.keys(curr).filter(key => !!curr[key]).some(key => {
  // this util function evaluates the content of properties and excludes lastModified prop...
  // it can so happen that lastModified prop could be different and the content be the same
  // and so in this case the props is the same.
  const currPropCopy = {...curr[key] };
  const prevPropCopy = {...prev[key]};

  delete currPropCopy.lastModified;
  delete prevPropCopy.lastModified;

  return !isEqual(currPropCopy, prevPropCopy);
});

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
const useIsCustomSettingsFormPropsDiff = props => {
  const {settingsForm, settings, script} = props;
  const curr = {settingsForm, settings, script};
  const prev = usePrevious(curr);

  if (!prev || !curr) {
    return true;
  }

  return isPropsDiff(prev, curr);
};
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

  const settingsForm = useSelectorMemo(selectors.mkGetCustomFormPerSectionId, resourceType, resourceId, sectionId || 'general') ?.settingsForm;
  const settings = useSelectorMemo(selectors.mkGetCustomFormPerSectionId, resourceType, resourceId, sectionId || 'general') ?.settings;
  const script = useSelectorMemo(selectors.makeResourceSelector, 'scripts', settingsForm?.init?._scriptId);

  // this hook evaluates if any of the settings props are different thereby if an initialization call is necessary
  const isCustomsettingsPropsDiff = useIsCustomSettingsFormPropsDiff({settingsForm, settings, script});

  useEffect(() => {
    // only if settingsForm, settings, script is different do you reinitialize
    if (isCustomsettingsPropsDiff) {
      dispatch(actions.customSettings.formRequest(resourceType, resourceId, sectionId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCustomsettingsPropsDiff]);

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
