import { useCallback, Fragment, useState } from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '../../icons/RefreshIcon';
import AuditLogIcon from '../../icons/AuditLogIcon';
import ViewReferencesIcon from '../../icons/ViewReferencesIcon';
import TrashIcon from '../../icons/TrashIcon';
import EllipsisIcon from '../../icons/EllipsisHorizontalIcon';

const useStyles = makeStyles(theme => ({
  wrapper: {
    '& > .MuiMenu-paper': {
      marginLeft: theme.spacing(-2),
    },
  },
}));
const allActions = [
  { action: 'refresh', label: 'Refresh', Icon: RefreshIcon },
  { action: 'auditLog', label: 'View Audit Dialog', Icon: AuditLogIcon },
  {
    action: 'references',
    label: 'View References',
    Icon: ViewReferencesIcon,
  },
  { action: 'delete', label: 'Delete', Icon: TrashIcon },
];

export default function ConnectionEllipsisMenu({ connectionId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleActionClick = useCallback(
    action => () => {
      switch (action) {
        case 'refresh':
          break;

        case 'auditLog':
          history.push(`${match.url}/${connectionId}/auditLog`);
          break;

        case 'references':
          break;

        case 'delete':
          break;

        default:
      }
    },
    [connectionId, history, match.url]
  );
  const handleMenuClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const open = Boolean(anchorEl);
  const actionsPopoverId = open ? 'row-actions' : undefined;

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
        className={classes.wrapper}
        open={open}
        onClose={handleMenuClose}>
        {allActions.map(({ action, label, Icon }) => (
          <MenuItem
            key={label}
            data-test={`${action}Connection`}
            onClick={handleActionClick(action)}>
            <Icon /> {label}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
}
