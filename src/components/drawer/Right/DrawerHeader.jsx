import React from 'react';
import clsx from 'clsx';
import { IconButton, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import CloseIcon from '../../icons/CloseIcon';
import BackArrowIcon from '../../icons/BackArrowIcon';
import InfoIconButton from '../../InfoIconButton';
import Help from '../../Help';
import { hasMultipleDrawers } from '../../../utils/rightDrawer';
import { useDrawerContext } from './DrawerContext';

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
    wordBreak: 'break-word',
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
  showBackButton = false,
  handleBack,
  CloseButton,
  disableClose,
  className,
  handleClose,
  closeDataTest,
  showCloseButton = true,
  contentId,
}) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const { onClose } = useDrawerContext();
  const hasBackButton = showBackButton ||
  (location.pathname === match.url && hasMultipleDrawers(match.url));

  return (
    <div className={clsx(classes.drawerHeader, className)}>
      {hasBackButton && (
        <IconButton
          size="small"
          data-test="backRightDrawer"
          aria-label="Close"
        // eslint-disable-next-line react/jsx-handler-names
          onClick={handleBack || history.goBack}>
          <BackArrowIcon />
        </IconButton>
      )}
      <Typography variant="h4" className={classes.title}>
        {title}
        {helpKey && (
          <Help
            size="small"
            title={helpTitle}
            helpKey={helpKey}
            fieldId={helpKey}
            sx={{ml: 0.5}}
            contentId={contentId}
          />
        )}
        {infoText && <InfoIconButton info={infoText} title={title} />}
      </Typography>

      {/* Typically children are the action icons/buttons */}
      {children}
      {showCloseButton && <CloseIconButton closeDataTest={closeDataTest} CloseButton={CloseButton} disableClose={disableClose} onClose={handleClose || onClose} />}
    </div>
  );
}
