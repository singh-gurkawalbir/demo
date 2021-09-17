import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../reducers';
import LoadResources from '../../../components/LoadResources';
import ResourceTable from '../../../components/ResourceTable';
import Invite from './Invite';
import AddIcon from '../../../components/icons/AddIcon';
import PanelHeader from '../../../components/PanelHeader';
import { TextButton } from '../../../components/Buttons';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    minHeight: 124,
  },
  heading: {
    paddingLeft: theme.spacing(1),
  },
  transferTableWrapper: {
    overflowX: 'auto',
  },
  description: {
    marginTop: theme.spacing(1),
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
              <PanelHeader title="Transfers" >
                <TextButton
                  data-test="newTransfer"
                  startIcon={<AddIcon />}
                  onClick={handleNewTransferClick}>
                  Create transfer
                </TextButton>
              </PanelHeader>

              <ResourceTable
                resourceType="transfers"
                resources={transfers}
                className={classes.transferTableWrapper}
            />
            </div>
            <div className={classes.description}>
              Transfer individual integrations between integrator.io accounts.
              Send integrations by specifying the email of the owner
              of the integrator.io account you want to send the integration to.
              The receiving account owner needs to accept the transfer. Once
              accepted, the integration will be removed from your account and
              instead reside in the receiver’s account. Note: the receiver needs
              to be an account owner and cannot be part of the same organization
              as the sender.
            </div>
          </>
        )}
        {showInviteView && <Invite setShowInviteView={setShowInviteView} />}
      </LoadResources>
    </>
  );
}

