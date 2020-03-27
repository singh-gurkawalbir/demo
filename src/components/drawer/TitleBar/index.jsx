import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '../../icons/CloseIcon';
import Help from '../../Help';

const useStyles = makeStyles(theme => ({
  titleBar: {
    background: theme.palette.background.paper,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 3),
  },
  title: {
    flexGrow: 1,
  },
  helpTextButton: {
    float: 'right',
    padding: theme.spacing(1),
  },
}));

export default function DrawerTitleBar({ title, helpKey, helpTitle, onClose }) {
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
        onClick={handleClick}>
        <CloseIcon />
      </IconButton>
    </div>
  );
}
