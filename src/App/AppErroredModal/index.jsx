import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
import { Typography, Button } from '@material-ui/core';
import ModalDialog from '../../components/ModalDialog';
import { selectors } from '../../reducers';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';

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
        Oops! Something caused our app to crash. <br />
        To resume working, please reload.
      </Typography>
      <Button
        data-test="reload"
        variant="contained"
        color="primary"
        onClick={() => {
          dispatch(actions.app.clearError());
          history.replace(getRoutePath(''));
          window.location.reload();
        }}>
        Reload
      </Button>
    </ModalDialog>
  ) : null;
}

export default withRouter(AppErroredModal);
