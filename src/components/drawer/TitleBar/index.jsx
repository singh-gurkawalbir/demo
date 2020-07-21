import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '../../icons/CloseIcon';
import Help from '../../Help';
import BackArrowIcon from '../../icons/BackArrowIcon';

const useStyles = makeStyles(theme => ({
  titleBar: {
    background: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 3),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  title: {
    flexGrow: 1,
    color: theme.palette.secondary.main,
  },
  helpTextButton: {
    float: 'right',
    padding: 0,
    position: 'relative',
    marginRight: theme.spacing(2),
    '&:after': {
      content: '""',
      borderRight: `1px solid ${theme.palette.secondary.lightest}`,
      height: '100%',
      width: 1,
      position: 'absolute',
      right: theme.spacing(-1),
    },
  },
  closeButtonTitleBar: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.secondary.dark,
    },
  },
}));

export default function DrawerTitleBar({
  title,
  helpKey,
  helpTitle,
  backToParent,
  onClose,
}) {
  const classes = useStyles();
  const history = useHistory();
  const handleClick = useCallback(() => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    } else {
      history.goBack();
    }
  }, [history, onClose]);

  return (
    <div className={classes.titleBar}>
      {backToParent && (
        <IconButton
          data-test="back"
          aria-label="back"
          onClick={handleClick}
          className={classes.arrowLeft}>
          <BackArrowIcon />
        </IconButton>
      )}
      <Typography variant="h3" className={classes.title}>
        {title}
      </Typography>
      {helpKey && (
        <Help
          title={helpTitle || title}
          className={classes.helpTextButton}
          helpKey={helpKey}
          fieldId={helpKey}
        />
      )}
      <IconButton
        data-test="closeFlowSchedule"
        aria-label="Close"
        className={classes.closeButtonTitleBar}
        onClick={handleClick}>
        <CloseIcon />
      </IconButton>
    </div>
  );
}
