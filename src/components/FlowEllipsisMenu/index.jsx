import { useCallback, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import actions from '../../actions';
import * as selectors from '../../reducers';
import { defaultConfirmDialog } from '../ConfirmDialog';
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

const allActions = {
  detach: { action: 'detach', label: 'Detach flow', Icon: DetachIcon },
  clone: { action: 'clone', label: 'Clone flow', Icon: CloneIcon },
  schedule: { action: 'schedule', label: 'Schedule', Icon: CalendarIcon },
  mapping: { action: 'mapping', label: 'Edit mapping', Icon: MappingIcon },
  audit: { action: 'audit', label: 'View audit log', Icon: AuditIcon },
  references: { action: 'references', label: 'View references', Icon: RefIcon },
  download: { action: 'download', label: 'Download flow', Icon: DownloadIcon },
  delete: { action: 'delete', label: 'Delete', Icon: TrashIcon },
};

export default function FlowEllipsisMenu({ flowId, exclude }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const flowDetails =
    useSelector(state => selectors.flowDetails(state, flowId)) || {};
  const patchFlow = useCallback(
    (path, value) => {
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', flowId, 'value'));
    },
    [dispatch, flowId]
  );
  const integrationId = flowDetails._integrationId;
  const [showAudit, setShowAudit] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const flowName = flowDetails.name || flowDetails._Id;
  const handleActionClick = useCallback(
    action => () => {
      switch (action) {
        case 'detach':
          defaultConfirmDialog(
            `detach ${flowName} from this integration?`,
            () => {
              patchFlow('/_integrationId', undefined);
            }
          );
          break;

        case 'schedule':
          flowDetails._connectorId
            ? history.push(
                `/pg/integrationApp/${integrationId}/flowBuilder/${flowId}/schedule`
              )
            : history.push(
                `/pg/integrations/${integrationId}/flowBuilder/${flowId}/schedule`
              );
          break;

        case 'clone':
          history.push(`/pg/clone/flows/${flowId}/preview`);
          break;

        case 'delete':
          defaultConfirmDialog(
            'Are you sure you want to delete this flow?',
            () => {
              dispatch(actions.resource.delete('flows', flowId));
              // TODO: If this is re-used for IA flows, this route
              // would not be the same if flow._connectorId had a value.
              // Also note we want to replace vs push because a user may be
              // sitting on a page with the deleted flowId in the url.
              // we do not want a browser history to contain the deleted flow id.
              history.replace(`/pg/integrations/${integrationId || 'none'}`);
            }
          );
          break;

        case 'mapping':
          history.push(`${history.location.pathname}/${flowId}/mapping`);
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
      flowName,
      flowDetails._connectorId,
      history,
      integrationId,
      flowId,
      dispatch,
      patchFlow,
    ]
  );
  const open = Boolean(anchorEl);
  const actionsPopoverId = open ? 'more-row-actions' : undefined;
  let availableActions = [];

  // TODO: we need to add logic to properly determine which of the
  // below actions should be made available for this flow.
  if (integrationId) availableActions.push(allActions.detach);

  // TODO: the showMapping prop is hardcoded to always return true. Logic needs
  // to be added in the data-layer to properly determine this flag.
  if (flowDetails.showMapping) availableActions.push(allActions.mapping);

  if (flowDetails.canSchedule) availableActions.push(allActions.schedule);

  availableActions.push(allActions.audit);
  availableActions.push(allActions.references);
  availableActions.push(allActions.clone);
  availableActions.push(allActions.download);
  availableActions.push(allActions.delete);

  // remove any actions that have explicitly been excluded.
  if (exclude && exclude.length) {
    availableActions = availableActions.filter(
      a => !exclude.includes(a.action)
    );
  }

  return (
    <Fragment>
      <IconButton
        data-test="openActionsMenu"
        aria-label="more"
        aria-controls={actionsPopoverId}
        aria-haspopup="true"
        size="small"
        onClick={handleMenuClick}>
        <EllipsisIcon />
      </IconButton>

      <Menu
        elevation={2}
        variant="menu"
        id={actionsPopoverId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}>
        {availableActions.map(({ action, label, Icon }) => (
          <MenuItem
            key={label}
            data-test={`${action}Flow`}
            onClick={handleActionClick(action)}>
            <Icon /> {label}
          </MenuItem>
        ))}
      </Menu>

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
    </Fragment>
  );
}
