import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { confirmDialog } from '../../components/ConfirmDialog';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';
import * as selectors from '../../reducers';

const styles = theme => ({
  stackActions: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
  },
  stackDetails: {
    flexBasis: '66.66%',
    flexShrink: 0,
  },
});

function StacksData(props) {
  const { classes, item, onReferencesClick } = props;
  const isServerStack = item.type === 'server';
  const dispatch = useDispatch();
  const handleAuditLogClick = () => {};
  const handleShareStackClick = () => {};
  const handleDeleteClick = () => {
    confirmDialog({
      title: 'Confirm',
      message: 'Are you sure you want to delete this Stack?',
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            dispatch(actions.resource.delete('stacks', item._id));
          },
        },
      ],
    });
  };

  const stackSystemToken = useSelector(state =>
    selectors.stackSystemToken(state, item._id)
  );
  const displaySystemToken = () => {
    dispatch(actions.stack.displayToken(item._id));
  };

  const changeSystemToken = () => {
    dispatch(actions.stack.generateToken(item._id));
  };

  const { systemToken } = stackSystemToken;

  return (
    <Fragment>
      <Typography className={classes.stackDetails}>
        Type: {item.type}
        <br />
        {isServerStack && item.server && (
          <Fragment>
            Host: {item.server.hostURI}
            <br />
            <Fragment>
              {'System Token: '}
              {systemToken && (
                <Fragment>
                  <Typography> {systemToken}</Typography>
                  <Button onClick={changeSystemToken}>
                    Click to generate new token
                  </Button>
                </Fragment>
              )}
              {!systemToken && (
                <Button onClick={displaySystemToken}>Click to Display</Button>
              )}
            </Fragment>
          </Fragment>
        )}
        {!isServerStack && item.lambda && (
          <Fragment>
            Function Name: {item.lambda.functionName}
            <br />
            Access Key Id: {item.lambda.accessKeyId}
            <br />
          </Fragment>
        )}
      </Typography>
      <Typography className={classes.stackActions}>
        <Button component={Link} to={getRoutePath(`stacks/edit/${item._id}`)}>
          Edit Stack
        </Button>
        <br />
        <Button onClick={handleShareStackClick}>Share Stack</Button>
        <br />
        <Button onClick={handleAuditLogClick}>View audit log</Button>
        <br />
        <Button onClick={() => onReferencesClick(item._id)}>
          View references
        </Button>
        <br />
        <Button onClick={handleDeleteClick}>Delete stack</Button>
      </Typography>
    </Fragment>
  );
}

export default withStyles(styles)(StacksData);
