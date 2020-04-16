import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Grid, Typography } from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import DynaForm from '../../components/DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import { MODEL_PLURAL_TO_LABEL } from '../../utils/resource';
import templateUtil from '../../utils/template';
import LoadResources from '../../components/LoadResources';
import getRoutePath from '../../utils/routePaths';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import Spinner from '../../components/Spinner';
import Loader from '../../components/Loader';
import CeligoPageBar from '../../components/CeligoPageBar';
import { getIntegrationAppUrlName } from '../../utils/integrationApps';

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

export default function ClonePreview(props) {
  const classes = useStyles(props);
  const cloningDescription = `
  Cloning can be used to create a copy of a flow, export, import, orchestration, or an entire integration. Cloning is useful for testing changes without affecting your production integrations (i.e. when you clone something you can choose a different set of connection records). Cloning supports both sandbox and production environments.`;
  const { resourceType, resourceId } = props.match.params;
  const [requested, setRequested] = useState(false);
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const preferences = useSelector(state => selectors.userPreferences(state));
  const showIntegrationField = resourceType === 'flows';
  const resource = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)
  );
  const isIAIntegration =
    resourceType === 'integrations' && resource._connectorId;
  const { createdComponents } =
    useSelector(state =>
      selectors.cloneData(state, resourceType, resourceId)
    ) || {};
  const { isCloned, integrationId } = useSelector(
    state => selectors.integrationAppClonedDetails(state, resource._id),
    (left, right) =>
      left &&
      right &&
      left.isCloned === right.isCloned &&
      left.integrationId === right.integrationId
  );
  const integrationAppName =
    isIAIntegration && getIntegrationAppUrlName(resource && resource.name);
  const integrations = useSelector(
    state =>
      selectors.resourceList(state, {
        type: 'integrations',
        ignoreEnvironmentFilter: true,
        filter: {
          _connectorId: { $exists: false },
        },
      }).resources
  );
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
      value: r => r.doc.name || r.doc._id,
      orderBy: 'name',
    },
    { heading: 'Type', value: r => r.model },
    { heading: 'Description', value: r => r.doc.description },
  ];

  useEffect(() => {
    if (isCloned && isIAIntegration) {
      props.history.push(
        getRoutePath(
          `/integrationapps/${integrationAppName}/${integrationId}/setup`
        )
      );
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
        <Typography variant="h4">Loading Clone Preview</Typography>
        <Spinner color="primary" />
      </Loader>
    );
  }

  const { objects = [] } = components;
  const fieldMeta = {
    fieldMap: {
      tag: {
        id: 'tag',
        name: 'tag',
        type: 'text',
        label: 'Tag',
        defaultValue: `Clone - ${resource ? resource.name : ''}`,
        visible: isIAIntegration,
      },
      name: {
        id: 'name',
        name: 'name',
        type: 'text',
        label: 'Name',
        defaultValue: isIAIntegration
          ? resource && resource.name
          : `Clone - ${resource ? resource.name : ''}`,
        visible: !isIAIntegration,
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
        visible: !isIAIntegration,
      },
      message: {
        id: 'message',
        name: 'message',
        disablePopover: true,
        type: 'labeltitle',
        label: `The following components will get cloned with this ${MODEL_PLURAL_TO_LABEL[resourceType]}.`,
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
              'tag',
              'name',
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
      props.history.push(`/pg/clone/${resourceType}/${resourceId}/setup`);
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
    <LoadResources resources={[resourceType, 'integrations']} required>
      <CeligoPageBar title="Cloning" infoText={cloningDescription} />
      <Fragment>
        <Grid container>
          <Grid className={classes.componentPadding} item xs={12}>
            <DynaForm
              fieldMeta={fieldMeta}
              optionsHandler={fieldMeta.optionsHandler}>
              <DynaSubmit data-test="clone" onClick={clone}>
                {`Clone ${MODEL_PLURAL_TO_LABEL[resourceType]}`}
              </DynaSubmit>
            </DynaForm>
          </Grid>
        </Grid>
      </Fragment>
    </LoadResources>
  );
}
