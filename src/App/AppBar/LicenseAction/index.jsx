import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Notifier, { openSnackbar } from '../../../components/Notifier';

const mapStateToProps = state => ({
  license: selectors.integratorLicense(state),
});
const mapDispatchToProps = dispatch => ({
  onClick: action => {
    switch (action) {
      case 'startTrial':
        return dispatch(actions.user.org.accounts.requestTrialLicense());
      case 'upgrade':
        return dispatch(actions.user.org.accounts.requestLicenseUpgrade());
      default:
        return null;
    }
  },
});

@withStyles(theme => ({
  inTrial: {
    backgroundColor: theme.palette.secondary.light,
  },
  expiresSoon: {
    backgroundColor: theme.palette.primary.main,
  },
}))
class LicenseAction extends Component {
  state = {};

  componentDidUpdate(prevProps) {
    const { license } = this.props;
    const prevLicense = (prevProps && prevProps.license) || {};

    if (license && license.trialStarted && !prevLicense.trialStarted) {
      openSnackbar({
        message: 'Activated! Your 30 days of unlimited flows starts now.',
      });
    }

    if (
      license &&
      license.upgradeRequested &&
      prevLicense.upgradeRequested !== license.upgradeRequested
    ) {
      openSnackbar({
        message: 'Your request has been received. We will contact you soon.',
        variant: 'success',
      });
    }
  }

  render() {
    const { classes, license, onClick } = this.props;

    if (!license) {
      return null;
    }

    const buttonProps = {
      className: classes.inTrial,
    };

    if (license.tier === 'none') {
      if (!license.trialEndDate) {
        buttonProps.action = 'startTrial';
        buttonProps.label = 'GO UNLIMITED FOR 30 DAYS';
      }
    } else if (license.tier === 'free') {
      if (license.status === 'TRIAL_EXPIRED') {
        buttonProps.action = 'upgrade';
        buttonProps.label = 'UPGRADE NOW';
      } else if (license.status === 'IN_TRIAL') {
        if (license.expiresInDays < 1) {
          buttonProps.action = 'upgrade';
          buttonProps.label = 'UPGRADE NOW';
        } else {
          buttonProps.action = 'upgrade';
          buttonProps.label = `${license.expiresInDays} DAYS LEFT UPGRADE NOW`;

          if (license.expiresInDays < 10) {
            buttonProps.className = classes.expiresSoon;
          }
        }
      }
    }

    if (buttonProps.action) {
      return (
        <Fragment>
          <Notifier />
          {!license.upgradeRequested && (
            <Button
              className={buttonProps.className}
              variant="contained"
              color="secondary"
              onClick={() => {
                onClick(buttonProps.action);
              }}>
              {buttonProps.label}
            </Button>
          )}
        </Fragment>
      );
    }

    return null;
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(LicenseAction);
