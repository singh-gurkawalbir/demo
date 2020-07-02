import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import * as selectors from '../../../reducers';
import { useLoadingSnackbarOnSave } from '.';

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
    [dispatch, flowId, integrationId, postProcessValuesFn, sectionId, storeId]
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
  const { handleSubmitForm, disableSave } = useLoadingSnackbarOnSave({
    resourceType: 'Integration Settings',
    saveTerminated: submitCompleted,
    onSave,
  });

  return (
    <DynaAction
      {...props}
      className={classes.actionButton}
      disabled={disabled || disableSave}
      onClick={handleSubmitForm}>
      {disableSave ? 'Saving' : submitButtonLabel}
    </DynaAction>
  );
}
