import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useLocation,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { makeStyles, IconButton, Typography, Drawer } from '@material-ui/core';
import * as selectors from '../../../reducers';
import CloseIcon from '../../icons/CloseIcon';
import ArrowLeftIcon from '../../icons/ArrowLeftIcon';

const bannerHeight = 65;
const useStyles = makeStyles(theme => ({
  drawerPaper: {
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    zIndex: theme.zIndex.drawer + 1,
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
    padding: theme.spacing(0, 3),
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
}));

export default function RightDrawer({
  title,
  path,
  width = 'small',
  height = 'short',
  children,
  onClose,
  variant = 'persistent',
  ...rest
}) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const [showBack, setShowBack] = useState();
  const bannerOpened = useSelector(state => selectors.bannerOpened(state));
  const showBackButton = useCallback(() => setShowBack(true), []);
  const showBanner = location.pathname.includes('pg/dashboard') && bannerOpened;
  const handleClose = useCallback(() => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    }

    history.goBack();
  }, [history, onClose]);

  return (
    <Switch>
      <Route path={`${match.url}/${path}`}>
        <Drawer
          {...rest}
          variant={variant}
          anchor="right"
          open
          classes={{
            paper: clsx(classes.drawerPaper, classes[width], classes[height], {
              [classes.banner]:
                bannerOpened && showBanner && height === 'short',
            }),
          }}
          onClose={handleClose}>
          <div className={classes.titleBar}>
            {showBack && (
              <IconButton
                size="small"
                data-test="backRightDrawer"
                aria-label="Close"
                onClick={handleClose}>
                <ArrowLeftIcon />
              </IconButton>
            )}
            <Typography variant="h3" className={classes.title}>
              {title}
            </Typography>
            <IconButton
              size="small"
              data-test="closeRightDrawer"
              aria-label="Close"
              onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className={classes.contentContainer}>
            {// We want to accomplish two things here:
            // 1: only render the children if the drawer is open.
            // 2: inject a callback into the child component to let it
            //    control the show back button flag in case it has some
            //    nested behavior that triggers a stack of drawers.
            // children
            React.cloneElement(children, { showBackButton })}
          </div>
        </Drawer>
      </Route>
      <Route>
        <Drawer />
      </Route>
    </Switch>
  );
}
