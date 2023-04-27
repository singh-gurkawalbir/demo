import React from 'react';
import clsx from 'clsx';
import { Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ApplicationImg from '../../icons/ApplicationImg';
import { getApp } from '../../../constants/applications';
import { logoSizes } from '../index';

const useStyles = makeStyles(theme => ({
  logoStripWrapper: {
    display: 'grid',
    margin: 0,
    padding: 0,
    maxWidth: 300,
    // gridTemplateColumns: `repeat(${props.cols}, ${props.pxSize}px)`,
    '& > *': {
      justifyContent: 'center',
      position: 'relative',
      display: 'flex',
      // height: props.pxSize,
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
      // [`&:nth-child(${columns}n+1)`]: {
      //   borderLeft: '1px solid',
      //   borderColor: theme.palette.secondary.lightest,
      // },
      // [`&:nth-child(n+${columns + 1})`]: {
      //   borderTop: 'none',
      // },
    },
  },
}));

export default function Applications({applications, children, className, columns, size = 'small', type = 'other', value = ''}) {
  const appCount = applications?.length;
  // const appWidth = 30;
  const pxSize = logoSizes[size];
  const hasChildren = !!children;
  let cols = appCount;

  if (appCount > columns) {
    cols = columns;
  } else if (hasChildren) {
    // In this case, we have apps that fit into a single row. We need to adjust
    // the column count to accommodate the [+] icon that is not counted in the
    // 'count' prop that only recognizes app count, and throws off the column count.
    cols += 1;
  }
  const classes = useStyles({pxSize, columns, count: appCount, hasChildren, cols});

  return (
    <ul className={clsx(classes.logoStripWrapper, className)} style={{gridTemplateColumns: `repeat(${cols}, ${pxSize}px)`}}>
      {applications.map((application, index) => (
        // TODO: Azhar, for some reason, the GetApp function does not contain all applications.
        // you may want to check with the dev who manages the /constants/applications.js file. There is a lot
        // or new code since i wrote the original. Possibly `getApp` is not working or not the correct fn to use
        // to get the application display name.
        <Tooltip title={getApp(null, application).name || 'other'} key={application || value}>
          <li style={{height: pxSize, borderLeft: index === 0 || index === columns ? '1px solid #D6E4ED' : '', borderTop: index > (columns - 1) ? 'none' : ''}}>
            <ApplicationImg
              markOnly
              type={type || 'other'}
              assistant={application} />
          </li>
        </Tooltip>
      ))}
      {children && (<li>{children}</li>)}
    </ul>
  );
}
