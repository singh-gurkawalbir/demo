import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import LoadResources from '../../../components/LoadResources';
import CeligoSwitch from '../../../components/CeligoSwitch';
import DynaForm from '../../../components/DynaForm';
import DynaSubmit from '../../../components/DynaForm/DynaSubmit';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import { generateNewId, isNewId, getDomainUrl } from '../../../utils/resource';
import { hashCode } from '../../../utils/string';

const useStyles = makeStyles(theme => ({
  ssoForm: {
    paddingLeft: theme.spacing(2),
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
  },
  footer: {
    marginTop: theme.spacing(2),
  },
}));

export default function Security() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const oidcClient = useSelector(state => selectors.oidcSSOClient(state));
  const key = hashCode(oidcClient);
  const resourceId = oidcClient?._id || generateNewId();
  const [isSSOEnabled, setIsSSOEnabled] = useState(!!oidcClient?.disabled);
  const handleEnableSSO = useCallback(
    () => {
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
    [dispatch, oidcClient, resourceId],
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
        },
        clientId: {
          id: 'clientId',
          name: 'clientId',
          type: 'text',
          label: 'Client Id',
          required: true,
          defaultValue: oidcClient?.oidc?.clientId,
        },
        clientSecret: {
          id: 'clientSecret',
          name: 'clientSecret',
          type: 'text',
          label: 'Client secret',
          required: true,
        },
        orgId: {
          id: 'orgId',
          name: 'orgId',
          type: 'ssoorgid',
          label: 'Organization id',
          required: true,
          defaultValue: oidcClient?.orgId,
        },
      },
      layout: {
        fields: ['issuerURL', 'clientId', 'clientSecret', 'orgId'],
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

    dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('ssoclients', resourceId, 'value'));
  }, [dispatch, resourceId]);

  let domainURL = getDomainUrl();

  if (domainURL.includes('localhost')) {
    domainURL = 'https://staging.integrator.io';
  }

  const applicationLoginURL = `${domainURL}/sso/${oidcClient?.orgId}`;
  const redirectURL = `${domainURL}/sso/${oidcClient?.orgId}/callback`;

  return (
    <>
      <LoadResources required resources="ssoclients">
        <div> Enable OIDC based SSO <CeligoSwitch
          onChange={handleEnableSSO}
          checked={isSSOEnabled}
      />
        </div>
        {
          isSSOEnabled && (
            <>
              <div className={classes.ssoForm}>
                <DynaForm formKey={formKey} />
                {
                !!oidcClient?.orgId && (
                <div>
                  <div> Application login URL: { applicationLoginURL } </div>
                  <div> Redirect URL: { redirectURL } </div>
                </div>
                )
              }
              </div>
              <div className={classes.footer}>
                <DynaSubmit
                  formKey={formKey}
                  onClick={handleSubmit}>
                  Save
                </DynaSubmit>
              </div>
            </>
          )
        }

      </LoadResources>
    </>
  );
}
