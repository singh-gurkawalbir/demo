// import { hot } from 'react-hot-loader';
import { Fragment } from 'react';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { confirmDialog } from '../../components/ConfirmDialog';
import actions from '../../actions';

const styles = theme => ({
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
  },
  link: {
    color: theme.palette.text.secondary,
    // color: theme.palette.action.active,
  },
  exportDetails: {
    flexBasis: '66.66%',
    flexShrink: 0,
  },
});

function ConnectionsData(props) {
  const { classes, item } = props;
  const dispatch = useDispatch();
  const handleActionClick = (action, id) => {
    switch (action) {
      case 'delete':
        confirmDialog({
          title: 'Confirm',
          message: 'Are you sure you want to delete this Agent?',
          buttons: [
            {
              label: 'Cancel',
            },
            {
              label: 'Yes',
              onClick: () => {
                dispatch(actions.resource.delete('connections', id));
              },
            },
          ],
        });
        break;
      case 'viewReferences':
        dispatch(actions.resource.requestReferences('connections', id));
        break;
      case 'downloadDebugLogs':
        break;
      case 'configureDebugger':
        break;
      default:
        break;
    }
  };

  return (
    <Fragment>
      {item.description && <div>{item.description}</div>}
      <Typography className={classes.exportDetails}>
        Created on {new Date(item.lastModified).toLocaleDateString()}
        <br />
        {/* {item.connection && (
            <Fragment>
              Using a {item.connection.type} connection named:
              {item.connection.name || item.connection._id}
            </Fragment>
          )} */}
      </Typography>
      <Typography className={classes.secondaryHeading}>
        <Button
          component={Link}
          // className={classes.link}
          to={`/pg/resources/connections/edit/${item._id}`}>
          Edit Connection
        </Button>
        <br />
        {/* <Link
          className={classes.link}
          to={`/pg/resources/connections/edit/${item._id}`}>
          Share connection
        </Link>
        <br />
        <Link
          className={classes.link}
          to={`/pg/resources/connections/edit/${item._id}`}>
          Refresh metadata
        </Link>
        <br />
        <Link
          className={classes.link}
          to={`/pg/resources/connections/edit/${item._id}`}>
          Download debug logs
        </Link>
        <br />
        <Link
          className={classes.link}
          to={`/pg/resources/connections/edit/${item._id}`}>
          Configure debugger
        </Link>
        <br />
        <Link className={classes.link} to="/pg/connections/clone">
          (View audit log
        </Link>
        <br /> */}
        <Button
          onClick={() => handleActionClick('downloadDebugLogs', `${item._id}`)}>
          Download debug logs
        </Button>
        <br />
        <Button
          onClick={() => handleActionClick('configureDebugger', `${item._id}`)}>
          Configure debugger
        </Button>
        <br />
        <Button
          onClick={() => handleActionClick('viewReferences', `${item._id}`)}>
          View references
        </Button>
        <br />
        <Button onClick={() => handleActionClick('delete', `${item._id}`)}>
          Delete connection
        </Button>
      </Typography>
    </Fragment>
  );
}

export default withStyles(styles)(ConnectionsData);
