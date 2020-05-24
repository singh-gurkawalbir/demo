import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '../../icons/CloseIcon';
import Help from '../../Help';
import BackArrowIcon from '../../icons/BackArrowIcon';

const useStyles = makeStyles(theme => ({
  titleBar: {
    background: theme.palette.background.paper,
    display: 'flex',
    alignItems: 'center',
    padding: '14px 0px',
    margin: theme.spacing(0, 3),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  title: {
    flexGrow: 1,
    display: 'flex',
  },
  helpTextButton: {
    padding: 0,
  },
  closeIcon: {
    padding: 0,
  },
  actions: {
    borderRight: '1px solid #95ABBC',
    borderColor: theme.palette.text.hint,
    marginRight: theme.spacing(1),
  },
}));

export default function DrawerTitleBarWithAction({
  title,
  helpKey,
  helpTitle,
  backToParent,
  action,
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
          data-test="backToDashboard"
          aria-label="back"
          onClick={handleClick}
          className={classes.arrowLeft}>
          <BackArrowIcon />
        </IconButton>
      )}
      <div className={classes.title}>
        <Typography variant="h3">{title}</Typography>
        {helpKey && (
          <Help
            title={helpTitle || title}
            className={classes.helpTextButton}
            helpKey={helpKey}
            fieldId={helpKey}
          />
        )}
      </div>

      {action && <div className={classes.actions}>{action}</div>}
      <IconButton
        data-test="closeFlowSchedule"
        aria-label="Close"
        className={classes.closeIcon}
        onClick={handleClick}>
        <CloseIcon />
      </IconButton>
    </div>
  );
}
