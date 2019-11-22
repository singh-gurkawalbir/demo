import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '../../icons/CloseIcon';

const useStyles = makeStyles(theme => ({
  titleBar: {
    background: theme.palette.background.paper,
    display: 'flex',
    alignItems: 'center',
    padding: '14px 24px',
    '& > :not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
  title: {
    flexGrow: 1,
  },
}));

export default function DrawerTitleBar({ title, onClose }) {
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
      <IconButton
        data-test="closeFlowSchedule"
        aria-label="Close"
        onClick={handleClick}>
        <CloseIcon />
      </IconButton>
    </div>
  );
}
