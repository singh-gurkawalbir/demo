import { Collapse, List, Tooltip } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import React, { Fragment, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, matchPath, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDownIcon from '../../../components/icons/ArrowDownIcon';
import ArrowUpIcon from '../../../components/icons/ArrowUpIcon';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';
import getRoutePath from '../../../utils/routePaths';
import menuItems from '../menuItems';
import actions from '../../../actions';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: theme.drawerWidth,
    borderRight: 0,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    '& > div': {
      borderRight: 0,
    },
    '& > div > div': {
      minHeight: 10,
    },
  },
  list: {
    backgroundColor: 'rgb(255,255,255,0.1)',
    paddingTop: 0,
    paddingBottom: 0,
    '& ul': {
      '&:last-child': {
        borderBottom: `solid 1px ${theme.palette.secondary.dark}`,
      },
    },
  },
  listItem: {
    backgroundColor: theme.palette.background.drawer2,
    '& svg > *': {
      color: theme.palette.common.white,
    },
    '&:hover': {
      backgroundColor: theme.palette.background.drawer2,
      color: theme.palette.background.paper,
      '&:before': {
        background: theme.palette.background.drawerActive,
      },
      '& svg > *': {
        color: theme.palette.background.paper,
      },
    },
    '&:not(:last-child)': {
      borderBottom: `solid 1px ${theme.palette.secondary.dark}`,
    },
    '&:before': {
      content: '""',
      width: 6,
      height: '100%',
      position: 'absolute',
      background: 'transparent',
      left: 0,
    },
  },
  activeItem: {
    backgroundColor: `${theme.palette.background.drawerActive} !important`,
    color: theme.palette.common.white,
    '& svg > *': {
      color: theme.palette.background.paper,
    },
  },
  itemIconRoot: {
    minWidth: 'unset',
    marginRight: theme.spacing(1),
    color: theme.palette.background.paper,
  },
  itemIconRootCollapsed: {
    minWidth: 45,
    marginRight: theme.spacing(1),
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'unset',
    color: 'inherit',
  },
  innerListItems: {
    backgroundColor: theme.palette.background.drawer3,
    '&:hover': {
      backgroundColor: theme.palette.background.drawer3 },
  },
  collapsedArrowIcon: {
    width: 18,
  },
  listItemText: {
    flex: 1,
  },
  listItemTextCollapsed: {
    paddingLeft: theme.spacing(4),
  },
  tooltipLeft: {
    left: '25px !important',
  },
}));

function getHrefProps(href, path) {
  return {
    target: href && '_blank',
    href,
    to: !href ? getRoutePath(path) : undefined,
  };
}

const integrationsFilterConfig = {
  type: 'integrations',
  ignoreEnvironmentFilter: true,
};

export default function () {
  const dispatch = useDispatch();
  const classes = useStyles();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const location = useLocation();
  const userProfile = useSelector(state => selectors.userProfile(state));
  const canUserPublish = useSelector(state => selectors.canUserPublish(state));
  const accessLevel = useSelector(
    state => selectors.resourcePermissions(state).accessLevel
  );
  const integrations = useSelectorMemo(
    selectors.makeResourceListSelector,
    integrationsFilterConfig
  ).resources;
  const environment = useSelector(
    state => selectors.userPreferences(state).environment
  );

  const expand = useSelector(state => selectors.expandSelected(state));
  const isSandbox = environment === 'sandbox';
  const marketplaceConnectors = useSelectorMemo(
    selectors.makeMarketPlaceConnectorsSelector,
    undefined,
    isSandbox
  );

  const handleExpandClick = useCallback(
    label => () => {
      const selectedExpandValue = label === expand ? null : label;

      dispatch(
        actions.user.preferences.update({
          expand: selectedExpandValue,
        })
      );
    },
    [dispatch, expand]
  );

  const listItemsMemo = useMemo(() => menuItems(
    userProfile,
    accessLevel,
    integrations,
    canUserPublish,
    marketplaceConnectors),
  [

    userProfile,
    accessLevel,
    canUserPublish,
    integrations,
    marketplaceConnectors,
  ]);

  return (

    <List className={clsx(classes.list)}>
      {listItemsMemo.map(({ label, Icon, path, routeProps, children, href, component, dataTest }) => (
        <Fragment key={label}>
          <ListItem
            button
            className={clsx(classes.listItem, {
              [classes.activeItem]:
                  expand !== label &&
                  matchPath(location.pathname, routeProps || getRoutePath(`${path}`)),
            })}
            component={children ? undefined : component || Link}
            {...getHrefProps(href, path)}
            data-test={dataTest || label}
            onClick={children ? handleExpandClick(label) : null}>
            <ListItemIcon
              className={clsx(classes.itemIconRoot, {[classes.itemIconRootCollapsed]: !drawerOpened})}>

              <>
                {drawerOpened ? <Icon />
                  : (
                    <Tooltip
                      data-public placement="right" enterDelay={0} title={label}
                      classes={{popper: classes.tooltipLeft}}>
                      <div>
                        <Icon />
                      </div>
                    </Tooltip>
                  )}

                {(!drawerOpened && children) &&
                (expand === label && !drawerOpened ? <ArrowUpIcon className={classes.collapsedArrowIcon} /> : <ArrowDownIcon className={classes.collapsedArrowIcon} />)}
              </>
            </ListItemIcon>
            <ListItemText
              className={clsx(classes.listItemText, {[classes.listItemTextCollapsed]: !drawerOpened})}
              primaryTypographyProps={{
                className: classes.itemText,
              }}
              primary={label}
              />
            {children &&
                (expand === label ? <ArrowUpIcon /> : <ArrowDownIcon />)}
          </ListItem>
          {children && (
          <Collapse in={expand === label} unmountOnExit timeout="auto">
            <List className={clsx(classes.list)} disablePadding>
              {children.map(
                ({
                  label,
                  Icon,
                  path,
                  routeProps,
                  href,
                  component,
                  dataTest,
                }) => (
                  <ListItem
                    className={clsx(
                      classes.listItem,
                      classes.innerListItems,
                      {
                        [classes.activeItem]: matchPath(
                          location.pathname,
                          routeProps || getRoutePath(`${path}`)
                        ),
                      }
                    )}
                    data-test={dataTest || label}
                    key={label}
                    component={component || Link}
                    {...getHrefProps(href, path)}
                    button>
                    <ListItemIcon
                      className={clsx(classes.itemIconRoot, {[classes.itemIconRootCollapsed]: !drawerOpened})}>
                      {drawerOpened
                        ? <Icon />
                        : (
                          <Tooltip
                            data-public placement="right" enterDelay={0} title={label}
                            classes={{popper: classes.tooltipLeft}}>
                            <div>
                              <Icon />
                            </div>
                          </Tooltip>
                        )}
                    </ListItemIcon>
                    <ListItemText
                      className={clsx(classes.listItemText, {[classes.listItemTextCollapsed]: !drawerOpened})}
                      primary={label}
                      primaryTypographyProps={{
                        className: classes.itemText,
                      }}
                        />
                  </ListItem>
                )
              )}
            </List>
          </Collapse>
          )}
        </Fragment>
      ))}
    </List>
  );
}
