import React, {useCallback, useState} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import ButtonGroup from '../../ButtonGroup';
import WarningIcon from '../../icons/WarningIcon';
import actions from '../../../actions';

const useStyles = makeStyles(theme => ({
  trialExpireWrapper: {
    background: theme.palette.background.default,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: 10,
    boxSizing: 'border-box',
    zIndex: 2,
    height: '100px',
  },
  content: {
    display: 'flex',
    width: '90%',
    height: 45,
    overflowY: 'auto',
    wordBreak: 'break-word',
  },
  footer: {
    display: 'flex',
    width: 'calc(100% - 22px)',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 10,
    left: 22,
  },
  footerSingleBtn: {
    left: 0,
    width: '100%',
    justifyContent: 'center',
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  warningIconRed: {
    color: theme.palette.error.main,
  },
  closeIconBtn: {
    float: 'right',
    padding: 0,
  },
  closeIcon: {
    fontSize: 18,
  },
  contentWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  details: {
    fontSize: 15,
  },
}));

function TrialExpireNotification({ content, single, expired, connectorId, licenseId}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [upgradeRequested, setUpgradeRequested] = useState(false);

  const onClickRenewButton = useCallback(event => {
    event.stopPropagation();
    setUpgradeRequested(true);
    dispatch(actions.user.org.accounts.requestUpdate('connectorRenewal', connectorId, licenseId));
  }, [dispatch, connectorId, licenseId]);

  return (
    <div className={classes.trialExpireWrapper}>
      <div className={classes.contentWrapper}>
        <WarningIcon className={clsx(classes.warningIcon, {[classes.warningIconRed]: expired})} />
        <div className={classes.content}>
          <Typography variant="body2" className={classes.details}>{content}</Typography>
        </div>
      </div>
      <div className={clsx(classes.footer, {[classes.footerSingleBtn]: single})}>
        {single ? (
          <Button
            disabled={upgradeRequested} onClick={onClickRenewButton} data-test="Renew" variant="outlined"
            color="primary">
            Renew
          </Button>
        )
          : (
            <ButtonGroup>
              <Button data-test="uninstall" variant="outlined" color="primary">
                Upgrade
              </Button>
              <Button data-test="contactSales" variant="text" color="primary">
                Uninstall
              </Button>
            </ButtonGroup>
          )}
      </div>
      <div />
    </div>

  );
}

export default TrialExpireNotification;
