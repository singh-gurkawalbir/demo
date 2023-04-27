import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import actions from '../../actions';
import { selectors } from '../../reducers';
import DynaForm from '../../components/DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import PanelHeader from '../../components/PanelHeader';
import dateTimezones from '../../utils/dateTimezones';
import getRoutePath from '../../utils/routePaths';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';
import useSaveStatusIndicator from '../../hooks/useSaveStatusIndicator';
import LoadResources from '../../components/LoadResources';
import { OutlinedButton } from '../../components/Buttons';
import infoText from '../../components/Help/infoText';
import { isProduction } from '../../forms/formFactory/utils';
import { isGoogleSignInAllowed } from '../../utils/resource';

const useStyles = makeStyles(theme => ({
  label: {
    marginRight: theme.spacing(1),
  },
  signInOption: {
    margin: theme.spacing(2, 0),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  btnLabel: {
    marginLeft: theme.spacing(3),
    lineHeight: 0,
  },
  saveBtnProfile: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  profilePanelHeader: {
    padding: theme.spacing(2),
  },
  formContainer: {
    padding: theme.spacing(0, 2),
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    minHeight: 124,
  },
  googleSignInPanel: {
    paddingBottom: theme.spacing(2),
    '& > .MuiFormLabel-root': {
      padding: theme.spacing(0, 2),
    },
  },
  googleBtn: {
    width: 'unset',
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

export default function ProfilePanel() {
  const classes = useStyles();

  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const isAccountOwnerOrAdmin = useSelector(state => selectors.isAccountOwnerOrAdmin(state));
  const isUserAllowedOnlySSOSignIn = useSelector(state => selectors.isUserAllowedOnlySSOSignIn(state));

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
  const colorThemeList = useMemo(
    () => [
      {
        items: [
          {
            label: 'Light',
            value: 'light',
          },
          {
            label: 'Dark',
            value: 'dark',
          },
          {
            label: 'Orion',
            value: 'orion',
          },
        ],
      },
    ],
    []
  );

  const dispatch = useDispatch();
  const handleSubmit = useCallback(formVal => {
    const completePayloadCopy = { ...formVal };
    const { timeFormat, dateFormat, showRelativeDateTime, colorTheme, showIconView } = completePayloadCopy;
    const preferencesPayload = { timeFormat, dateFormat, showRelativeDateTime, colorTheme, showIconView, darkTheme: undefined };

    // track event if there is any action for Developer mode
    if (preferences.developer !== completePayloadCopy.developer) {
      dispatch(
        actions.analytics.gainsight.trackEvent('MY_ACCOUNT', {
          operation: 'Developer mode',
          timestamp: new Date(),
          status: completePayloadCopy.developer ? 'Enabled' : 'Disabled',
          tab: 'Profile',
        })
      );
    }
    dispatch(actions.user.preferences.update(preferencesPayload));
    // deleting preferences from completePayloadCopy
    delete completePayloadCopy.timeFormat;
    delete completePayloadCopy.dateFormat;
    delete completePayloadCopy.showRelativeDateTime;
    delete completePayloadCopy.colorTheme;
    delete completePayloadCopy.showIconView;

    dispatch(actions.user.profile.update(completePayloadCopy));
  }, [dispatch, preferences.developer]);

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
        noApi: true,
        defaultValue: preferences && preferences.name,
        isLoggable: false,
      },
      email: {
        id: 'email',
        name: 'email',
        type: 'useremail',
        label: 'Email',
        helpKey: 'myaccount.email',
        noApi: true,
        readOnly: isUserAllowedOnlySSOSignIn,
        value: preferences && preferences.email,
        isLoggable: false,
      },
      password: {
        id: 'password',
        name: 'password',
        label: 'Password',
        helpKey: 'myaccount.password',
        noApi: true,
        type: 'userpassword',
        visible: !isUserAllowedOnlySSOSignIn,
        isLoggable: false,
      },
      company: {
        id: 'company',
        name: 'company',
        type: 'text',
        label: 'Company',
        helpKey: 'myaccount.company',
        noApi: true,
        defaultValue: preferences && preferences.company,
        isLoggable: false,
      },
      phone: {
        id: 'phone',
        name: 'phone',
        type: 'text',
        label: 'Phone',
        helpKey: 'myaccount.phone',
        noApi: true,
        defaultValue: preferences && preferences.phone,
        isLoggable: false,
      },
      role: {
        id: 'role',
        name: 'role',
        type: 'text',
        helpKey: 'myaccount.role',
        noApi: true,
        label: 'Role',
        defaultValue: preferences && preferences.role,
        isLoggable: false,
      },
      timezone: {
        id: 'timezone',
        name: 'timezone',
        type: 'select',
        label: 'Time zone',
        required: true,
        helpKey: 'myaccount.timezone',
        noApi: true,
        defaultValue: preferences && preferences.timezone,
        options: dateTimeZonesList,
        isLoggable: false,
      },
      dateFormat: {
        id: 'dateFormat',
        name: 'dateFormat',
        type: 'select',
        required: true,
        helpKey: 'myaccount.dateFormat',
        noApi: true,
        label: 'Date format',
        defaultValue: preferences && preferences.dateFormat,
        options: dateFormatList,
        isLoggable: true,
      },
      timeFormat: {
        id: 'timeFormat',
        name: 'timeFormat',
        type: 'select',
        helpKey: 'myaccount.timeFormat',
        noApi: true,
        required: true,
        label: 'Time format',
        defaultValue: preferences && preferences.timeFormat,
        options: timeFormatList,
        isLoggable: true,
      },
      showRelativeDateTime: {
        id: 'showRelativeDateTime',
        name: 'showRelativeDateTime',
        type: 'checkbox',
        helpKey: 'myaccount.showRelativeDateTime',
        noApi: true,
        label: 'Show timestamps as relative',
        defaultValue: preferences?.showRelativeDateTime,
        isLoggable: true,
      },
      developer: {
        id: 'developer',
        name: 'developer',
        type: 'checkbox',
        helpKey: 'myaccount.developer',
        noApi: true,
        label: 'Developer mode',
        defaultValue: preferences && preferences.developer,
        // is this loggable
        isLoggable: true,
      },
      showIconView: {
        id: 'showIconView',
        name: 'showIconView',
        type: 'checkbox',
        helpKey: 'myaccount.showIconView',
        noApi: true,
        label: 'Show flowbuilder icon view',
        defaultValue: preferences && preferences.showIconView,
        // is this loggable
        isLoggable: true,
        visible: (!isProduction() && process.env.ICON_VIEW_FLOWBUILDER === 'true'),
      },
      colorTheme: {
        id: 'colorTheme',
        name: 'colorTheme',
        helpKey: 'myaccount.colorTheme',
        type: 'select',
        label: 'Color theme',
        required: true,
        options: colorThemeList,
        defaultValue: preferences && (preferences.colorTheme || 'light'),
        labelSubText: 'For internal testing only',
        visible: !isProduction(),
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
        'showRelativeDateTime',
        'developer',
        'colorTheme',
        'showIconView',
      ],
    },
  }), [preferences, isUserAllowedOnlySSOSignIn, dateTimeZonesList, dateFormatList, timeFormatList, colorThemeList]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count => count + 1);
  }, [fieldMeta]);

  const formKey = useFormInitWithPermissions({
    fieldMeta,
    remount: count,
    skipMonitorLevelAccessCheck: true,
  });

  return (
    <div className={classes.root}>
      <PanelHeader title="Profile" className={classes.profilePanelHeader} infoText={infoText.Profile} />
      <LoadResources required resources={isAccountOwnerOrAdmin ? 'ssoclients' : ''}>
        <DynaForm formKey={formKey} className={classes.formContainer} />
        <DynaSubmit
          formKey={formKey}
          onClick={submitHandler()}
          className={classes.saveBtnProfile}
          disabled={disableSave}>
          {defaultLabels.saveLabel}
        </DynaSubmit>
        {
        isGoogleSignInAllowed() && (
        <div className={classes.googleSignInPanel}>
          <PanelHeader
            title="Sign in via Google"
            className={classes.signInOption}
          />
          {preferences &&
            (!preferences.auth_type_google ||
              !preferences.auth_type_google.id) && (
              <InputLabel>
                <span className={classes.label}>Link to:</span>
                <OutlinedButton
                  data-test="linkWithGoogle"
                  color="secondary"
                  googleBtn
                  className={classes.googleBtn}
                  onClick={handleLinkWithGoogle}>
                  <span className={classes.btnLabel}>Google</span>
                </OutlinedButton>
              </InputLabel>
          )}
          {preferences &&
            preferences.auth_type_google &&
            preferences.auth_type_google.id && (
              <InputLabel>
                <span className={classes.label}>Unlink from:</span>
                <OutlinedButton
                  data-test="unlinkWithGoogle"
                  color="secondary"
                  googleBtn
                  className={classes.googleBtn}
                  onClick={handleUnLinkWithGoogle}>
                  <span className={classes.btnLabel}>Google</span>
                </OutlinedButton>
              </InputLabel>
          )}
        </div>
        )
}
      </LoadResources>
    </div>
  );
}
