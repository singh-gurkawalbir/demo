import { Collapse, List } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { Fragment, useMemo } from 'react';
import { useSelector } from 'react-redux';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';
import menuItems from '../menuItems';
import MemoNavItem from '../NavListItem';

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

const integrationsFilterConfig = {
  type: 'integrations',
  ignoreEnvironmentFilter: true,
};

export default function () {
  const classes = useStyles();
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
      {listItemsMemo.map(({ label, Icon, path, routeProps, children: navChildren, href, component, dataTest }) => (
        <Fragment key={label}>
          <MemoNavItem
            isParentNavItem
            label={label}
            href={href}
            navChildren={navChildren}
            dataTest={dataTest}
            path={path}
            component={component}
            routeProps={routeProps}
            Icon={Icon}
          />
          {navChildren && (
          <Collapse in={expand === label} unmountOnExit timeout="auto">
            <List className={clsx(classes.list)} disablePadding>
              {navChildren.map(
                ({
                  label,
                  Icon,
                  path,
                  routeProps,
                  href,
                  component,
                  dataTest,
                }) => (
                  <MemoNavItem
                    key={label}
                    label={label}
                    Icon={Icon}
                    path={path}
                    routeProps={routeProps}
                    href={href}
                    component={component}
                    dataTest={dataTest}
                  />
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
