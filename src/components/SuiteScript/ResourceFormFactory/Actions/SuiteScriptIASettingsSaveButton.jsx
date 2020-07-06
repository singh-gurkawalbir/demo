import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import DynaAction from '../../../DynaForm/DynaAction';

const useStyles = makeStyles(theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}));


const SuiteScriptIASettingsSaveButton = props => {
  const {
    submitButtonLabel = 'Submit',
    disabled = false,
    sectionId,
    ssLinkedConnectionId,
    integrationId,
    ...rest
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const saving = useSelector(state =>
    selectors.suiteScriptIAFormSaving(state, {
      ssLinkedConnectionId,
      integrationId,
    })
  );
  const onSave = useCallback(
    values => {
      dispatch(
        actions.suiteScript.iaForm.submit(ssLinkedConnectionId, integrationId, sectionId, values)
      );
    },
    [dispatch, integrationId, sectionId, ssLinkedConnectionId]
  );

  return (
    <DynaAction
      {...rest}
      showCustomFormValidations={() => {
        dispatch(
          actions.suiteScript.iaForm.showFormValidations(ssLinkedConnectionId, integrationId)
        );
      }}
      className={classes.actionButton}
      disabled={disabled || saving}
      onClick={onSave}>
      {saving ? 'Saving' : submitButtonLabel}
    </DynaAction>
  );
};

export default SuiteScriptIASettingsSaveButton;
