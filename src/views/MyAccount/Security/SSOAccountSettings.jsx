import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import LoadResources from '../../../components/LoadResources';
import CeligoSwitch from '../../../components/CeligoSwitch';
import DynaForm from '../../../components/DynaForm';
import DynaSubmit from '../../../components/DynaForm/DynaSubmit';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import { generateNewId, isNewId, getDomainUrl } from '../../../utils/resource';
import { hashCode } from '../../../utils/string';
import Help from '../../../components/Help';
import Spinner from '../../../components/Spinner';
import useSaveStatusIndicator from '../../../hooks/useSaveStatusIndicator';
import CollapsableContainer from '../../../components/ResourceDiffVisualizer/CollapsableContainer';

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
    padding: theme.spacing(2, 2),
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

  collapseContainer: {
    margin: theme.spacing(2),
    '& .MuiAccordionDetails-root': {
      borderTop: `1px solid ${theme.palette.secondary.lightest}`,
      padding: 0,
    },
  },

}));

export default function SSOAccountSettings() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const oidcClient = useSelector(state => selectors.oidcSSOClient(state));
  const key = hashCode(oidcClient);
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

  const fieldMeta = useMemo(
    () => ({
      fieldMap: {
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
        },
      },
    }),
    [oidcClient]
  );

  const formKey = useFormInitWithPermissions({ fieldMeta, remount: key });

  const handleSubmit = useCallback(formValues => {
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
  }, [dispatch, resourceId]);

  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      path: isNewId(resourceId) ? '/ssoclients' : `/ssoclients/${resourceId}`,
      method: isNewId(resourceId) ? 'post' : 'put',
      onSave: handleSubmit,
    }
  );

  let domainURL = getDomainUrl();

  if (domainURL.includes('localhost')) {
    domainURL = process.env.API_ENDPOINT;
  }

  const applicationLoginURL = `${domainURL}/sso/${oidcClient?.orgId}`;
  const redirectURL = `${domainURL}/sso/${oidcClient?.orgId}/callback`;

  return (
    <>
      <LoadResources required resources="ssoclients">
        <div className={classes.collapseContainer}>
          <CollapsableContainer title="Account settings" forceExpand>
            <div className={classes.ssoSwitch}>
              <Typography variant="body2" className={classes.content}> Enable OIDC-based SSO </Typography>
              <Help title="Enable OIDC-based SSO" helpKey="enableSSO" className={classes.helpTextButton} />
              <CeligoSwitch
                onChange={handleEnableSSO}
                checked={isSSOEnabled} />
              {isEnableSSOSwitchInProgress && <Spinner size="small" className={classes.spinner} />}
            </div>
            {
          isSSOEnabled && (
            <>
              <div className={classes.ssoForm}>
                <DynaForm formKey={formKey} className={classes.ssoFormContainer} />
                {
                !!oidcClient?.orgId && (
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
            </>
          )
        }
          </CollapsableContainer>
        </div>
      </LoadResources>
    </>
  );
}
