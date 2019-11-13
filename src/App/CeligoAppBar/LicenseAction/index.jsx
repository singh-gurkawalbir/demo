import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import * as selectors from '../../../reducers';
import CommStatus from '../../../components/CommStatus';
import { COMM_STATES } from '../../../reducers/comms';

const mapStateToProps = state => ({
  license: selectors.integratorLicense(state),
  permissions: selectors.userPermissions(state),
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
    marginBottom: theme.spacing(0.5),
  },
  expiresSoon: {
    backgroundColor: theme.palette.primary.main,
  },
}))
class LicenseAction extends Component {
  state = {};

  commStatusHandler(objStatus) {
    const { enqueueSnackbar } = this.props;

    ['startTrial', 'upgrade'].forEach(a => {
      if (
        objStatus[a] &&
        [COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(objStatus[a].status)
      ) {
        let message;

        if (objStatus[a].status === COMM_STATES.ERROR) {
          ({ message } = objStatus[a]);
        } else if (a === 'startTrial') {
          if (objStatus[a].status === COMM_STATES.SUCCESS) {
            message = 'Activated! Your 30 days of unlimited flows starts now.';
          }
        } else if (a === 'upgrade') {
          if (objStatus[a].status === COMM_STATES.SUCCESS) {
            message =
              'Your request has been received. We will contact you soon.';
          }
        }

        enqueueSnackbar(message, {
          variant: objStatus[a].status,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          action: key => (
            <IconButton
              data-test="closeLicenseSnackbar"
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => {
                this.props.closeSnackbar(key);
              }}>
              <CloseIcon />
            </IconButton>
          ),
        });
      }
    });
  }

  render() {
    const { classes, license, permissions, onClick } = this.props;

    if (!permissions.subscriptions.requestUpgrade) {
      return null;
    }

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
          {!license.upgradeRequested && (
            <Fragment>
              <CommStatus
                actionsToMonitor={{
                  startTrial: {
                    action: actionTypes.LICENSE_TRIAL_REQUEST,
                  },
                  upgrade: { action: actionTypes.LICENSE_UPGRADE_REQUEST },
                }}
                autoClearOnComplete
                commStatusHandler={objStatus => {
                  this.commStatusHandler(objStatus);
                }}
              />
              <Button
                data-test={buttonProps.label}
                className={buttonProps.className}
                variant="contained"
                color="secondary"
                onClick={() => {
                  onClick(buttonProps.action);
                }}>
                {buttonProps.label}
              </Button>
            </Fragment>
          )}
        </Fragment>
      );
    }

    return null;
  }
}

// prettier-ignore
export default withSnackbar(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LicenseAction)
);
