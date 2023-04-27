import { Tooltip } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, matchPath, useLocation } from 'react-router-dom';
import actions from '../../../actions';
import ArrowDownIcon from '../../../components/icons/ArrowDownIcon';
import ArrowUpIcon from '../../../components/icons/ArrowUpIcon';
import { selectors } from '../../../reducers';
import getRoutePath from '../../../utils/routePaths';

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

function getHrefProps(href, path) {
  return {
    target: href && '_blank',
    href,
    to: !href ? getRoutePath(path) : undefined,
  };
}

function NavListItem(
  {isParentNavItem, label, href, navChildren, dataTest, path, component, isActiveItem, Icon}
) {
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const expand = useSelector(state => selectors.expandSelected(state));
  const dispatch = useDispatch();

  const classes = useStyles();

  const handleExpandClick = useCallback(
    () => {
      const selectedExpandValue = label === expand ? null : label;

      dispatch(
        actions.user.preferences.update({
          expand: selectedExpandValue,
        })
      );
    },
    [dispatch, expand, label]
  );

  return (
    <ListItem
      button
      className={clsx(classes.listItem, {[classes.innerListItems]: !isParentNavItem}, {
        [classes.activeItem]: isActiveItem })}
      component={navChildren ? undefined : component || Link}
      {...getHrefProps(href, path)}
      data-test={dataTest || label}
      onClick={isParentNavItem && navChildren ? handleExpandClick : null}>
      <ListItemIcon
        className={clsx(classes.itemIconRoot, {[classes.itemIconRootCollapsed]: !drawerOpened})}>

        <>
          {drawerOpened ? <Icon />
            : (
              <Tooltip
                placement="right" enterDelay={0} title={label}
                classes={{popper: classes.tooltipLeft}}>
                <div>
                  <Icon />
                </div>
              </Tooltip>
            )}

          { isParentNavItem && (!drawerOpened && navChildren) &&
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
      {isParentNavItem && navChildren &&
                (expand === label ? <ArrowUpIcon /> : <ArrowDownIcon />)}
    </ListItem>
  );
}

export default function MemoNavItem({
  isParentNavItem,
  label,
  href,
  navChildren,
  dataTest,
  path,
  component,
  routeProps,
  Icon,
}) {
  const expand = useSelector(state => selectors.expandSelected(state));
  const location = useLocation();

  const isActiveItemFn = () => {
    const baseCondition = matchPath(location.pathname, routeProps || getRoutePath(`${path}`));

    if (isParentNavItem) { return expand !== label && baseCondition; }

    return baseCondition;
  };
  const isActiveItem = isActiveItemFn();

  return useMemo(() => (
    <NavListItem
      isParentNavItem={isParentNavItem}
      label={label}
      href={href}
      navChildren={navChildren}
      dataTest={dataTest}
      path={path}
      component={component}
      isActiveItem={isActiveItem}
      Icon={Icon}

    />
  ), [Icon, component, dataTest, href, isActiveItem, isParentNavItem, label, navChildren, path]);
}
