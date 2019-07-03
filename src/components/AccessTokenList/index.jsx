import { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import * as selectors from '../../reducers';
import actions from '../../actions';
import AccessTokenDetail from './AccessTokenDetail';
import AccessTokenDialog from './AccessTokenDialog';
import { COMM_STATES } from '../../reducers/comms';

const styles = theme => ({
  root: {
    width: '98%',
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    overflowX: 'auto',
  },
  title: {
    marginBottom: theme.spacing.unit * 2,
    float: 'left',
  },
  createAPITokenButton: {
    margin: theme.spacing.unit,
    textAlign: 'center',
    float: 'right',
  },
  table: {
    minWidth: 700,
  },
});

function AccessTokenList(props) {
  const { classes, integrationId } = props;
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const dispatch = useDispatch();
  const accessTokens = useSelector(state =>
    selectors.accessTokenList(state, integrationId)
  );

  useEffect(() => {
    if (!accessTokens.length) {
      dispatch(actions.resource.requestCollection('accesstokens'));
    }
  }, [accessTokens.length, dispatch]);

  function handleActionClick(action, tokenId) {
    switch (action) {
      case 'create':
        setSelectedTokenId(null);
        setShowTokenDialog(true);
        break;
      case 'edit':
        setSelectedTokenId(tokenId);
        setShowTokenDialog(true);
        break;
      default:
    }
  }

  function handleTokenDialogCancelClick() {
    setShowTokenDialog(false);
  }

  function statusHandler({ status, message }) {
    const { enqueueSnackbar, closeSnackbar } = props;

    enqueueSnackbar(message, {
      variant: status,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      // eslint-disable-next-line react/display-name
      action: key => (
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={() => {
            closeSnackbar(key);
          }}>
          <CloseIcon />
        </IconButton>
      ),
    });
    setShowTokenDialog(false);
  }

  return (
    <Fragment>
      {showTokenDialog && (
        <AccessTokenDialog
          id={selectedTokenId}
          integrationId={integrationId}
          handleCancelClick={() => {
            handleTokenDialogCancelClick();
          }}
          successHandler={message => {
            statusHandler({ status: COMM_STATES.SUCCESS, message });
          }}
        />
      )}

      <div className={classes.root}>
        <div>
          <Typography className={classes.title} variant="h4">
            API Tokens
          </Typography>
          <Button
            className={classes.createAPITokenButton}
            variant="contained"
            color="secondary"
            onClick={() => {
              handleActionClick('create');
            }}>
            New API Token
          </Button>
        </div>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Token</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Scope</TableCell>
              <TableCell>Auto Purge</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accessTokens.map(at => (
              <AccessTokenDetail
                key={at._id}
                accessToken={at}
                editClickHandler={userId => {
                  handleActionClick('edit', userId);
                }}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </Fragment>
  );
}

export default withSnackbar(withStyles(styles)(AccessTokenList));
