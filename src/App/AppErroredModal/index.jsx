import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import ModalDialog from '../../components/ModalDialog';
import { selectors } from '../../reducers';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';
import { FilledButton } from '../../components/Buttons';
import { message } from '../../utils/messageStore';

function AppErroredModal() {
  const history = useHistory();
  const appErrored = useSelector(state => selectors.appErrored(state));
  const dispatch = useDispatch();

  return appErrored ? (
    <ModalDialog show>
      <>
        <span>Application errored</span>
      </>
      <Typography>
        {message.APP_CRASH}
      </Typography>
      <FilledButton
        data-test="reload"
        onClick={() => {
          dispatch(actions.app.clearError());
          history.replace(getRoutePath(''));
          window.location.reload();
        }}>
        Reload
      </FilledButton>
    </ModalDialog>
  ) : null;
}

export default withRouter(AppErroredModal);
