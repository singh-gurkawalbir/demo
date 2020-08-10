import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState, useCallback } from 'react';
import { isEmpty } from 'lodash';
import { Grid, Typography } from '@material-ui/core';
import { selectors } from '../../reducers';
import actions from '../../actions';
import DynaForm from '../../components/DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import { MODEL_PLURAL_TO_LABEL } from '../../utils/resource';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../constants/resource';
import templateUtil from '../../utils/template';
import LoadResources from '../../components/LoadResources';
import getRoutePath from '../../utils/routePaths';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import Spinner from '../../components/Spinner';
import Loader from '../../components/Loader';
import CeligoPageBar from '../../components/CeligoPageBar';
import { getIntegrationAppUrlName } from '../../utils/integrationApps';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import InfoIconButton from '../../components/InfoIconButton';
import useConfirmDialog from '../../components/ConfirmDialog';

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(1),
  },
  templateBody: {
    padding: '15px',
  },
  appDetails: {
    paddingTop: '25px',
  },
  marketplaceContainer: {
    maxWidth: '90vw',
    padding: '0 15px',
  },
  appDetailsHeader: {
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
    marginBottom: '5px',
  },
  container: {
    borderTop: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  paper: {
    padding: theme.spacing(1, 2),
    background: theme.palette.background.default,
  },
  templateBoxHead: {
    padding: '10px 0',
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  installButton: {
    paddingTop: '20px',
  },
  description: {
    paddingBottom: '20px',
  },
  nameField: {
    marginBottom: '10px',
  },
  componentPadding: {
    padding: theme.spacing(3, 3, 12, 3),
  },
  componentsTable: {
    paddingTop: '20px',
  },
}));
const integrationsFilterConfig = {
  type: 'integrations',
  ignoreEnvironmentFilter: true,
  filter: {
    _connectorId: { $exists: false },
  },
};

export default function ClonePreview(props) {
  const classes = useStyles(props);
  const cloningDescription = `
  Cloning can be used to create a copy of a flow, export, import, orchestration, or an entire integration. Cloning is useful for testing changes without affecting your production integrations (i.e. when you clone something you can choose a different set of connection records). Cloning supports both sandbox and production environments.`;
  const { resourceType, resourceId } = props.match.params;
  const [requested, setRequested] = useState(false);
  const [cloneRequested, setCloneRequested] = useState(false);
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [enquesnackbar] = useEnqueueSnackbar();
  const preferences = useSelector(state => selectors.userPreferences(state));
  const showIntegrationField = resourceType === 'flows';
  const resource =
    useSelector(state => selectors.resource(state, resourceType, resourceId)) ||
    {};
  const [formState, setFormState] = useState({
    showFormValidationsBeforeTouch: false,
  });
  const showCustomFormValidations = useCallback(() => {
    setFormState({
      showFormValidationsBeforeTouch: true,
    });
  }, []);
  const isIAIntegration =
    !!(resourceType === 'integrations' && resource._connectorId);
  const { createdComponents } =
    useSelector(state =>
      selectors.cloneData(state, resourceType, resourceId)
    ) || {};
  const { isCloned, integrationId, sandbox } = useSelector(
    state => selectors.integrationAppClonedDetails(state, resource._id),
    (left, right) =>
      left &&
      right &&
      left.isCloned === right.isCloned &&
      left.integrationId === right.integrationId &&
      left.sandbox === right.sandbox
  );
  const integrationAppName =
    isIAIntegration && getIntegrationAppUrlName(resource && resource.name);
  const integrations = useSelectorMemo(
    selectors.makeResourceListSelector,
    integrationsFilterConfig
  ).resources;
  const selectedAccountHasSandbox = useSelector(state => {
    const accounts = selectors.accountSummary(state);
    const selectedAccount = accounts && accounts.find(a => a.selected);

    if (
      selectedAccount &&
      (selectedAccount.hasSandbox || selectedAccount.hasConnectorSandbox)
    ) {
      return true;
    }

    return false;
  });
  const components = useSelector(state =>
    selectors.clonePreview(state, resourceType, resourceId)
  );
  const columns = [
    {
      heading: 'Name',
      value: function NameWithInfoicon(r) {
        return (
          <>
            {r && (r.doc.name || r.doc._id)}
            <InfoIconButton info={r.doc.description} size="xs" />
          </>
        );
      },
      orderBy: 'name',
    },
    { heading: 'Type', value: r => r.model },
  ];

  useEffect(() => {
    if (isIAIntegration) {
      if (isCloned) {
        if (!sandbox === (preferences.environment === 'sandbox')) {
          confirmDialog({
            title: 'Confirm switch',
            message: `Your integration app has been successfully cloned to your ${sandbox ? 'sandbox' : 'production'}. Congratulations! Switch back to your ${!sandbox ? 'sandbox' : 'production'} account?.`,
            buttons: [
              {
                label: 'Yes, switch',
                onClick: () => {
                  props.history.push(getRoutePath('/'));
                },
              },
              {
                label: 'No, go back',
                color: 'secondary',
                onClick: () => {
                  dispatch(actions.user.preferences.update({ environment: sandbox ? 'sandbox' : 'production' }));
                  props.history.push(
                    getRoutePath(
                      `/clone/integrationapps/${integrationAppName}/${integrationId}/setup`
                    )
                  );
                },
              },
            ],
          });
        } else {
          props.history.push(
            getRoutePath(
              `/clone/integrationapps/${integrationAppName}/${integrationId}/setup`
            )
          );
        }
      } else {
        setCloneRequested(false);
      }
      dispatch(
        actions.integrationApp.clone.clearIntegrationClonedStatus(resource._id)
      );
    }
  }, [
    dispatch,
    integrationAppName,
    isIAIntegration,
    isCloned,
    props.history,
    integrationId,
    resource._id,
    confirmDialog,
    sandbox,
    preferences.environment,
  ]);

  useEffect(() => {
    if (!components || (isEmpty(components) && !requested)) {
      dispatch(actions.clone.requestPreview(resourceType, resourceId));
      setRequested(true);
    }
  }, [components, dispatch, requested, resourceId, resourceType]);
  useEffect(() => {
    if (createdComponents) {
      dispatch(actions.template.clearTemplate(`${resourceType}-${resourceId}`));
      dispatch(actions.resource.requestCollection('integrations'));
      dispatch(actions.resource.requestCollection('flows'));
      dispatch(actions.resource.requestCollection('connections'));
      dispatch(actions.resource.requestCollection('exports'));
      dispatch(actions.resource.requestCollection('imports'));
      dispatch(actions.resource.requestCollection('stacks'));

      if (['integrations', 'flows'].includes(resourceType)) {
        // redirect to integration Settings
        const integration = createdComponents.find(
          c => c.model === 'Integration'
        );

        if (integration) {
          props.history.push(
            getRoutePath(`/integrations/${integration._id}/flows`)
          );
        } else {
          props.history.push(getRoutePath('dashboard'));
        }
      } else {
        props.history.push(getRoutePath(`/${resourceType}`));
      }
    }
  }, [createdComponents, dispatch, props.history, resourceId, resourceType]);

  if (!components || isEmpty(components)) {
    return (
      <Loader open>
        <Typography variant="h4">Loading</Typography>
        <Spinner color="primary" />
      </Loader>
    );
  }

  const { objects = [] } = components;
  const fieldMeta = {
    fieldMap: {
      name: {
        id: 'name',
        name: 'name',
        type: 'text',
        label: 'Name',
        helpKey: `${RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}.name`,
        required: !isIAIntegration,
        defaultValue: isIAIntegration
          ? resource && resource.name
          : `Clone - ${resource ? resource.name : ''}`,
        visible: !isIAIntegration,
      },
      tag: {
        id: 'tag',
        name: 'tag',
        type: 'text',
        label: 'Tag',
        defaultValue: `Clone - ${resource ? resource.name : ''}`,
        visible: isIAIntegration,
      },
      environment: {
        id: 'environment',
        name: 'environment',
        type: 'radiogroup',
        label: 'Environment',
        fullWidth: true,
        visible: selectedAccountHasSandbox,
        options: [
          {
            items: [
              { label: 'Production', value: 'production' },
              { label: 'Sandbox', value: 'sandbox' },
            ],
          },
        ],
        defaultValue: preferences.environment,
      },
      integration: {
        id: 'integration',
        name: 'integration',
        type: 'select',
        label: 'Integration',
        required: true,
        refreshOptionsOnChangesTo: ['environment'],
        options: [
          {
            items: integrations
              .filter(
                i => !!i.sandbox === (preferences.environment === 'sandbox')
              )
              .map(i => ({ label: i.name, value: i._id }))
              .concat([{ label: 'Standalone Integration', value: 'none' }]),
          },
        ],
      },
      description: {
        id: 'description',
        name: 'description',
        type: 'labeltitle',
        disablePopover: true,
        label: resource && resource.description,
        visible: (!isIAIntegration && !!(resource?.description)),
      },
      message: {
        id: 'message',
        name: 'message',
        disablePopover: true,
        type: 'labeltitle',
        label: `The following components will get cloned with this ${MODEL_PLURAL_TO_LABEL[resourceType].toLowerCase()}.`,
      },
      components: {
        id: 'components',
        name: 'components',
        type: 'celigotable',
        data: objects.map((obj, index) => ({
          ...obj,
          _id: index,
        })),
        columns,
      },
    },
    layout: {
      fields:
        resourceType === 'flows'
          ? [
            'name',
            'environment',
            'integration',
            'description',
            'message',
            'components',
          ]
          : [
            'name',
            'tag',
            'environment',
            'description',
            'message',
            'components',
          ],
    },
    optionsHandler: (fieldId, fields) => {
      if (fieldId === 'integration') {
        const { value: environment } = fields.find(
          field => field.id === 'environment'
        );

        return [
          {
            items: integrations
              .filter(i => !!i.sandbox === (environment === 'sandbox'))
              .map(i => ({ label: i.name, value: i._id }))
              .concat([{ label: 'Standalone Integration', value: 'none' }]),
          },
        ];
      }

      return null;
    },
  };
  const clone = ({ name, environment, integration, tag }) => {
    const { installSteps, connectionMap } =
      templateUtil.getInstallSteps(components) || {};

    if (isIAIntegration) {
      dispatch(
        actions.template.installStepsReceived(
          [],
          {},
          `${resourceType}-${resourceId}`,
          {
            tag,
            name,
            sandbox: environment === 'sandbox',
            _integrationId: integration,
            newTemplateInstaller: true,
          }
        )
      );
      setCloneRequested(true);
      dispatch(actions.clone.createComponents(resourceType, resourceId));

      return;
    }

    if (showIntegrationField && !integration) {
      enquesnackbar({ message: 'Please select Integration.', variant: 'info' });

      return false;
    }

    if (installSteps && installSteps.length) {
      dispatch(
        actions.template.installStepsReceived(
          installSteps,
          connectionMap,
          `${resourceType}-${resourceId}`,
          {
            name,
            sandbox: environment === 'sandbox',
            _integrationId: integration,
          }
        )
      );
      props.history.push(getRoutePath(`/clone/${resourceType}/${resourceId}/setup`));
    } else {
      dispatch(
        actions.template.installStepsReceived(
          [],
          {},
          `${resourceType}-${resourceId}`,
          {
            name,
            sandbox: environment === 'sandbox',
            _integrationId: integration,
          }
        )
      );
      dispatch(actions.clone.createComponents(resourceType, resourceId));
    }
  };

  return (
    <LoadResources resources="flows,exports,imports,integrations" required>
      <CeligoPageBar title={`Clone ${MODEL_PLURAL_TO_LABEL[resourceType].toLowerCase()}`} infoText={cloningDescription} />
      <>
        <Grid container>
          <Grid className={classes.componentPadding} item xs={12}>
            <DynaForm
              formState={formState}
              fieldMeta={fieldMeta}
              optionsHandler={fieldMeta.optionsHandler}>
              <DynaSubmit
                ignoreFormTouchedCheck
                showCustomFormValidations={showCustomFormValidations}
                disabled={cloneRequested}
                data-test="clone"
                onClick={clone}>
                {`Clone ${MODEL_PLURAL_TO_LABEL[resourceType].toLowerCase()}`}
              </DynaSubmit>
            </DynaForm>
          </Grid>
        </Grid>
      </>
    </LoadResources>
  );
}
