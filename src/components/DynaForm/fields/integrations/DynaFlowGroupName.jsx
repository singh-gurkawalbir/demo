import { Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import actions from '../../../../actions';
import { useSelectorMemo } from '../../../../hooks';
import { selectors } from '../../../../reducers';
import { UNASSIGNED_SECTION_ID } from '../../../../utils/constants';
import { TextButton } from '../../../Buttons';
import useConfirmDialog from '../../../ConfirmDialog';
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

const title = 'Only the flow group will be deleted. Its flows will be moved into “Unassigned”.';
export default function TextFieldWithDeleteSupport(props) {
  const classes = useStyles();
  const history = useHistory();
  const { integrationId, flows, isEdit, formKey, id, value, required } = props;
  const [currentValue, setValue] = useState(value);
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, integrationId);
  const isValidName = value ? (value === currentValue) || (!flowGroupings.find(flowGroup => flowGroup.name === value) && value?.toLowerCase() !== UNASSIGNED_SECTION_ID) : false;
  const flowGroupId = flowGroupings.find(flowGroup => flowGroup.name === currentValue)?._id;

  const handleDeleteFlowGroupClick = useCallback(
    () => {
      confirmDialog({
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this flow group? Only the group will be deleted. Its flows will be moved into “Unassigned”.',
        buttons: [
          {
            label: 'Delete',
            onClick: () => {
              dispatch(actions.resource.integrations.flowGroups.delete(integrationId, flowGroupId, flows));
              setValue(value);
              history.goBack();
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
          },
        ],
      });
    },
    [confirmDialog, dispatch, flows, history, integrationId, flowGroupId, value]
  );

  useEffect(() => {
    if (required) {
      if (isValidName) {
        dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));

        return;
      }
      let errorMessages;

      if (value === UNASSIGNED_SECTION_ID) {
        errorMessages = '<Group_Name> cannot be “Unassigned” as this is a reserved value. Please provide a different name.';
      } else if (value) {
        errorMessages = '<Group_Name> already exists. Please provide a different name.';
      } else {
        errorMessages = 'A value must be provided';
      }
      dispatch(actions.form.forceFieldState(formKey)(id, {
        isValid: false,
        errorMessages,
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
      <Tooltip data-public title={title} placement="bottom" >
        <TextButton
          onClick={handleDeleteFlowGroupClick}
          startIcon={<TrashIcon />}
          className={classes.deleteFlowBtn}>
          Delete flow group
        </TextButton>
      </Tooltip>
    </div>
  ) : (
    <DynaText {...props} />
  );
}
