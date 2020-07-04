/* eslint-disable react/state-in-constructor */
/* eslint-disable react/no-unused-state */
import React from 'react';
import { Typography, Button } from '@material-ui/core';
import ModalDialog from '../../components/ModalDialog';
import reportCrash from '../../utils/crash';

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

  componentDidCatch(error, errorInfo) {
    const err = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo
    };
    reportCrash(err);
  }

  render() {
    if (this.state.crashed) {
      return (
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
              this.state.crashed = false;
              window.location.replace('/pg');
            }}>
            Reload
          </Button>
        </ModalDialog>);
    }

    return this.props.children;
  }
}
