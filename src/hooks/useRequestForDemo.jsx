import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilledButton } from '@celigo/fuse-ui';
import actions from '../actions';
import ModalDialog from '../components/ModalDialog';
import { message } from '../utils/messageStore';
import { selectors } from '../reducers';

const useStyles = makeStyles(theme => ({
  link: {
    paddingLeft: theme.spacing(0.5),
  },
}));

const ModalWrapper = ({setShowMessage}) => {
  const classes = useStyles();

  return (
    <ModalDialog show onClose={() => setShowMessage(false)}>
      <>Thanks for your request!</>
      <>
        {message.SUBSCRIPTION.CONTACT_SALES_MESSAGE}
        <a
          href="http://www.celigo.com/integration-marketplace"
          rel="noopener noreferrer"
          target="_blank"
          className={classes.link}>
          check out our Marketplace.
        </a>
      </>
      <FilledButton data-test="requestForDemo" onClick={() => setShowMessage(false)}>
        Close
      </FilledButton>
    </ModalDialog>
  );
};
export default function useRequestForDemo() {
  const dispatch = useDispatch();
  const [showMessage, setShowMessage] = useState(false);
  const accessLevel = useSelector(
    state => selectors.resourcePermissions(state).accessLevel
  );
  const requestDemo = useCallback(connector => {
    dispatch(actions.marketplace.contactSales(connector.name, connector._id));
    if (accessLevel !== 'monitor') {
      setShowMessage(true);
    }
  }, [accessLevel, dispatch]);
  const RequestDemoDialog = useMemo(() => () => showMessage ? (
    <ModalWrapper setShowMessage={setShowMessage} />
  )
    : null, [showMessage]);

  return {RequestDemoDialog, requestDemo };
}
