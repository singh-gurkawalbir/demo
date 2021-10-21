import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import actions from '../../../../actions';
import { useSelectorMemo } from '../../../../hooks';
import { selectors } from '../../../../reducers';
import { TextButton } from '../../../Buttons';
import TrashIcon from '../../../icons/TrashIcon';
import DynaText from '../DynaText';

const useStyles = makeStyles(theme => ({
  textFieldWithDeleteSupport: {
    display: 'flex',
  },
  dynaTextField: {
    flex: 1,
  },
  deleteFlowBtn: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
}));

export default function TextFieldWithDeleteSupport(props) {
  const classes = useStyles();
  const history = useHistory();
  const { integrationId, flows, isEdit, formKey, id, value, required } = props;
  const [currentValue, setValue] = useState(value);
  const dispatch = useDispatch();
  const integration = useSelectorMemo(selectors.makeResourceSelector, 'integrations', integrationId) || {};
  const isValidName = (value === currentValue) || !integration?.flowGroupings.find(flowGroup => flowGroup.name === value);

  const handleDelete = useCallback(() => {
    setValue(value);
    dispatch(actions.resource.integrations.flowGroups.delete(integration, value, flows));
    history.goBack();
  }, [dispatch, flows, history, integration, value]);

  useEffect(() => {
    if (required) {
      if (isValidName) {
        dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));

        return;
      }
      dispatch(actions.form.forceFieldState(formKey)(id, {
        isValid: false,
        errorMessages: value ? 'There is already a flow group with the given name' : 'A value must be provided',
      }));
    }
  }, [dispatch, formKey, id, isEdit, isValidName, required, value]);

  // suspend force field state compuation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  return isEdit ? (
    <div className={classes.textFieldWithDeleteSupport}>
      <DynaText {...props} className={classes.dynaTextField} />
      <TextButton
        onClick={handleDelete}
        startIcon={<TrashIcon />}
        className={classes.deleteFlowBtn}>
        Delete flow group
      </TextButton>
    </div>
  ) : (
    <DynaText {...props} />
  );
}
