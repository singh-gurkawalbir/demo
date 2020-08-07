import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import * as selectors from '../../../reducers';
import { useLoadingSnackbarOnSave } from '.';
import { integrationSettingsToDynaFormMetadata } from '../../../forms/utils';

const useStyles = makeStyles(theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}));

export default function IntegrationSettingsSaveButton(props) {
  const classes = useStyles();
  const {
    submitButtonLabel = 'Save',
    integrationId,
    storeId,
    flowId,
    postProcessValuesFn,
    disabled,
    sectionId,
  } = props;
  const dispatch = useDispatch();
  const { settings: fields, sections } = useSelector(
    state => selectors.iaFlowSettings(state, integrationId, flowId),
    shallowEqual
  );
  const flowSettingsMemo = useMemo(
    () =>
      integrationSettingsToDynaFormMetadata(
        { fields, sections },
        integrationId,
        true,
        {}
      ),
    [fields, integrationId, sections]
  );
  const onSave = useCallback(
    formValues => {
      // Adding flow id to the payload mimicking the save behavior of ampersand
      // TODO:Have to investigate the save behavior...tabs vs all tabs

      let values;

      if (postProcessValuesFn) {
        values = postProcessValuesFn(formValues);
      } else {
        values = formValues;
      }
      if (flowId && flowSettingsMemo?.fieldMap) {
        values = Object.values(flowSettingsMemo?.fieldMap)?.filter(f => f.type === 'xmlMapper').reduce((updatedValues, f) => {
          if (values[f.name] && Array.isArray(values[f.name])) {
            // eslint-disable-next-line no-param-reassign
            updatedValues[f.name] = {
              value: values[f.name],
              path: f.properties?.path
            };
          }
          return updatedValues;
        }, values);
      }


      const fileField = Object.keys(values).find(key => values[key]?.file && values[key]?.type === 'file');
      if (fileField) {
        const fileContents = values[fileField];
        values['/sampleData'] = fileContents?.file;
        values['/rowDelimiter'] = fileContents?.rowDelimiter || '\n';
        values[fileField] = fileContents?.fileProps;
      }
      const allValuesWithFlowId = { ...values, '/flowId': flowId };

      dispatch(
        actions.integrationApp.settings.update(
          integrationId,
          flowId,
          storeId,
          sectionId,
          allValuesWithFlowId
        )
      );
    },
    [dispatch, flowId, flowSettingsMemo?.fieldMap, integrationId, postProcessValuesFn, sectionId, storeId]
  );
  const submitCompleted = useSelector(state => {
    const {
      submitComplete,
      submitFailed,
    } = selectors.integrationAppSettingsFormState(
      state,
      integrationId,
      flowId,
      sectionId
    );

    return submitComplete || submitFailed;
  });
  const { handleSubmitForm, isSaving } = useLoadingSnackbarOnSave({
    resourceType: 'Integration Settings',
    saveTerminated: submitCompleted,
    onSave,
  });

  return (
    <DynaAction
      {...props}
      className={classes.actionButton}
      disabled={disabled || isSaving}
      onClick={handleSubmitForm}>
      {isSaving ? 'Saving' : submitButtonLabel}
    </DynaAction>
  );
}
