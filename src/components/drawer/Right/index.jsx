import clsx from 'clsx';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { Drawer } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { RightDrawer as RightDrawerHoc } from '@celigo/fuse-ui';
import { selectors } from '../../../reducers';
import { DrawerProvider } from './DrawerContext';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: '-4px 4px 8px rgba(0,0,0,0.15)',
    zIndex: theme.zIndex.drawer + 1,
  },
  childrenWrapper: {
    display: 'flex',
    height: '100%',
    minHeight: '100%',
    flexDirection: 'column',
    width: '100%',
  },
  small: {
    width: 475,
  },
  medium: {
    width: 660,
  },
  default: {
    width: 824,
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
    paddingBottom: theme.appBarHeight,
  },
  short: {
    marginTop: theme.appBarHeight + theme.pageBarHeight - 1,
    paddingBottom: theme.appBarHeight + theme.pageBarHeight - 1,
  },
}));

function RightDrawer(props) {
  const {
    width,
    height,
    children,
    onClose,
    variant,
    fullPath,
    isIntegrated,
    ...muiDrawerProps
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const showFullDrawerWidth = useSelector(state => selectors.showFullDrawerWidth(state, props, match.params));

  const handleClose = useCallback(() => {
    if (onClose && typeof onClose === 'function') {
      return onClose();
    }

    // else, just go back in browser history...
    history.goBack();
  }, [history, onClose]);

  if (isIntegrated) {
    return (
      <RightDrawerHoc mainMenuOpen={drawerOpened} {...props}>
        {children}
      </RightDrawerHoc>
    );
  }

  return (
    <Drawer
      {...muiDrawerProps}
      variant={variant}
      anchor="right"
      open
      classes={{
        paper: clsx(
          classes.drawerPaper,
          classes[height],
          {
            [classes[width]]: !showFullDrawerWidth,
            [classes.fullWidthDrawerClose]: showFullDrawerWidth && !drawerOpened,
            [classes.fullWidthDrawerOpen]: showFullDrawerWidth && drawerOpened,
          }
        ),
      }}
     >
      <div className={classes.childrenWrapper}>
        <DrawerProvider height={height} fullPath={fullPath} onClose={handleClose}>
          {children}
        </DrawerProvider>
      </div>
    </Drawer>
  );
}

export default function RightDrawerRoute(props) {
  const { path, disableEnforceFocus = true } = props;
  let fullPath;
  const match = useRouteMatch();

  const getFullPath = path => match.url === '/' ? path : `${match.url}/${path}`;

  if (typeof path === 'string' || typeof path === 'number') {
    fullPath = getFullPath(path);
  } else if (Array.isArray(path)) {
    fullPath = path.map(p => getFullPath(p));
  } else {
    // bad path datatype... don't know what do do.. render nothing.
    return null;
  }

  return (
    <Switch>
      <Route path={fullPath}>
        <RightDrawer {...props} fullPath={fullPath} disableEnforceFocus={disableEnforceFocus} />
      </Route>
      <Route>
        <Drawer />
      </Route>
    </Switch>
  );
}

RightDrawer.propTypes = {
  height: PropTypes.oneOf(['tall', 'short']),
  width: PropTypes.oneOf(['small', 'medium', 'large', 'default', 'xl', 'full']),
  variant: PropTypes.oneOf(['permanent', 'temporary']),
};
RightDrawer.defaultProps = {
  width: 'default',
  height: 'short',
  variant: 'temporary',
};
