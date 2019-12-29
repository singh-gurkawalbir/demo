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
    state => selectors.resourceList(state, { type: 'transfers' }).resources
  );
  const [showInviteView, setShowInviteView] = useState(false);
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
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

            <CeligoTable
              resourceType="transfers"
              data={transfers}
              {...metadata}
              actionProps={{ preferences }}
            />
          </Fragment>
        )}
        {showInviteView && <Invite setShowInviteView={setShowInviteView} />}
      </LoadResources>
    </Fragment>
  );
}
