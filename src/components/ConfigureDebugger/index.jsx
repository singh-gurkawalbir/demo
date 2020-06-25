import React, { useState, useCallback, useMemo } from 'react';
import {
  FormLabel,
  FormControl,
  Typography,
  Drawer,
  Button,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import actions from '../../actions';
import DrawerTitleBar from '../drawer/TitleBar';
import RadioGroup from '../DynaForm/fields/radiogroup/DynaRadioGroup';
import useConfirmDialog from '../ConfirmDialog';


const useStyles = makeStyles(theme => ({
  submit: {
    marginTop: theme.spacing(3),
  },
  cancel: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  label: {
    marginBottom: theme.spacing(1),
  },
  drawerPaper: {
    width: 600,
    padding: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  footer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
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

export default function ConfigureDebugger(props) {
  const classes = useStyles();
  const { id, debugDate, onClose } = props;
  const { confirmDialog } = useConfirmDialog();
  const [debugValue, setDebugValue] = useState(0);
  const [saveLabel, setSaveLabel] = useState('Save');
  const dispatch = useDispatch();
  const handleSaveClick = useCallback(() => {
    setSaveLabel('Saving');

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

    dispatch(actions.resource.patch('connections', id, patchSet));
    onClose();
  }, [debugValue, dispatch, id, onClose]);
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
          onClick: onClose,
        },
        {
          label: 'No, go back',
          color: 'secondary',
        },
      ]
    });
  }, [onClose, confirmDialog]);

  return (
    <Drawer
      anchor="right"
      open
      classes={{
        paper: classes.drawerPaper,
      }}>
      <DrawerTitleBar
        onClose={onClose}
        title="Debug connection"
        helpKey="connection.debug"
      />
      <div className={classes.content}>
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
          <Typography variant="body2" className={classes.submit}>
            Debug mode is enabled for next {minutes} minutes.
          </Typography>
        )}
      </div>
      <div className={classes.footer}>
        <div>
          <Button
            data-test="saveDebuggerConfiguration"
            variant="outlined"
            color="primary"
            onClick={handleSaveClick}
            className={classes.submit}
            value="Save">
            {saveLabel}
          </Button>
          <Button
            variant="text"
            className={classes.cancel}
            color="primary"
            data-test="closeEditor"
            onClick={handleCancelClick}>
            Cancel
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
