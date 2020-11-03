import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import {
  makeStyles,
  Typography,
  Button,
  FormLabel,
  FormControl,
} from '@material-ui/core';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import useConfirmDialog from '../../ConfirmDialog';
import useSaveStatusIndicator from '../../../hooks/useSaveStatusIndicator';
import ButtonGroup from '../../ButtonGroup';
import RadioGroup from '../../DynaForm/fields/radiogroup/DynaRadioGroup';
import RightDrawer from '../Right';
import DrawerHeader from '../Right/DrawerHeader';
import DrawerContent from '../Right/DrawerContent';
import DrawerFooter from '../Right/DrawerFooter';

const useStyles = makeStyles(theme => ({
  remaining: {
    marginTop: theme.spacing(2),
  },
}));

const debugDurationOptions = [
  {
    label: 'Off',
    value: '0',
  },
  {
    label: 'Next 15 mins',
    value: '15',
  },
  {
    label: 'Next 30 mins',
    value: '30',
  },
  {
    label: 'Next 45 mins',
    value: '45',
  },
  {
    label: 'Next 60 mins',
    value: '60',
  },
];

function ConfigConnForm() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [debugValue, setDebugValue] = useState(0);
  const { connectionId } = useParams();
  const debugDate = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)?.debugDate
  );

  const { confirmDialog } = useConfirmDialog();
  const handleClose = history.goBack;
  const handleSaveClick = useCallback(() => {
    const debugTime = moment()
      .add(debugValue, 'm')
      .toISOString();
    const patchSet = [
      {
        op: debugValue !== '0' ? 'replace' : 'remove',
        path: '/debugDate',
        value: debugTime,
      },
    ];

    dispatch(actions.resource.patch('connections', connectionId, patchSet));
  }, [debugValue, dispatch, connectionId]);
  const handleValueChange = useCallback((_id, val) => {
    setDebugValue(val);
  }, []);
  const defaultVal = useMemo(() => {
    if (!(debugDate && moment().isBefore(moment(debugDate)))) {
      return '0';
    }
  }, [debugDate]);
  const minutes = useMemo(() => {
    if (debugDate) {
      return moment(debugDate).diff(moment(), 'minutes');
    }
  }, [debugDate]);
  const handleCancelClick = useCallback(() => {
    confirmDialog({
      title: 'Confirm cancel',
      message: 'Are you sure you want to cancel? You have unsaved changes that will be lost if you proceed.',
      buttons: [
        {
          label: 'Yes, cancel',
          onClick: handleClose,
        },
        {
          label: 'No, go back',
          color: 'secondary',
        },
      ],
    });
  }, [handleClose, confirmDialog]);

  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      path: `/connections/${connectionId}`,
      method: 'PATCH',
      onSave: handleSaveClick,
      onClose: handleClose,
    }
  );

  return (
    <>
      <DrawerContent>
        <FormControl component="fieldset">
          <FormLabel className={classes.label} component="legend">
            Debug duration:
          </FormLabel>
          <RadioGroup
            id="debugDuration"
            name="debugDuration"
            defaultValue={defaultVal}
            showOptionsVertically
            onFieldChange={handleValueChange}
            options={[
              {
                items: debugDurationOptions,
              },
            ]}
          />
        </FormControl>
        {minutes > 1 && (
          <Typography variant="body2" className={classes.remaining}>
            Debug mode is enabled for next {minutes} minutes.
          </Typography>
        )}
      </DrawerContent>

      <DrawerFooter>
        <ButtonGroup>
          <Button
            data-test="saveDebuggerConfiguration"
            variant="outlined"
            color="primary"
            onClick={submitHandler()}
            disabled={disableSave} >
            {defaultLabels.saveLabel}
          </Button>
          <Button
            data-test="saveAndCloseDebuggerConfiguration"
            variant="outlined"
            color="secondary"
            onClick={submitHandler(true)}
            disabled={disableSave} >
            {defaultLabels.saveAndCloseLabel}
          </Button>
          <Button
            variant="text"
            color="primary"
            data-test="closeEditor"
            onClick={handleCancelClick}>
            Cancel
          </Button>
        </ButtonGroup>
      </DrawerFooter>
    </>
  );
}

export default function ConfigConnectionDebugger() {
  return (
    <RightDrawer
      height="tall"
      path="configDebugger/:connectionId">
      <DrawerHeader
        title="Debug connection"
        helpKey="connection.debug"
      />
      <ConfigConnForm />
    </RightDrawer>
  );
}
