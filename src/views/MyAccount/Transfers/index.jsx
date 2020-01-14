import { Fragment, useState } from 'react';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../reducers';
import LoadResources from '../../../components/LoadResources';
import CeligoTable from '../../../components/CeligoTable';
import metadata from './metadata';
import Invite from './Invite';
import IconTextButton from '../../../components/IconTextButton';
import AddIcon from '../../../components/icons/AddIcon';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  topHeading: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  heading: {
    paddingLeft: theme.spacing(1),
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
              <div className={classes.topHeading}>
                <Typography variant="h4" className={classes.heading}>
                  Transfers
                </Typography>
                <IconTextButton
                  data-test="newTransfer"
                  variant="text"
                  color="primary"
                  onClick={handleNewTransferClick}>
                  <AddIcon />
                  Create transfer
                </IconTextButton>
              </div>
            </div>

            {
              // TODO: Ashok we don't have description in the mock. Please verify
              /* <div>
              Transfer individual integrations between integrator.io accounts.
              accounts. Send integrations by specifying the email of the owner
              of the integrator.io account you want to send the integration to.
              The receiving account owner needs to accept the transfer. Once
              accepted, the integration will be removed from your account and
              instead reside in the receiver’s account. Note: the receiver needs
              to be an account owner and cannot be part of the same organization
              as the sender.
            </div> */
            }

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
