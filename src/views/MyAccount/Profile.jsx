import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../actions';
import * as selectors from '../../reducers';
import DynaForm from '../../components/DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import PanelHeader from '../../components/PanelHeader';
import dateTimezones from '../../utils/dateTimezones';
import { getDomain } from '../../utils/resource';
import getImageUrl from '../../utils/image';
import getRoutePath from '../../utils/routePaths';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';
import useSaveStatusIndicator from '../../hooks/useSaveStatusIndicator';


const useStyles = makeStyles(theme => ({
  googleBtn: {
    borderRadius: 4,
    background: `url(${getImageUrl(
      'images/googlelogo.png'
    )}) 20% center no-repeat`,
    backgroundSize: theme.spacing(2),
    height: 38,
    fontSize: 16,
    backgroundColor: theme.palette.background.paper,
  },
  label: {
    marginRight: theme.spacing(1),
  },
  signInOption: {
    paddingLeft: 0,
    margin: theme.spacing(2, 0),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  btnLabel: {
    marginLeft: theme.spacing(3),
    lineHeight: 0,
  },
}));

const dateFormats = [{ value: 'MM/DD/YYYY', label: '12/31/1900' },
  { value: 'DD/MM/YYYY', label: '31/12/1900' },
  { value: 'DD-MMM-YYYY', label: '31-Dec-1900' },
  { value: 'DD.MM.YYYY', label: '31.12.1900' },
  { value: 'DD-MMMM-YYYY', label: '31-December-1900' },
  { value: 'DD MMMM, YYYY', label: '31 December, 1900' },
  { value: 'YYYY/MM/DD', label: '1900/12/31' },
  { value: 'YYYY-MM-DD', label: '1900-12-31' }];
export default function ProfileComponent() {
  const classes = useStyles();

  const [formState, setFormState] = useState({
    showFormValidationsBeforeTouch: false,
  });
  const showCustomFormValidations = useCallback(() => {
    setFormState({
      showFormValidationsBeforeTouch: true,
    });
  }, []);
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const dateTimeZonesList = useMemo(
    () => [
      {
        items:
          (dateTimezones &&
            dateTimezones.map(date => ({
              label: date.value,
              value: date.name,
            }))) ||
          [],
      },
    ],
    []
  );
  const dateFormatList = useMemo(
    () => [
      {
        items:
          (dateFormats &&
            dateFormats.map(date => ({
              label: date.label,
              value: date.value,
            }))) ||
          [],
      },
    ],
    []
  );
  const timeFormatList = useMemo(
    () => [
      {
        items: [
          {
            label: '2:34:25 pm',
            value: 'h:mm:ss a',
          },
          {
            label: '14:34:25',
            value: 'H:mm:ss',
          },
        ],
      },
    ],
    []
  );

  const dispatch = useDispatch();
  const handleSubmit = useCallback(formVal => {
    const completePayloadCopy = { ...formVal };
    const { timeFormat, dateFormat } = completePayloadCopy;
    const preferencesPayload = { timeFormat, dateFormat };

    dispatch(actions.user.preferences.update(preferencesPayload));
    // deleting preferenecs from completePayloadCopy
    delete completePayloadCopy.timeFormat;
    delete completePayloadCopy.dateFormat;
    dispatch(actions.user.profile.update(completePayloadCopy));
  }, [dispatch]);

  const handleLinkWithGoogle = useCallback(() => {
    dispatch(actions.auth.linkWithGoogle(getRoutePath('/myAccount/profile')));
  }, [dispatch]);

  const handleUnLinkWithGoogle = useCallback(() => {
    dispatch(actions.user.profile.unlinkWithGoogle());
  }, [dispatch]);

  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      path: '/profile',
      method: 'PUT',
      onSave: handleSubmit,
    }
  );

  const fieldMeta = useMemo(() => ({
    fieldMap: {
      name: {
        id: 'name',
        name: 'name',
        type: 'text',
        label: 'Name',
        required: true,
        helpKey: 'myaccount.name',
        defaultValue: preferences && preferences.name,
      },
      email: {
        id: 'email',
        name: 'email',
        type: 'useremail',
        label: 'Email',
        helpKey: 'myaccount.email',
        value: preferences && preferences.email,
      },
      password: {
        id: 'password',
        name: 'password',
        label: 'Password',
        helpKey: 'myaccount.password',
        type: 'userpassword',
      },
      company: {
        id: 'company',
        name: 'company',
        type: 'text',
        label: 'Company',
        helpKey: 'myaccount.company',
        defaultValue: preferences && preferences.company,
      },
      phone: {
        id: 'phone',
        name: 'phone',
        type: 'text',
        label: 'Phone',
        helpKey: 'myaccount.phone',
        defaultValue: preferences && preferences.phone,
      },
      role: {
        id: 'role',
        name: 'role',
        type: 'text',
        helpKey: 'myaccount.role',
        label: 'Role',
        defaultValue: preferences && preferences.role,
      },
      timezone: {
        id: 'timezone',
        name: 'timezone',
        type: 'select',
        label: 'Time zone',
        required: true,
        helpKey: 'myaccount.timezone',
        defaultValue: preferences && preferences.timezone,
        options: dateTimeZonesList,
      },
      dateFormat: {
        id: 'dateFormat',
        name: 'dateFormat',
        type: 'select',
        required: true,
        helpKey: 'myaccount.dateFormat',
        label: 'Date format',
        defaultValue: preferences && preferences.dateFormat,
        options: dateFormatList,
      },
      timeFormat: {
        id: 'timeFormat',
        name: 'timeFormat',
        type: 'select',
        helpKey: 'myaccount.timeFormat',
        required: true,
        label: 'Time format',
        defaultValue: preferences && preferences.timeFormat,
        options: timeFormatList,
      },
      layout: {
        fields: [
          'name',
          'email',
          'password',
          'company',
          'role',
          'phone',
          'timezone',
          'dateFormat',
          'timeFormat',
          'developer',
        ],
      },
    },
    layout: {
      fields: [
        'name',
        'email',
        'password',
        'company',
        'role',
        'phone',
        'timezone',
        'dateFormat',
        'timeFormat',
        'developer',
      ],
    },
  }), [dateFormatList, dateTimeZonesList, preferences, timeFormatList]);
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(count => count + 1);
  }, [fieldMeta]);

  const formKey = useFormInitWithPermissions({
    fieldsMeta: fieldMeta,
    remount: count,
    ...formState
  });

  return (
    <>
      <PanelHeader title="Profile" />
      <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
      <DynaSubmit
        formKey={formKey}
        showCustomFormValidations={showCustomFormValidations}
        onClick={submitHandler()}
        disabled={disableSave}>
        {defaultLabels.saveLabel}
      </DynaSubmit>
      {getDomain() !== 'eu.integrator.io' && (
        <div>
          <PanelHeader
            title="Sign in via Google"
            className={classes.signInOption}
          />
          {preferences &&
            (!preferences.auth_type_google ||
              !preferences.auth_type_google.id) && (
              <InputLabel>
                <span className={classes.label}>Link to:</span>
                <Button
                  data-test="linkWithGoogle"
                  variant="contained"
                  color="secondary"
                  className={classes.googleBtn}
                  onClick={handleLinkWithGoogle}>
                  <span className={classes.btnLabel}>Google</span>
                </Button>
              </InputLabel>
          )}
          {preferences &&
            preferences.auth_type_google &&
            preferences.auth_type_google.id && (
              <InputLabel>
                <span className={classes.label}>Unlink from:</span>
                <Button
                  data-test="unlinkWithGoogle"
                  variant="contained"
                  color="secondary"
                  className={classes.googleBtn}
                  onClick={handleUnLinkWithGoogle}>
                  <span className={classes.btnLabel}>Google</span>
                </Button>
              </InputLabel>
          )}
        </div>
      )}
    </>
  );
}
