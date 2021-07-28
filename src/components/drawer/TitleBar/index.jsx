import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '../../icons/CloseIcon';
import Help from '../../Help';
import BackArrowIcon from '../../icons/BackArrowIcon';

const useStyles = makeStyles(theme => ({
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 3),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  title: {
    flexGrow: 1,
    color: theme.palette.secondary.main,
    wordBreak: 'break-word',
  },
  helpTextButton: {
    float: 'left',
    padding: 0,
    position: 'relative',
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(1),
    top: 3,
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  closeButtonTitleBar: {
    position: 'absolute',
    right: theme.spacing(2),
    padding: 4,
    '&:hover': {
      backgroundColor: theme.palette.background.paper2,
    },
  },
  arrowLeft: {
    padding: 0,
    marginRight: theme.spacing(1),
  },
}));

export default function DrawerTitleBar({
  title,
  helpKey,
  helpTitle,
  backToParent,
  onClose,
  disableClose,
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
    <div data-public className={classes.titleBar}>
      {backToParent && (
        <IconButton
          data-test="back"
          aria-label="back"
          onClick={handleClick}
          className={classes.arrowLeft}>
          <BackArrowIcon />
        </IconButton>
      )}
      <div className={classes.titleWrapper}>
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
      </div>
      <IconButton
        data-test="closeRightDrawer"
        aria-label="Close"
        className={classes.closeButtonTitleBar}
        disabled={disableClose}
        onClick={handleClick}>
        <CloseIcon />
      </IconButton>
    </div>
  );
}
