import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import actions from '../../../../actions';
import { useSelectorMemo } from '../../../../hooks';
import { selectors } from '../../../../reducers';
import { UNASSIGNED_SECTION_NAME } from '../../../../utils/constants';
import { FLOW_GROUP_DELETE_MESSAGE } from '../../../../utils/messageStore';
import { TextButton } from '../../../Buttons';
import ButtonWithTooltip from '../../../Buttons/ButtonWithTooltip';
import useConfirmDialog from '../../../ConfirmDialog';
import TrashIcon from '../../../icons/TrashIcon';
import DynaText from '../DynaText';

const useStyles = makeStyles(theme => ({
  textFieldWithDeleteSupport: {
    display: 'flex',
    alignItems: 'center',
  },
  dynaTextField: {
    flex: 1,
  },
  deleteFlowBtn: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
}));
export default function DynaFlowGroupName(props) {
  const classes = useStyles();
  const history = useHistory();
  const { integrationId, flowIds, isEdit, formKey, id, value, required } = props;
  const [currentSavedValue, setValue] = useState(value);
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, integrationId);
  // A flow group name is valid if it equals to currently saved value
  // or it is different from other flow group names
  // or is is not equal to "Unassigned"
  const isValidName = value ? (value === currentSavedValue) || (!flowGroupings.find(flowGroup => flowGroup.name === value) && value !== UNASSIGNED_SECTION_NAME) : false;
  const flowGroupId = flowGroupings.find(flowGroup => flowGroup.name === currentSavedValue)?._id;

  const handleDeleteFlowGroupClick = useCallback(
    () => {
      confirmDialog({
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this flow group? Only the group will be deleted. Its flows will be moved into “Unassigned”.',
        buttons: [
          {
            label: 'Delete',
            onClick: () => {
              dispatch(actions.resource.integrations.flowGroups.delete(integrationId, flowGroupId, flowIds));
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
    [confirmDialog, dispatch, flowIds, history, integrationId, flowGroupId, value]
  );

  useEffect(() => {
    if (!required) return;

    if (isValidName) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));

      return;
    }
    let errorMessages;

    if (value === UNASSIGNED_SECTION_NAME) {
      errorMessages = 'Group name cannot be “Unassigned”.';
    } else if (value) {
      errorMessages = 'A group with this name already exists.';
    } else {
      errorMessages = 'A value must be provided';
    }
    dispatch(actions.form.forceFieldState(formKey)(id, {
      isValid: false,
      errorMessages,
    }));
  }, [dispatch, formKey, id, isEdit, isValidName, required, value]);

  // suspend force field state computation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  return isEdit ? (
    <div className={classes.textFieldWithDeleteSupport}>
      <DynaText {...props} className={classes.dynaTextField} />
      <ButtonWithTooltip
        tooltipProps={{title: FLOW_GROUP_DELETE_MESSAGE}}>
        <TextButton
          onClick={handleDeleteFlowGroupClick}
          startIcon={<TrashIcon />}
          className={classes.deleteFlowBtn}>
          Delete flow group
        </TextButton>
      </ButtonWithTooltip>
    </div>
  ) : (
    <DynaText {...props} />
  );
}
