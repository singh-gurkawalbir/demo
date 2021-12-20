import React from 'react';
import clsx from 'clsx';
import { makeStyles, IconButton, Typography } from '@material-ui/core';
import {matchPath, useHistory, useLocation} from 'react-router-dom';
import CloseIcon from '../../icons/CloseIcon';
import BackArrowIcon from '../../icons/BackArrowIcon';
import InfoIconButton from '../../InfoIconButton';
import Help from '../../Help';
import { useDrawerContext } from './DrawerContext';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import DrawerSubHeader from '../../DrawerSubHeader';

const useStyles = makeStyles(theme => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(2, 3),
    '& > :not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
  title: {
    flexGrow: 1,
    color: theme.palette.secondary.main,
    wordBreak: 'break-word',
  },
  helpTextButton: {
    padding: 0,
    marginLeft: theme.spacing(1),
    '& svg': {
      fontSize: 20,
    },
  },
}));

const CloseIconButton = ({CloseButton, disableClose, onClose, closeDataTest}) => {
  // If the parent drawer provided a custom close button, then use it.
  if (CloseButton) return CloseButton;

  // Otherwise return the default close button.
  return (
    <IconButton
      size="small"
      disabled={!!disableClose}
      data-test={closeDataTest || 'closeRightDrawer'}
      aria-label="Close"
      onClick={onClose}>
      <CloseIcon />
    </IconButton>
  );
};

export default function DrawerHeader({
  title,
  infoText,
  children,
  helpTitle,
  helpKey,
  hideBackButton = false,
  CloseButton,
  disableClose,
  className,
  handleClose,
  closeDataTest,
  endedAt,
}) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { fullPath, onClose } = useDrawerContext();
  const { isExact } = matchPath(location.pathname, fullPath) || {};
  const showBackButton = !isExact && !hideBackButton;

  return (
    <div data-public className={clsx(classes.drawerHeader, className)}>
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
        {endedAt && <DrawerSubHeader title="Run completed: "><CeligoTimeAgo date={endedAt} /></DrawerSubHeader>}
      </Typography>

      {/* Typically children are the action icons/buttons */}
      {children}
      <CloseIconButton closeDataTest={closeDataTest} CloseButton={CloseButton} disableClose={disableClose} onClose={handleClose || onClose} />
    </div>
  );
}
