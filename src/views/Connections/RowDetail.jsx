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
  const handleConfigureDebugger = () => {};
  const handleDownLoadDebug = () => {};
  const handleDeleteClick = () => {
    confirmDialog({
      title: 'Confirm',
      message: 'Are you sure you want to delete this Connection?',
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            dispatch(actions.resource.delete('connections', `${item._id}`));
          },
        },
      ],
    });
  };

  return (
    <Fragment>
      {item.description && <div>{item.description}</div>}
      <Typography className={classes.exportDetails}>
        Created on {new Date(item.lastModified).toLocaleDateString()}
        <br />
      </Typography>
      <Typography className={classes.secondaryHeading}>
        <Button component={Link} to={`/pg/connections/edit/${item._id}`}>
          Edit Connection
        </Button>
        <br />
        <Button onClick={handleDownLoadDebug}>Download debug logs</Button>
        <br />
        <Button onClick={handleConfigureDebugger}>Configure debugger</Button>
        <br />
        <Button
          onClick={() =>
            dispatch(
              actions.resource.requestReferences('connections', `${item._id}`)
            )
          }>
          View references
        </Button>
        <br />
        <Button onClick={handleDeleteClick}>Delete connection</Button>
      </Typography>
    </Fragment>
  );
}

export default withStyles(styles)(ConnectionsData);
