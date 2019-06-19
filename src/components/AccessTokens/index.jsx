import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import * as selectors from '../../reducers';
import actions from '../../actions';
import TokenDetail from './TokenDetail';
import TokenDialog from './TokenDialog';
import CheckPermissions from '../../components/CheckPermissions';
import { PERMISSIONS } from '../../utils/constants';
import { COMM_STATES } from '../../reducers/comms';

const mapStateToProps = (state, { integrationId }) => {
  const accessTokens = selectors.accessTokenList(state, integrationId);
  const integrations = selectors.resourceList(state, { type: 'integrations' })
    .resources;

  return {
    accessTokens,
    integrations,
  };
};

const mapDispatchToProps = dispatch => ({
  requestAccessTokens: () => {
    dispatch(actions.resource.requestCollection('accesstokens'));
  },
});

@withStyles(theme => ({
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
}))
class AccessTokens extends Component {
  state = {
    showTokenDialog: false,
    selectedTokenId: undefined,
    connectorId: undefined,
  };

  componentDidMount() {
    const { accessTokens, requestAccessTokens } = this.props;

    if (!accessTokens || accessTokens.length === 0) {
      requestAccessTokens();
    }
  }

  statusHandler({ status, message }) {
    const { enqueueSnackbar } = this.props;

    enqueueSnackbar(message, {
      variant: status,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      action: key => (
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={() => {
            this.props.closeSnackbar(key);
          }}>
          <CloseIcon />
        </IconButton>
      ),
    });
    this.setState({ showTokenDialog: false });
  }

  handleActionClick(action, tokenId) {
    const { integrations, integrationId } = this.props;
    let connectorId;

    switch (action) {
      case 'create':
        if (integrationId) {
          const integration = integrations.find(i => i._id === integrationId);

          if (integration._connectorId) {
            connectorId = integration._connectorId;
          }
        }

        this.setState({
          connectorId,
          showTokenDialog: true,
          selectedTokenId: undefined,
        });
        break;
      case 'edit':
        this.setState({
          showTokenDialog: true,
          selectedTokenId: tokenId,
        });
        break;
      default:
    }
  }
  handleTokenDialogCancelClick() {
    this.setState({ showTokenDialog: false });
  }

  render() {
    const { classes, accessTokens, integrationId } = this.props;
    const { showTokenDialog, selectedTokenId, connectorId } = this.state;

    return (
      <CheckPermissions permission={PERMISSIONS.accesstokens.view}>
        <Fragment>
          {showTokenDialog && (
            <TokenDialog
              id={selectedTokenId}
              integrationId={integrationId}
              connectorId={connectorId}
              onCancelClick={() => {
                this.handleTokenDialogCancelClick();
              }}
              successHandler={message => {
                this.statusHandler({ status: COMM_STATES.SUCCESS, message });
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
                  this.handleActionClick('create');
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
                  <TokenDetail
                    key={at._id}
                    accessToken={at}
                    integrationId={integrationId}
                    editClickHandler={userId => {
                      this.handleActionClick('edit', userId);
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </Fragment>
      </CheckPermissions>
    );
  }
}

export default withSnackbar(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AccessTokens)
);
