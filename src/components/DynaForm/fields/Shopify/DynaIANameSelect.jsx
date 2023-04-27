import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import DynaSelect from '../DynaSelect';
import FieldHelp from '../../FieldHelp';
import RefreshIcon from '../../../icons/RefreshIcon';
import TextButton from '../../../Buttons/TextButton';

import messageStore from '../../../../utils/messageStore';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { isNewId } from '../../../../utils/resource';
import { isIntegrationAppVersion2 } from '../../../../utils/integrationApps';
import MessageWithLink from '../../../MessageWithLink';

const useStyles = makeStyles(theme => ({
  fieldWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  labelWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  refresh: {
    fontSize: 14,
  },
  integrationNameInfo: {
    '& > .MuiTypography-root': {
      color: theme.palette.secondary.light,
      '& > svg': {
        color: theme.palette.secondary.light,
      },
    },

  },
}));

export default function DynaIANameSelect(props) {
  const dispatch = useDispatch();
  const { link, appLabel, clientId, options = {}, value } = props;
  const classes = useStyles();
  const currentEnvironment = useSelector(state =>
    selectors.currentEnvironment(state)
  );
  const integrations = useSelector(state => selectors.getLandingPageIntegrations(state));
  const handleRefresh = useCallback(() => {
    dispatch(actions.integrationApp.landingPage.requestIntegrations({ clientId }));
  }, [dispatch, clientId]);

  // sandbox filter depends on env
  // removing the 2.0 IA if there in install mode. since it need some handling
  const selectOptions = useMemo(() =>
    [{
      items: integrations.filter(eachIA => ((eachIA?.sandbox === (currentEnvironment === 'sandbox')) ||
      (!eachIA?.hasOwnProperty('sandbox') && (currentEnvironment === 'production'))) &&
      ((isIntegrationAppVersion2(eachIA, true) && eachIA?.mode === 'settings') ||
      !isIntegrationAppVersion2(eachIA, true))).map(eachIA => ({
        label: eachIA.name,
        value: eachIA._id,
        itemInfo: eachIA.tag,
      })),
    }], [currentEnvironment, integrations]);

  const predicateForPatchFilter = patch => !['/_integrationId', '/_connectorId', '/installStepConnection'].includes(patch.path);

  useEffect(() => {
    if (value) {
      const integration = integrations.find(eachIA => eachIA?._id === value) || {};
      const patch = [
        {op: 'add', path: '/_integrationId', value},
        {op: 'add', path: '/_connectorId', value: integration._connectorId},
      ];

      // uncomment to add IA 2.0 install steps here to complete the install
      // if ((integration?._sourceId || integration?._parentId) && integration?.mode === 'install') {
      //   patch.push(
      //     {op: 'replace', path: '/installStepConnection', value: true }
      //   );
      // }

      dispatch(actions.resource.patchStaged(options.connectionId, patch));
    }

    return () => {
      dispatch(actions.resource.removeStage(options.connectionId, predicateForPatchFilter));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.connectionId, value, dispatch]);

  useEffect(() => {
    if (options.connectionId && ((options.useNew && value) || (!options.useNew && !isNewId(options.connectionId)))) {
      dispatch(actions.resource.connections.requestIClients(options.connectionId));
    }
  }, [options.connectionId, dispatch, value, options.useNew]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  return selectOptions[0].items.length > 0
    ? (
      <DynaSelect
        {...props}
        options={selectOptions}
        removeInvalidValues
      />
    ) : (
      <>
        <div className={classes.labelWrapper}>
          <div className={classes.fieldWrapper}>
            <FormLabel htmlFor={props.id} required={props.required} error={!props.isValid}>
              {props.label}
            </FormLabel>
            <FieldHelp {...props} />
          </div>
          <TextButton
            data-test="refreshExtracts"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            className={classes.refresh}
            size="small"
          >
            Refresh
          </TextButton>
        </div>
        <MessageWithLink
          message={messageStore('SHOPIFY_LANDING_PAGE.IA_NAME_MESSAGE', {appLabel})}
          link={link}
          linkText={`Browse ${appLabel} integration apps`}
          className={classes.integrationNameInfo}
        />
      </>
    );
}
