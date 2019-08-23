import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import actions from '../../actions';
import { confirmDialog } from '../../components/ConfirmDialog';

const styles = theme => ({
  deleteIcon: {
    margin: theme.spacing(1),
    fontSize: 32,
  },
});

function ShareStackUserDetail(props) {
  const { classes, user } = props;
  const dispatch = useDispatch();
  const handleDeleteUserClick = () => {
    confirmDialog({
      title: 'Confirm',
      message: 'Are you sure you want to remove this sharing?',
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            dispatch(actions.stack.deleteStackShareUser(user._id));
          },
        },
      ],
    });
  };

  const handleToggleSharingClick = () => {
    confirmDialog({
      title: 'Confirm',
      message: `Are you sure you want to ${
        user.disabled ? 'enable' : 'disable'
      } sharing?`,
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            dispatch(actions.stack.toggleUserStackSharing(user._id));
          },
        },
      ],
    });
  };

  return (
    <TableRow>
      <TableCell>
        {user.sharedWithUser && (
          <Fragment>
            <Typography>{user.sharedWithUser.name}</Typography>
            <Typography>{user.sharedWithUser.email}</Typography>
          </Fragment>
        )}
      </TableCell>
      <TableCell>{user.accepted ? 'Accepted' : 'Pending'}</TableCell>
      <TableCell>
        {user.accepted && (
          <Switch
            checked={!user.disabled}
            onChange={handleToggleSharingClick}
          />
        )}
      </TableCell>
      <TableCell>
        <DeleteIcon
          className={classes.deleteIcon}
          onClick={handleDeleteUserClick}
        />
      </TableCell>
    </TableRow>
  );
}

export default withStyles(styles)(ShareStackUserDetail);
