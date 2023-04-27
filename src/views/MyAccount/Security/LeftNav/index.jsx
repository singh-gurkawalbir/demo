import React from 'react';
import { NavLink, useRouteMatch, useLocation, matchPath } from 'react-router-dom';
import { List, ListItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  rowContainer: {
    '&>div': {
      paddingTop: 0,
      minWidth: theme.spacing(3),
    },
    '&>a': {
      color: theme.palette.text.primary,
      padding: theme.spacing(1, 0),
      '&>span': {
        gridTemplateColumns: theme.spacing(12, 7),
        gridColumnGap: 0,
      },
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    '&:before': {
      content: '""',
      width: '3px',
      top: 0,
      height: '100%',
      position: 'absolute',
      background: 'transparent',
      left: '0px',
    },
    '&:hover': {
      '&:before': {
        background: theme.palette.primary.main,
      },
    },
  },
  active: {
    '&:before': {
      content: '""',
      width: '3px',
      top: 0,
      height: '100%',
      position: 'absolute',
      left: '0px',
      background: theme.palette.primary.main,
    },
    '&>a': {
      fontWeight: 'bold',
      color: theme.palette.primary.main,
    },
  },
  listItem: {
    width: theme.spacing(12),
    '&>span>span:last-child': {
      paddingLeft: theme.spacing(1),
      width: theme.spacing(8),
    },
  },
}));

const AVAILABLE_SECURITY_SECTIONS = [
  { path: 'sso', label: 'Single sign-on (SSO)', id: 'sso'},
  { path: 'mfa', label: 'Multifactor authentication (MFA)', id: 'mfa'},
];

export default function LeftNav() {
  const classes = useStyles();
  const match = useRouteMatch();
  const { pathname } = useLocation();

  const { mode } = matchPath(pathname, {
    path: `${match.url}/:mode`,
  })?.params || {};

  return (
    <List>
      {AVAILABLE_SECURITY_SECTIONS.map(({ path, label, id }) => (
        <ListItem key={path}>
          <div className={clsx(classes.rowContainer, { [classes.active]: mode === id })}>
            <NavLink
              className={classes.listItem}
              to={path}
              data-test={id}>
              {label}
            </NavLink>
          </div>
        </ListItem>
      ))}
    </List>
  );
}
