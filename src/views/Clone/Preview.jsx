import makeStyles from '@mui/styles/makeStyles';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import { Typography } from '@mui/material'; import clsx from 'clsx';
import { Spinner } from '@celigo/fuse-ui';
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
import Loader from '../../components/Loader';
import CeligoPageBar from '../../components/CeligoPageBar';
import { getIntegrationAppUrlName } from '../../utils/integrationApps';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import useConfirmDialog from '../../components/ConfirmDialog';
import { hashCode } from '../../utils/string';
import { emptyObject, HOME_PAGE_PATH, UNASSIGNED_SECTION_ID } from '../../constants';
import PageContent from '../../components/PageContent';
import { message } from '../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  componentPadding: {
    padding: theme.spacing(1, 1, 8, 1),
  },
  flowGroupDescription: {
    marginTop: theme.spacing(2),
  },
  flowInFlowGroupName: {
    border: 'none',
  },
  flowInFlowGroupNameHover: {
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
  },
  flowGroupTitle: {
    paddingTop: theme.spacing(1),
  },
}));
const integrationsFilterConfig = {
  type: 'integrations',
  ignoreEnvironmentFilter: true,
  filter: {
    _connectorId: { $exists: false },
  },
};
const useColumns = () => [
  {
    key: 'name',
    heading: 'Name',
    width: '40%',
    useGetCellStyling: ({rowData: r}) => {
      const classes = useStyles();
      const { groupName, isLastFlowInFlowGroup } = r || emptyObject;

      return clsx({[classes.flowInFlowGroupName]: !isLastFlowInFlowGroup, [classes.flowInFlowGroupNameHover]: groupName});
    },
    Value: ({rowData: r}) => {
      const classes = useStyles();

      if (r.groupName || r.emptyMessage) {
        return (
          <Typography
            variant={r?.groupName ? 'overline' : 'body2'}
            component="div"
            color="textSecondary"
            className={
            clsx({
              [classes.flowGroupTitle]: r?.groupName,
              [classes.emptyMessageContent]: r?.emptyMessage,
            })
          }>
            {r?.groupName || r?.emptyMessage}
          </Typography>
        );
      }

      return r?.doc?.name || r?.doc?._id;
    },
  },
  {
    key: 'description',
    heading: 'Description',
    width: '60%',
    useGetCellStyling: ({rowData: r}) => {
      const classes = useStyles();
      const { groupName, isLastFlowInFlowGroup } = r || emptyObject;

      return clsx({[classes.flowInFlowGroupName]: !isLastFlowInFlowGroup, [classes.flowInFlowGroupNameHover]: groupName});
    },
    Value: ({rowData: r}) => r?.doc?.description,
  },
];
export default function ClonePreview(props) {
  const classes = useStyles(props);
  const { resourceType, resourceId } = props.match.params;
  const [cloneRequested, setCloneRequested] = useState(false);
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [enquesnackbar] = useEnqueueSnackbar();
  const preferences = useSelector(state => selectors.userPreferences(state));
  const showIntegrationField = resourceType === 'flows';
  const resource = useSelector(state => selectors.resource(state, resourceType, resourceId)) || emptyObject;
  const isIAIntegration = !!(resourceType === 'integrations' && resource._connectorId);
  const { createdComponents } =
    useSelector(state =>
      selectors.template(state, `${resourceType}-${resourceId}`)
    ) || {};
  const { isCloned, integrationId, sandbox } = useSelector(
    state => selectors.integrationClonedDetails(state, resource._id),
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

    return selectedAccount?.hasSandbox || selectedAccount?.hasConnectorSandbox;
  });
  const { components } = useSelector(state =>
    selectors.previewTemplate(state, `${resourceType}-${resourceId}`)
  );

  const remountKey = useMemo(() => hashCode({components, resource, integrationsLength: integrations.length}), [components, resource, integrations.length]);

  useEffect(() => {
    if (resourceType === 'integrations') {
      if (isCloned) {
        if (!sandbox === (preferences.environment === 'sandbox')) {
          confirmDialog({
            title: 'Confirm switch',
            message: `Your ${isIAIntegration ? 'integration app' : 'integration'} has been successfully cloned to your ${sandbox ? 'Sandbox' : 'Production'} environment. Switch back to your ${!sandbox ? 'Sandbox' : 'Production'} environment?`,
            buttons: [
              {
                label: `Yes, switch to ${!sandbox ? 'Sandbox' : 'Production'}`,
                onClick: () => {
                  props.history.push(getRoutePath('/'));
                },
              },
              {
                label: `No, stay in ${sandbox ? 'Sandbox' : 'Production'}`,
                variant: 'text',
                onClick: () => {
                  dispatch(actions.user.preferences.update({ environment: sandbox ? 'sandbox' : 'production' }));
                  props.history.push(
                    getRoutePath(
                      `${resourceType === 'integrations' ? '' : '/clone'}/${resourceType}/${integrationId}/setup`
                    )
                  );
                },
              },
            ],
          });
        } else {
          props.history.push(
            getRoutePath(
              `${resourceType === 'integrations' ? '' : '/clone'}/${resourceType}/${integrationId}/setup`
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
    resourceType,
  ]);

  // fetches the latest preview components on every mount
  useEffect(() => {
    dispatch(actions.clone.requestPreview(resourceType, resourceId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          props.history.push(getRoutePath(HOME_PAGE_PATH));
        }
      } else {
        props.history.push(getRoutePath(`/${resourceType}`));
      }
    }
  }, [createdComponents, dispatch, props.history, resourceId, resourceType]);

  const { objects = [] } = components || {};

  const fieldMeta = {
    fieldMap: {
      name: {
        id: 'name',
        name: 'name',
        type: 'text',
        required: !isIAIntegration,
        label: 'Name',
        helpKey: `${RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}.name`,
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
        type: 'previewcomponentstable',
        data: objects.map((obj, index) => ({
          ...obj,
          _id: index,
        })),
        resourceType,
        useColumns,
      },
    },
    layout: {
      fields: [],
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
              .concat([{ label: 'Standalone flows', value: 'none' }]),
          },
        ];
      }

      return null;
    },
  };

  if (resourceType === 'flows') {
    fieldMeta.fieldMap.integration = {
      id: 'integration',
      name: 'integration',
      type: 'select',
      label: 'Integration',
      required: true,
      defaultValue: '',
      refreshOptionsOnChangesTo: ['environment'],
      options: [
        {
          items: integrations
            .filter(
              i => !!i.sandbox === (preferences.environment === 'sandbox')
            )
            .map(i => ({ label: i.name, value: i._id }))
            .concat([{ label: 'Standalone flows', value: 'none' }]),
        },
      ],
    };
    fieldMeta.fieldMap.flowGroup = {
      id: 'flowGroup',
      name: 'flowGroup',
      type: 'flowgroupstiedtointegrations',
      label: 'Flow group',
      refreshOptionsOnChangesTo: ['environment', 'integration'],
      defaultValue: UNASSIGNED_SECTION_ID,
      visibleWhen: [
        {
          field: 'integration',
          isNot: [''],
        },
      ],
    };
    fieldMeta.layout.fields = [
      'name',
      'environment',
      'integration',
      'flowGroup',
      'description',
      'message',
      'components',
    ];
  } else if (isIAIntegration) {
    fieldMeta.fieldMap.tag = {
      id: 'tag',
      name: 'tag',
      type: 'text',
      label: 'Tag',
    };
    fieldMeta.layout.fields = [
      'name',
      'tag',
      'environment',
      'description',
      'message',
      'components',
    ];
  } else {
    fieldMeta.layout.fields = [
      'name',
      'environment',
      'description',
      'message',
      'components',
    ];
  }
  const formKey = useFormInitWithPermissions({
    fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
    remount: remountKey,
  });

  if (!components || isEmpty(components)) {
    return (
      <Loader open>
        <Typography variant="h4">Loading</Typography>
        <Spinner />
      </Loader>
    );
  }

  const clone = ({ name, environment, integration, flowGroup, tag }) => {
    const { installSteps, connectionMap } =
      templateUtil.getInstallSteps(components) || {};
    const _flowGroupingId = flowGroup && flowGroup !== UNASSIGNED_SECTION_ID ? flowGroup : null;

    if (resourceType === 'integrations') {
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
            _flowGroupingId,
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
            _flowGroupingId,
          }
        )
      );
      dispatch(actions.clone.createComponents(resourceType, resourceId));
    }
  };

  if (cloneRequested) {
    return (
      <Loader open>
        <Typography variant="h4">Loading</Typography>
        <Spinner />
      </Loader>
    );
  }

  return (
    <LoadResources resources="integrations" required>
      <CeligoPageBar title={`Clone ${MODEL_PLURAL_TO_LABEL[resourceType].toLowerCase()}`} infoText={message.INTEGRATION.CLONE_DESCRIPTION} />
      <PageContent>
        <div className={classes.componentPadding}>
          <DynaForm
            formKey={formKey} />
          <DynaSubmit
            formKey={formKey}
            ignoreFormTouchedCheck
            disabled={cloneRequested}
            data-test="clone"
            onClick={clone}>
            {`Clone ${MODEL_PLURAL_TO_LABEL[resourceType].toLowerCase()}`}
          </DynaSubmit>
        </div>
      </PageContent>
    </LoadResources>
  );
}

