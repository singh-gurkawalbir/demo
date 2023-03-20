import { Collapse, List } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import MemoNavItem from '../NavListItem';
import useResourceListItems from '../../../hooks/useSidebarListItems';

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
      color: theme.palette.common.white,
      '&:before': {
        background: theme.palette.background.drawerActive,
      },
      '& svg > *': {
        color: theme.palette.common.white,
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
      color: theme.palette.common.white,
    },
  },
  itemIconRoot: {
    minWidth: 'unset',
    marginRight: theme.spacing(1),
    color: theme.palette.common.white,
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

export default function () {
  const classes = useStyles();
  const expand = useSelector(state => selectors.expandSelected(state));
  const listItems = useResourceListItems();

  return (

    <List className={clsx(classes.list)}>
      {listItems.map(({ label, Icon, path, routeProps, children: navChildren, href, component, dataTest }) => (
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
