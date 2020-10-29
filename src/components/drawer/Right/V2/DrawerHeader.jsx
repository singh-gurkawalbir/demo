import React from 'react';
import { makeStyles, IconButton, Typography } from '@material-ui/core';
import {matchPath, useHistory, useLocation} from 'react-router-dom';
import CloseIcon from '../../../icons/CloseIcon';
import BackArrowIcon from '../../../icons/BackArrowIcon';
import InfoIconButton from '../../../InfoIconButton';
import Help from '../../../Help';

const useStyles = makeStyles(theme => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(2, 3),
    '& > :not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
  title: {
    flexGrow: 1,
    color: theme.palette.secondary.main,
  },
  helpTextButton: {
    padding: 0,
    marginLeft: theme.spacing(1),
    '& svg': {
      fontSize: 20,
    },
  },
}));

export default function DrawerHeader({
  title,
  infoText,
  children,
  helpTitle,
  helpKey,
  hideBackButton = false,
  fullPath, // forwarded from parent (RightDrawer)
  onClose, // forwarded from parent (RightDrawer)
}) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { isExact } = matchPath(location.pathname, fullPath) || {};
  const showBackButton = !isExact && !hideBackButton;

  return (
    <div data-public className={classes.drawerHeader}>
      {showBackButton && (
      <IconButton
        size="small"
        data-test="backRightDrawer"
        aria-label="Close"
        // eslint-disable-next-line react/jsx-handler-names
        onClick={history.goBack}>
        <BackArrowIcon />
      </IconButton>
      )}
      <Typography variant="h4" className={classes.title}>
        {title}
        {helpKey && (
        <Help
          title={helpTitle}
          className={classes.helpTextButton}
          helpKey={helpKey}
          fieldId={helpKey}
      />
        )}
        {infoText && <InfoIconButton info={infoText} />}
      </Typography>

      {/* Typically children are the action icons/buttons */}
      {children}

      <IconButton
        size="small"
        data-test="closeRightDrawer"
        aria-label="Close"
        onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </div>

  );
}
