import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { drawerPaths } from '../../../utils/rightDrawer';
import useForm from '../../Form';
import RightDrawer from '../Right';
import DrawerHeader from '../Right/DrawerHeader';
import DrawerContent from '../Right/DrawerContent';
import DrawerFooter from '../Right/DrawerFooter';
import DynaForm from '../../DynaForm';
import SaveAndCloseButtonGroupForm from '../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm';
import { useFormOnCancel } from '../../FormOnCancelContext';

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
  const [remountCount, setRemountCount] = useState(0);
  const debugDate = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)?.debugDate
  );
  const handleClose = history.goBack;
  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);
  const handleSave = useCallback(() => {
    const patchSet = [
      {
        op: values?.debugDate !== '0' ? 'replace' : 'remove',
        path: '/debugDate',
        value: moment().add(values?.debugDate, 'm').toISOString(),
      },
    ];

    dispatch(actions.resource.patch('connections', connectionId, patchSet, formKey));
  }, [dispatch, connectionId, values]);
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
  const fieldMeta = getFieldMeta(defaultVal);
  const remountForm = useCallback(() => {
    setRemountCount(remountCount => remountCount + 1);
  }, []);

  useForm({formKey, fieldMeta, remount: remountCount});

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
        <SaveAndCloseButtonGroupForm
          formKey={formKey}
          onSave={handleSave}
          onClose={handleClose}
          remountAfterSaveFn={remountForm}
          />
      </DrawerFooter>
    </>
  );
}

export default function ConfigConnectionDebugger() {
  const {setCancelTriggered, disabled} = useFormOnCancel(formKey);

  return (
    <RightDrawer
      height="tall"
      width="medium"
      path={drawerPaths.CONNECTION.DEBUGGER}>
      <DrawerHeader
        title="Debug connection"
        helpKey="connection.debug"
        disableClose={disabled}
        handleClose={setCancelTriggered}
      />
      <ConfigConnForm />
    </RightDrawer>
  );
}
