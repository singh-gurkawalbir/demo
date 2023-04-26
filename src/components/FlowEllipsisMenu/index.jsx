import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IconButton, MenuItem } from '@mui/material';
import { ArrowPopper } from '@celigo/fuse-ui';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import actions from '../../actions';
import { selectors } from '../../reducers';
import useConfirmDialog from '../ConfirmDialog';
import AuditLogDialog from '../AuditLog/AuditLogDialog';
import ReferencesDialog from '../ResourceReferences';
import MappingIcon from '../icons/MapDataIcon';
import EllipsisIcon from '../icons/EllipsisHorizontalIcon';
import DownloadIcon from '../icons/DownloadIcon';
import TrashIcon from '../icons/TrashIcon';
import CloneIcon from '../icons/CopyIcon';
import AuditIcon from '../icons/AuditLogIcon';
import RefIcon from '../icons/ViewReferencesIcon';
import DetachIcon from '../icons/unLinkedIcon';
import CalendarIcon from '../icons/CalendarIcon';
import { getIntegrationAppUrlName } from '../../utils/integrationApps';
import { getTemplateUrlName } from '../../utils/template';
import getRoutePath from '../../utils/routePaths';
import { buildDrawerUrl, drawerPaths } from '../../utils/rightDrawer';
import { isNewId } from '../../utils/resource';
import { message } from '../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  wrapper: {
    '& > .MuiMenu-paper': {
      marginLeft: theme.spacing(-2),
    },
  },
  deleteWrapper: {
    color: theme.palette.error.dark,
  },
}));
const allActions = {
  detach: { action: 'detach', label: 'Detach flow', Icon: DetachIcon },
  schedule: { action: 'schedule', label: 'Schedule', Icon: CalendarIcon },
  mapping: { action: 'mapping', label: 'Edit mapping', Icon: MappingIcon },
  audit: { action: 'audit', label: 'View audit log', Icon: AuditIcon },
  references: { action: 'references', label: 'Used by', Icon: RefIcon },
  download: { action: 'download', label: 'Download flow', Icon: DownloadIcon },
  clone: { action: 'clone', label: 'Clone flow', Icon: CloneIcon },
  delete: { action: 'delete', label: 'Delete flow', Icon: TrashIcon },
};

const emptyObject = {};

export default function FlowEllipsisMenu({ flowId, exclude }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const flowDetails =
    useSelector(state => selectors.flowDetails(state, flowId), shallowEqual) || emptyObject;
  const patchFlow = useCallback(
    (path, value) => {
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchAndCommitStaged('flows', flowId, patchSet));
    },
    [dispatch, flowId]
  );
  const { confirmDialog } = useConfirmDialog();

  const integrationId = flowDetails._integrationId;
  const permission = useSelector(state =>
    selectors.resourcePermissions(state, 'integrations', integrationId, 'flows'),
  shallowEqual
  );
  const integrationAppName = useSelector(state => {
    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    if (integration && integration._connectorId && integration.name) {
      return getIntegrationAppUrlName(integration.name);
    }

    return null;
  });
  const templateName = useSelector(state => {
    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    if (integration && integration._templateId) {
      const template = selectors.resource(
        state,
        'marketplacetemplates',
        integration._templateId
      );

      if (template) return getTemplateUrlName(template.applications);
    }

    return null;
  });
  const [showAudit, setShowAudit] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);

  const deleteFlow = useCallback(() => {
    dispatch(actions.resource.delete('flows', flowId));
    // TODO: If this is re-used for IA flows, this route
    // would not be the same if flow._connectorId had a value.
    // Also note we want to replace vs push because a user may be
    // sitting on a page with the deleted flowId in the url.
    // we do not want a browser history to contain the deleted flow id.
    history.replace(getRoutePath(`/integrations/${integrationId || 'none'}`));
  }, [dispatch, history, integrationId, flowId]);

  const detachFlow = useCallback(() => {
    patchFlow('/_integrationId', undefined);
  }, [patchFlow]);
  const handleActionClick = useCallback(
    action => () => {
      switch (action) {
        case 'detach':
          confirmDialog({
            title: 'Confirm detach',
            message: message.FLOWS.DETACH,
            buttons: [
              {
                label: 'Detach',
                onClick: detachFlow,
              },
              {
                label: 'Cancel',
                variant: 'text',
              },
            ],
          });
          break;

        case 'schedule':
          // TODO @Raghu: How to reproduce these URL redirections?
          if (flowDetails._connectorId) {
            history.push(buildDrawerUrl({
              path: drawerPaths.FLOW_BUILDER.SCHEDULE,
              baseUrl: getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/flowBuilder/${flowId}`),
            }));
          } else if (templateName) {
            history.push(buildDrawerUrl({
              path: drawerPaths.FLOW_BUILDER.SCHEDULE,
              baseUrl: getRoutePath(`/templates/${templateName}/${integrationId}/flowBuilder/${flowId}`),
            }));
          } else {
            history.push(buildDrawerUrl({
              path: drawerPaths.FLOW_BUILDER.SCHEDULE,
              baseUrl: getRoutePath(`/integrations/${integrationId}/flowBuilder/${flowId}`),
            }));
          }

          break;

        case 'clone':
          history.push(getRoutePath(`/clone/flows/${flowId}/preview`));
          break;

        case 'delete':
          confirmDialog({
            title: 'Confirm delete',
            message: message.FLOWS.DELETE_FLOW,
            buttons: [
              {
                label: 'Delete',
                error: true,
                onClick: deleteFlow,
              },
              {
                label: 'Cancel',
                variant: 'text',
              },
            ],
          });
          break;

        case 'mapping':
          if (flowDetails.showUtilityMapping) {
            history.push(buildDrawerUrl({
              path: drawerPaths.MAPPINGS.CATEGORY_MAPPING.ROOT,
              baseUrl: history.location.pathname,
              params: { flowId, categoryId: 'commonAttributes' },
            }));
          } else {
            history.push(buildDrawerUrl({
              path: drawerPaths.MAPPINGS.IMPORT.LIST_ALL,
              baseUrl: history.location.pathname,
              params: { flowId },
            }));
          }

          break;

        case 'audit':
          setShowAudit(true);
          break;

        case 'references':
          setShowReferences(true);
          break;

        case 'download':
          // TODO: Every action method that has a resourceType and id arg should
          // specify the resource type first, then ID. We need to be consistent
          // with our action creator arguments patterns to prevent syntax errors from
          // devs expecting these common patterns. Also, this action method
          // would be better called "downloadResource".
          dispatch(actions.resource.downloadFile(flowId, 'flows'));
          break;

        default:
      }

      setAnchorEl(null);
    },
    [
      confirmDialog,
      flowDetails._connectorId,
      flowDetails.showUtilityMapping,
      history,
      integrationAppName,
      integrationId,
      flowId,
      templateName,
      dispatch,
      deleteFlow,
      detachFlow,
    ]
  );
  const open = Boolean(anchorEl);
  const actionsPopoverId = open ? 'more-row-actions' : undefined;
  let availableActions = [];

  if (!flowDetails._connectorId || flowDetails.showMapping) {
    availableActions.push(allActions.mapping);
  }

  if (flowDetails.showSchedule) availableActions.push(allActions.schedule);

  availableActions.push(allActions.audit);
  availableActions.push(allActions.references);

  availableActions.push(allActions.download);
  if (permission.clone) availableActions.push(allActions.clone);
  if (integrationId && permission.detach) {
    availableActions.push(allActions.detach);
  }
  if (permission.delete) availableActions.push(allActions.delete);

  // remove any actions that have explicitly been excluded.
  if (exclude && exclude.length) {
    availableActions = availableActions.filter(
      a => !exclude.includes(a.action)
    );
  }

  return (
    <>
      <IconButton
        data-test="openActionsMenu"
        aria-label="more"
        aria-controls={actionsPopoverId}
        aria-haspopup="true"
        disabled={isNewId(flowId)}
        size="small"
        onClick={handleMenuClick}
        sx={{padding: '3px'}}>
        <EllipsisIcon />
      </IconButton>

      <ArrowPopper
        elevation={2}
        variant="menu"
        id={actionsPopoverId}
        anchorEl={anchorEl}
        className={classes.wrapper}
        open={open}
        onClose={handleMenuClose}>
        {availableActions.map(({ action, label, Icon }) => (
          <MenuItem
            key={label}
            data-test={`${action}Flow`}
            className={clsx({[classes.deleteWrapper]: action === 'delete'})}
            onClick={handleActionClick(action)}>
            <Icon /> {label}
          </MenuItem>
        ))}
      </ArrowPopper>

      {showAudit && (
        <AuditLogDialog
          resourceType="flows"
          resourceId={flowId}
          onClose={() => setShowAudit(false)}
        />
      )}
      {showReferences && (
        <ReferencesDialog
          resourceType="flows"
          resourceId={flowId}
          onClose={() => setShowReferences(false)}
        />
      )}
    </>
  );
}
