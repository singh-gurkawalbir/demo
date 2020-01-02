import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import LoadResources from '../../../components/LoadResources';
import CeligoTable from '../../../components/CeligoTable';
import metadata from './metadata';
import Invite from './Invite';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  transferButton: {
    margin: theme.spacing(1),
    textAlign: 'center',
    float: 'right',
  },
}));

export default function Transfers() {
  const classes = useStyles();
  const transfers = useSelector(
    state =>
      selectors.transferListWithMetadata(state, { type: 'transfers' }).resources
  );
  const [showInviteView, setShowInviteView] = useState(false);
  const handleNewTransferClick = () => {
    setShowInviteView(true);
  };

  return (
    <Fragment>
      <LoadResources required resources="transfers,integrations">
        {!showInviteView && (
          <Fragment>
            <div className={classes.root}>
              <Fragment>
                <Button
                  data-test="newTransfer"
                  className={classes.transferButton}
                  variant="contained"
                  color="secondary"
                  onClick={handleNewTransferClick}>
                  New Transfer
                </Button>
              </Fragment>
            </div>
            <div>
              Transfer individual integrations between integrator.io accounts.
              accounts. Send integrations by specifying the email of the owner
              of the integrator.io account you want to send the integration to.
              The receiving account owner needs to accept the transfer. Once
              accepted, the integration will be removed from your account and
              instead reside in the receiver’s account. Note: the receiver needs
              to be an account owner and cannot be part of the same organization
              as the sender.
            </div>

            <CeligoTable
              resourceType="transfers"
              data={transfers}
              {...metadata}
            />
          </Fragment>
        )}
        {showInviteView && <Invite setShowInviteView={setShowInviteView} />}
      </LoadResources>
    </Fragment>
  );
}
