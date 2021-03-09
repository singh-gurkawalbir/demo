import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import { makeStyles, Typography, Button } from '@material-ui/core';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import useSaveStatusIndicator from '../../../hooks/useSaveStatusIndicator';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import useForm from '../../Form';
import ButtonGroup from '../../ButtonGroup';
import RightDrawer from '../Right';
import DrawerHeader from '../Right/DrawerHeader';
import DrawerContent from '../Right/DrawerContent';
import DrawerFooter from '../Right/DrawerFooter';
import DynaForm from '../../DynaForm';

const useStyles = makeStyles(theme => ({
  remaining: {
    marginTop: theme.spacing(2),
  },
}));

const getFieldMeta = defaultValue => ({
  fieldMap: {
    debugDate: {
      id: 'debugDate',
      name: 'debugDate',
      type: 'radiogroup',
      label: 'Debug duration',
      options: [
        {
          items: [
            { label: 'Off', value: '0' },
            { label: 'Next 15 mins', value: '15' },
            { label: 'Next 30 mins', value: '30' },
            { label: 'Next 45 mins', value: '45' },
            { label: 'Next 60 mins', value: '60' },
          ],
        },
      ],
      defaultValue,
    },
  },
});

const formKey = 'config-conn-debug';

function ConfigConnForm() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { connectionId } = useParams();
  const debugDate = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)?.debugDate
  );
  const handleClose = history.goBack;
  const handleSave = useCallback(({ debugDate }) => {
    const patchSet = [
      {
        op: debugDate !== '0' ? 'replace' : 'remove',
        path: '/debugDate',
        value: moment().add(debugDate, 'm').toISOString(),
      },
    ];

    dispatch(actions.resource.patch('connections', connectionId, patchSet));
  }, [dispatch, connectionId]);
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
  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      path: `/connections/${connectionId}`,
      method: 'PATCH',
      onSave: handleSave,
      onClose: handleClose,
    }
  );
  const fieldMeta = getFieldMeta(defaultVal);

  useForm({formKey, fieldMeta});

  return (
    <>
      <DrawerContent>
        <DynaForm formKey={formKey} />

        {minutes > 1 && (
          <Typography variant="body2" className={classes.remaining}>
            Debug mode is enabled for the next {minutes} minutes.
          </Typography>
        )}
      </DrawerContent>

      <DrawerFooter>
        <ButtonGroup>
          <DynaSubmit
            formKey={formKey}
            data-test="saveDebuggerConfiguration"
            color="primary"
            onClick={submitHandler()}
            disabled={disableSave} >
            {defaultLabels.saveLabel}
          </DynaSubmit>
          <DynaSubmit
            formKey={formKey}
            data-test="saveAndCloseDebuggerConfiguration"
            color="secondary"
            onClick={submitHandler(true)}
            disabled={disableSave} >
            {defaultLabels.saveAndCloseLabel}
          </DynaSubmit>
          <Button
            variant="text"
            color="primary"
            data-test="closeEditor"
            onClick={handleClose}>
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
      width="medium"
      path="configDebugger/:connectionId">
      <DrawerHeader
        title="Debug connection"
        helpKey="connection.debug"
      />
      <ConfigConnForm />
    </RightDrawer>
  );
}
