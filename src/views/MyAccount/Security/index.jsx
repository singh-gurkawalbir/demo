import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import LoadResources from '../../../components/LoadResources';
import DynaForm from '../../../components/DynaForm';
import DynaSubmit from '../../../components/DynaForm/DynaSubmit';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import { generateNewId, isNewId, getDomainUrl } from '../../../utils/resource';
import PanelHeader from '../../../components/PanelHeader';
import Help from '../../../components/Help';
import useSaveStatusIndicator from '../../../hooks/useSaveStatusIndicator';

const useStyles = makeStyles(theme => ({
  ssoForm: {
    paddingLeft: theme.spacing(2),
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    margin: theme.spacing(0, 2),
  },
  footer: {
    margin: theme.spacing(2),
  },
  helpTextButton: {
    marginLeft: theme.spacing(0.5),
    height: theme.spacing(2),
    width: theme.spacing(2),
    padding: 0,
    marginRight: theme.spacing(2),
  },
  ssoSwitch: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    marginBottom: theme.spacing(0.5),
  },
  flexContainer: {
    display: 'flex',
    '& + div': {
      marginTop: theme.spacing(2),
    },
  },
  content: {
    fontSize: '14px',
  },
  urlDetails: {
    fontSize: '15px',
    lineHeight: '20px',
  },
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    minHeight: 124,
  },
  ssoFormContainer: {
    '&>div>div:last-child': {
      marginBottom: 0,
    },
  },
  spinner: {
    marginLeft: theme.spacing(0.5),
    display: 'flex',
  },
}));

export default function Security() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const preferences = useSelector(state => selectors.userProfilePreferencesProps(state), shallowEqual);
  const oidcClient = useSelector(state => selectors.oidcSSOClient(state));
  const isAccountOwnerOrAdmin = useSelector(state => selectors.isAccountOwnerOrAdmin(state));
  const isAccountOwner = useSelector(state => selectors.isAccountOwner(state));
  const ssoPrimaryAccounts = useSelector(state => selectors.ssoPrimaryAccounts(state), shallowEqual);
  const [remountCount, setRemountCount] = useState(0);
  const resourceId = oidcClient?._id || generateNewId();
  const isEnableSSOSwitchInProgress = useSelector(state => selectors.commStatusPerPath(state, `/ssoclients/${resourceId}`, 'PATCH') === 'loading');
  const [isSSOEnabled, setIsSSOEnabled] = useState(!!oidcClient?.disabled);
  const handleEnableSSO = useCallback(
    () => {
      if (isEnableSSOSwitchInProgress) return;

      if (isNewId(resourceId)) {
        return setIsSSOEnabled(prevValue => !prevValue);
      }
      const patchSet = [];

      if (oidcClient && 'disabled' in oidcClient) {
        patchSet.push({
          op: 'remove',
          path: '/disabled',
        });
      } else {
        patchSet.push({
          op: 'add',
          path: '/disabled',
          value: true,
        });
      }

      dispatch(actions.resource.patch('ssoclients', resourceId, patchSet));
    },
    [dispatch, oidcClient, resourceId, isEnableSSOSwitchInProgress],
  );

  useEffect(() => {
    if (oidcClient) {
      setIsSSOEnabled(!oidcClient?.disabled);
    }
  }, [oidcClient]);

  const primaryAccountOptions = useMemo(() => (
    [{
      items: ssoPrimaryAccounts.map(
        acc => ({label: acc.ownerUser?.name, value: acc.ownerUser?._ssoClientId})
      ),
    }]
  ), [ssoPrimaryAccounts]);

  const fieldMeta = useMemo(
    () => {
      const _ssoAccountId = {
        id: '_ssoAccountId',
        type: 'select',
        name: '_ssoAccountId',
        label: 'Primary account',
        required: true,
        options: primaryAccountOptions,
        defaultValue: preferences?._ssoAccountId,
        defaultDisabled: preferences?.authTypeSSO?.sub,
        visible: !isAccountOwner,
      };

      if (!isAccountOwnerOrAdmin) {
        return {
          fieldMap: {
            _ssoAccountId,
          },
        };
      }

      return ({
        fieldMap: {
          _ssoAccountId,
          enableSSO: {
            id: 'enableSSO',
            type: 'enablesso',
            handleEnableSSO,
            isSSOEnabled,
            resourceId,
          },
          issuerURL: {
            id: 'issuerURL',
            name: 'issuerURL',
            type: 'text',
            label: 'Issuer URL',
            required: true,
            defaultValue: oidcClient?.oidc?.issuerURL,
            helpKey: 'sso.issuerURL',
            noApi: true,
            isLoggable: false,
            visible: isSSOEnabled,
          },
          clientId: {
            id: 'clientId',
            name: 'clientId',
            type: 'text',
            label: 'Client ID',
            required: true,
            defaultValue: oidcClient?.oidc?.clientId,
            helpKey: 'sso.clientId',
            isLoggable: false,
            noApi: true,
            visible: isSSOEnabled,
          },
          clientSecret: {
            id: 'clientSecret',
            name: 'clientSecret',
            type: 'text',
            inputType: 'password',
            label: 'Client secret',
            required: true,
            helpKey: 'sso.clientSecret',
            isLoggable: false,
            noApi: true,
            visible: isSSOEnabled,
          },
          orgId: {
            id: 'orgId',
            name: 'orgId',
            type: 'ssoorgid',
            label: 'Organization ID',
            required: true,
            defaultValue: oidcClient?.orgId,
            helpKey: 'sso.orgId',
            isLoggable: false,
            noApi: true,
            visible: isSSOEnabled,
          },
        },
        layout: {
          type: 'collapse',
          containers: [
            {
              collapsed: false,
              label: 'User settings',
              fields: ['_ssoAccountId'],
            },
            {
              collapsed: false,
              label: 'Account settings',
              containers: [
                {fields: ['enableSSO'] },
                {
                  type: 'indent',
                  containers: [
                    {
                      fields: ['issuerURL', 'clientId', 'clientSecret', 'orgId'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      });
    },
    [
      handleEnableSSO,
      isAccountOwner,
      isAccountOwnerOrAdmin,
      isSSOEnabled,
      oidcClient?.oidc?.clientId,
      oidcClient?.oidc?.issuerURL,
      oidcClient?.orgId, preferences,
      primaryAccountOptions,
      resourceId,
    ]
  );

  const remountAfterSave = useCallback(() => {
    setRemountCount(count => count + 1);
  }, []);

  useEffect(() => {
    remountAfterSave();
  }, [isSSOEnabled, remountAfterSave]);

  // remount the form when fieldMeta changes
  const formKey = useFormInitWithPermissions({
    fieldMeta,
    remount: remountCount,
    skipMonitorLevelAccessCheck: true,
  });

  const handleSubmit = useCallback(formValues => {
    const {_ssoAccountId} = formValues;

    if (_ssoAccountId) {
      const payload = {...preferences, _ssoAccountId};

      dispatch(actions.user.profile.update(payload));
    }

    if (!isAccountOwnerOrAdmin) return;

    const patchSet = [];
    const isNewClient = isNewId(resourceId);

    patchSet.push({
      op: isNewClient ? 'add' : 'replace',
      path: '/orgId',
      value: formValues.orgId,
    });
    if (isNewClient) {
      patchSet.push({
        op: 'add',
        path: '/oidc',
        value: {},
      });
      patchSet.push({
        op: 'add',
        path: '/type',
        value: 'oidc',
      });
    }
    patchSet.push({
      op: isNewClient ? 'add' : 'replace',
      path: '/oidc/issuerURL',
      value: formValues.issuerURL,
    });
    patchSet.push({
      op: isNewClient ? 'add' : 'replace',
      path: '/oidc/clientId',
      value: formValues.clientId,
    });
    patchSet.push({
      op: isNewClient ? 'add' : 'replace',
      path: '/oidc/clientSecret',
      value: formValues.clientSecret,
    });

    dispatch(actions.resource.patchAndCommitStaged('ssoclients', resourceId, patchSet));
  }, [dispatch, isAccountOwnerOrAdmin, preferences, resourceId]);

  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      paths: ['/profile', isNewId(resourceId) ? '/ssoclients' : `/ssoclients/${resourceId}`],
      methods: ['PUT', isNewId(resourceId) ? 'post' : 'put'],
      onSave: handleSubmit,
      remountAfterSave,
    }
  );

  let domainURL = getDomainUrl();

  if (domainURL.includes('localhost')) {
    domainURL = process.env.API_ENDPOINT;
  }

  const applicationLoginURL = `${domainURL}/sso/${oidcClient?.orgId}`;
  const redirectURL = `${domainURL}/sso/${oidcClient?.orgId}/callback`;
  const infoTextSSO = 'Configure single sign-on settings in this section';
  const resourcesToLoad = isAccountOwnerOrAdmin ? 'ssoclients' : [];

  return (
    <LoadResources required resources={resourcesToLoad}>
      <div className={classes.root}>
        <PanelHeader title="Single sign-on (SSO)" infoText={infoTextSSO} />
        <div className={classes.ssoForm}>
          <DynaForm formKey={formKey} className={classes.ssoFormContainer} />
          {
                !!oidcClient?.orgId && isSSOEnabled && (
                <div>
                  <div className={classes.flexContainer}>
                    <Typography className={classes.urlDetails}> Application login URL: { applicationLoginURL }</Typography>
                    <Help title="Application login URL" helpKey="sso.loginURL" className={classes.helpTextButton} />
                  </div>
                  <div className={classes.flexContainer}>
                    <Typography className={classes.urlDetails}>Redirect URL: { redirectURL }</Typography>
                    <Help title="Redirect URL" helpKey="sso.redirectURL" className={classes.helpTextButton} />
                  </div>
                </div>
                )
            }
        </div>
        <div className={classes.footer}>
          <DynaSubmit
            formKey={formKey}
            disabled={disableSave}
            onClick={submitHandler()}>
            {defaultLabels.saveLabel}
          </DynaSubmit>
        </div>
      </div>
    </LoadResources>
  );
}

