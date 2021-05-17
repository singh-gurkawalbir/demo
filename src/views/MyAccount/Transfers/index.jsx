import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../reducers';
import LoadResources from '../../../components/LoadResources';
import ResourceTable from '../../../components/ResourceTable';
import Invite from './Invite';
import IconTextButton from '../../../components/IconTextButton';
import AddIcon from '../../../components/icons/AddIcon';
import PanelHeader from '../../../components/PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
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
  transferTableWrapper: {
    overflowX: 'auto',
  },
}));

export default function Transfers() {
  const classes = useStyles();
  const transfers = useSelector(
    state =>
      selectors.transferListWithMetadata(state, { type: 'transfers' })
  );

  const [showInviteView, setShowInviteView] = useState(false);
  const handleNewTransferClick = () => {
    setShowInviteView(true);
  };

  return (
    <>
      <LoadResources resources="transfers,integrations">
        {!showInviteView && (
          <>
            <div className={classes.root}>
              <div className={classes.topHeading}>
                <PanelHeader title="Transfers" />
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

            <div>
              Transfer individual integrations between integrator.io accounts.
              Send integrations by specifying the email of the owner
              of the integrator.io account you want to send the integration to.
              The receiving account owner needs to accept the transfer. Once
              accepted, the integration will be removed from your account and
              instead reside in the receiver’s account. Note: the receiver needs
              to be an account owner and cannot be part of the same organization
              as the sender.
            </div>

            <ResourceTable
              resourceType="transfers"
              resources={transfers}
              className={classes.transferTableWrapper}
            />
          </>
        )}
        {showInviteView && <Invite setShowInviteView={setShowInviteView} />}
      </LoadResources>
    </>
  );
}
