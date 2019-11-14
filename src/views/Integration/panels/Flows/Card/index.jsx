import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import actions from '../../../../../actions';
import * as selectors from '../../../../../reducers';
import { confirmDialog } from '../../../../../components/ConfirmDialog';
import AuditLogDialog from '../../../../../components/AuditLog/AuditLogDialog';
import ReferencesDialog from '../../../../../components/ResourceReferences';
import RunIcon from '../../../../../components/icons/RunIcon';
import EllipsisIcon from '../../../../../components/icons/EllipsisHorizontalIcon';
import DownloadIcon from '../../../../../components/icons/DownloadIcon';
import TrashIcon from '../../../../../components/icons/TrashIcon';
import CloneIcon from '../../../../../components/icons/CopyIcon';
import AuditIcon from '../../../../../components/icons/AuditLogIcon';
import ReferencesIcon from '../../../../../components/icons/ViewReferencesIcon';
import DetachIcon from '../../../../../components/icons/ConnectionsIcon';
import OnOffSwitch from '../../../../../components/SwitchToggle';
import InfoIconButton from '../InfoIconButton';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    margin: theme.spacing(1, 2),
  },
  cardContent: {
    display: 'flex',
    flexGrow: 1,
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.secondary.lightest}`,
    borderLeft: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  details: {
    flexGrow: 1,
  },
  statusBar: {
    width: 6,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  success: {
    backgroundColor: theme.palette.success.main,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
}));
const ellipseActions = [
  { action: 'detach', label: 'Detach flow', Icon: DetachIcon },
  { action: 'clone', label: 'Clone flow', Icon: CloneIcon },
  { action: 'audit', label: 'View audit log', Icon: AuditIcon },
  { action: 'references', label: 'View references', Icon: ReferencesIcon },
  { action: 'download', label: 'Download flow', Icon: DownloadIcon },
  { action: 'delete', label: 'Delete', Icon: TrashIcon },
];

function defaultConfirmDialog(message, callback) {
  confirmDialog({
    title: 'Confirm',
    message: `Are you sure you want to ${message}`,
    buttons: [{ label: 'Cancel' }, { label: 'Yes', onClick: callback }],
  });
}

export default function FlowCard({ flowId }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const flow =
    useSelector(state => selectors.resource(state, 'flows', flowId)) || {};
  const patchFlow = useCallback(
    (path, value) => {
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', flowId, 'value'));
    },
    [dispatch, flowId]
  );
  const [showAudit, setShowAudit] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const flowName = flow.name || flow._Id;
  const handleActionClick = useCallback(
    action => () => {
      switch (action) {
        case 'disable':
          defaultConfirmDialog(
            `${flow.disabled ? 'enable' : 'disable'} ${flowName}?`,
            () => {
              patchFlow('/disabled', !flow.disabled);
            }
          );
          break;

        case 'detach':
          defaultConfirmDialog(
            `detach ${flowName} from this integration?`,
            () => {
              patchFlow('/_integrationId', undefined);
            }
          );
          break;

        case 'clone':
          history.push(`/pg/clone/flow/${flowId}`);
          break;

        case 'delete':
          defaultConfirmDialog(
            'Are you sure you want to delete this flow?',
            () => dispatch(actions.resource.delete('flows', flowId))
          );
          break;

        case 'audit':
          setShowAudit(true);
          break;

        case 'references':
          setShowReferences(true);
          break;

        case 'download':
          // TODO: Every action method that has a resourceType and Id
          // specifies the resource type first, then ID. We need to be consistent
          // with our action creator arguments to prevent syntax errors from people
          // expecting type to be the first argument. Also, this action method
          // would be better called "downloadResource".
          dispatch(actions.resource.downloadFile(flowId, 'flows'));
          break;

        default:
      }

      setAnchorEl(null);
    },
    [dispatch, flow.disabled, flowId, flowName, history, patchFlow]
  );
  const { name, description, lastModified, schedule, disabled } = flow;
  // TODO: set status based on flow criteria...
  const status = 'success';
  // TODO: this property was copied from the old flow list page... i dont know what its for...
  const disableCard = false;

  // TODO: This function needs to be enhanced to handle all
  // the various cases.. realtime, scheduled, cron, not scheduled, etc...
  function getRunLabel(schedule) {
    if (schedule) {
      return `Runs every: ${schedule}`;
    }

    return 'Never Runs';
  }

  const open = Boolean(anchorEl);
  const actionsPopoverId = open ? 'more-row-actions' : undefined;

  return (
    <div className={classes.root}>
      <div className={clsx(classes.statusBar, classes[status])} />
      <div className={classes.cardContent}>
        <Grid item xs={9}>
          <Grid container alignItems="center">
            <Link to={`flowBuilder/${flowId}`}>
              <Typography color="primary" variant="h4">
                {name}
              </Typography>
            </Link>
            <InfoIconButton info={description} />
          </Grid>
          <Typography variant="caption" component="span">
            {getRunLabel(schedule)} | Last Modified{' '}
            <TimeAgo date={lastModified} />
          </Typography>
        </Grid>
        <Grid container item xs={3} justify="flex-end" alignItems="center">
          <OnOffSwitch
            disabled={disableCard}
            on={!disableCard && !disabled}
            onClick={handleActionClick('disable')}
          />
          <IconButton size="small" onClick={handleActionClick('run')}>
            <RunIcon />
          </IconButton>

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
            {ellipseActions.map(({ action, label, Icon }) => (
              <MenuItem
                key={label}
                data-test={`${action}Flow`}
                onClick={handleActionClick(action)}>
                <Icon /> {label}
              </MenuItem>
            ))}
          </Menu>
        </Grid>
      </div>

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
    </div>
  );
}
