import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import ButtonGroup from '../../ButtonGroup';
import WarningIcon from '../../icons/WarningIcon';
import CloseIcon from '../../icons/CloseIcon';

const useStyles = makeStyles(theme => ({
  wrapper: {
    background: theme.palette.background.default,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: 10,
    boxSizing: 'border-box',
    zIndex: 2,
    height: '158px',
  },
  content: {
    display: 'flex',
    width: '90%',
    padding: [[0, 10, 0, 10]],
    clear: 'both',
    height: theme.spacing(8),
    overflowY: 'auto',
  },
  footer: {
    display: 'flex',
    width: 'calc(100% - 22px)',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 20,
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
    marginTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
  },
}));

function TrialExpireNotification({ content, single}) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <IconButton
        data-test="closeTrialNotification"
        className={classes.closeIconBtn}
       >
        <CloseIcon className={classes.closeIcon} />
      </IconButton>
      <div className={classes.contentWrapper}>
        <WarningIcon className={clsx(classes.warningIcon, {[classes.warningIconRed]: single})} />
        <div className={classes.content}>
          <Typography variant="body2">{content}</Typography>
        </div>
      </div>
      <div className={clsx(classes.footer, {[classes.footerSingleBtn]: single})}>
        {single ? (
          <Button data-test="uninstall" variant="outlined" color="primary">
            Upgrade
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
