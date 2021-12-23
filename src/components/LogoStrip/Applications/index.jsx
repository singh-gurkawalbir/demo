import React from 'react';
import clsx from 'clsx';
import { makeStyles, Tooltip } from '@material-ui/core';
import ApplicationImg from '../../icons/ApplicationImg';
import { getApp } from '../../../constants/applications';

const useStyles = makeStyles(theme => ({
  logoStripWrapper: {
    display: 'grid',
    margin: 0,
    padding: 0,
    maxWidth: 300,
    gridTemplateColumns: styleProps => `repeat(${styleProps.applicationsCount > 5 ? 5 : styleProps.applicationsCount}, ${styleProps.appWidth}px)`,
    '& > *': {
      justifyContent: 'center',
      position: 'relative',
      display: 'flex',
      height: styleProps => styleProps.appWidth,
      border: '1px solid',
      borderColor: theme.palette.secondary.lightest,
      alignItems: 'center',
      '& > img': {
        maxWidth: '80%',
        maxHeight: '80%',
      },
      '&:nth-child(n)': {
        borderLeft: 'none',
        '&:first-child': {
          borderLeft: '1px solid',
          borderColor: theme.palette.secondary.lightest,
        },
      },
      '&:nth-child(5n+1)': {
        borderLeft: '1px solid',
        borderColor: theme.palette.secondary.lightest,
      },
      '&:nth-child(n+6)': {
        borderTop: 'none',
      },
    },
  },
}));

export default function Applications({apps, children, className}) {
  const applicationsCount = apps?.length;
  const appWidth = 30;
  const styleProps = {
    applicationsCount,
    appWidth,
  };
  const classes = useStyles(styleProps);

  return (
    <ul className={clsx(classes.logoStripWrapper, className)}>
      {apps.map(application => (
        // TODO: Azhar, for some reason, the GetApp function does not contain all applications.
        // you may want to check with the dev who manages the /constants/applications.js file. There is a lot
        // or new code since i wrote the original. Possibly `getApp` is not working or not the correct fn to use
        // to get the application display name.
        <Tooltip title={getApp(null, application).name || application} key={application}>
          <li>
            <ApplicationImg
              markOnly
              type="other"
              assistant={application} />
          </li>
        </Tooltip>
      ))}
      {children && (<li>{children}</li>)}
    </ul>
  );
}
