import clsx from 'clsx';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  useLocation,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
  matchPath,
} from 'react-router-dom';
import { makeStyles, IconButton, Typography, Drawer } from '@material-ui/core';
import * as selectors from '../../../reducers';
import CloseIcon from '../../icons/CloseIcon';
import BackArrowIcon from '../../icons/BackArrowIcon';
import InfoIconButton from '../../InfoIconButton';

const bannerHeight = 57;
const useStyles = makeStyles(theme => ({
  drawerPaper: {
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper_default: {
    background: theme.palette.background.default,
  },
  titleBar: {
    background: theme.palette.background.paper,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 3),
    '& > :not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
  title: {
    flexGrow: 1,
  },
  contentContainer: {
    margin: theme.spacing(2, 3),
  },
  contentContainer_paper: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
  },
  small: {
    width: 475,
  },
  medium: {
    width: 660,
  },
  large: {
    width: 995,
  },
  xl: {
    width: 1300,
  },
  fullWidthDrawerClose: {
    width: 'calc(100% - 60px)',
  },
  fullWidthDrawerOpen: {
    width: `calc(100% - ${theme.drawerWidth}px)`,
  },
  tall: {
    marginTop: theme.appBarHeight,
  },
  short: {
    marginTop: theme.appBarHeight + theme.pageBarHeight,
    paddingBottom: theme.appBarHeight + theme.pageBarHeight,
  },
  banner: {
    marginTop: theme.appBarHeight + theme.pageBarHeight + bannerHeight,
  },
  popperMaxWidthView: {
    maxWidth: 250,
    maxHeight: 300,
    overflowY: 'auto',
  },
}));

export default function RightDrawer({
  title,
  path,
  width = 'small',
  height = 'short',
  type = 'legacy',
  hideBackButton = false,
  children,
  onClose,
  infoText,
  variant = 'persistent',
  ...rest
}) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const bannerOpened = useSelector(state => selectors.bannerOpened(state));
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const showBanner = location.pathname.includes('pg/dashboard') && bannerOpened;
  const handleBack = useCallback(() => {
    // else, just go back in browser history...
    history.goBack();
  }, [history]);
  const handleClose = useCallback(() => {
    if (onClose && typeof onClose === 'function') {
      return onClose();
    }

    // else, just go back in browser history...
    handleBack();
  }, [handleBack, onClose]);
  const fullPath = `${match.url}/${path}`;
  const { isExact } = matchPath(location.pathname, fullPath) || {};
  const showBackButton = !isExact && !hideBackButton;

  return (
    <Switch>
      <Route path={fullPath}>
        <Drawer
          {...rest}
          variant={variant}
          anchor="right"
          open
          classes={{
            paper: clsx(
              classes.drawerPaper,
              classes[`drawerPaper_${type}`],
              classes[height],
              {
                [classes.banner]:
                  bannerOpened && showBanner && height === 'short',
                [classes[width]]: width !== 'full',
                [classes.fullWidthDrawerClose]:
                  width === 'full' && !drawerOpened,
                [classes.fullWidthDrawerOpen]: width === 'full' && drawerOpened,
              }
            ),
          }}
          onClose={handleClose}>
          <div className={classes.titleBar}>
            {showBackButton && (
              <IconButton
                size="small"
                data-test="backRightDrawer"
                aria-label="Close"
                onClick={handleBack}>
                <BackArrowIcon />
              </IconButton>
            )}
            <Typography variant="h3" className={classes.title}>
              {title}
              {infoText && <InfoIconButton info={infoText} />}
            </Typography>
            <IconButton
              size="small"
              data-test="closeRightDrawer"
              aria-label="Close"
              onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <div
            className={clsx(
              classes.contentContainer,
              classes[`contentContainer_${type}`]
            )}>
            {children}
          </div>
        </Drawer>
      </Route>
      <Route>
        <Drawer />
      </Route>
    </Switch>
  );
}
