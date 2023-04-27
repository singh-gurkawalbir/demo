/* eslint-disable react/state-in-constructor */
/* eslint-disable react/no-unused-state */
import React from 'react';
import { Typography } from '@mui/material';
import LogRocket from 'logrocket';
import ModalDialog from '../../components/ModalDialog';
import getRoutePath from '../../utils/routePaths';
import { FilledButton } from '../../components/Buttons';
import RawHtml from '../../components/RawHtml';
import {message} from '../../utils/messageStore';

export default class CrashReporter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crashed: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      crashed: true,
    };
  }

  componentDidCatch(error) {
    LogRocket.captureException(error);
  }

  render() {
    if (this.state.crashed) {
      return (
        <ModalDialog show>
          <>
            <span>Application errored</span>
          </>
          <Typography>
            <RawHtml html={message.APP_CRASH} />
          </Typography>
          <FilledButton
            data-test="reload"
            onClick={() => {
              this.state.crashed = false;
              window.location.replace(getRoutePath(''));
            }}>
            Reload
          </FilledButton>
        </ModalDialog>
      );
    }

    return this.props.children;
  }
}
