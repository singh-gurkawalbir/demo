import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import ApplicationImg from '../icons/ApplicationImg';
import ArrowPopper from '../ArrowPopper';

const useStyles = makeStyles(theme => ({
  logoStripWrapper: {
    display: 'grid',
    margin: 0,
    padding: 0,
    maxWidth: 300,
    gridTemplateColumns: props => `repeat(${props.applicationsCount > 5 ? 5 : props.applicationsCount}, minmax(40px, 60px))`,
    '& > *': {
      justifyContent: 'center',
      position: 'relative',
      display: 'flex',
      height: 40,
      border: '1px solid',
      borderColor: theme.palette.secondary.lightest,
      alignItems: 'center',
      '& > img': {
        maxWidth: '75%',
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
  applicationsMenuPopper: {
    border: 'none',
  },
  moreLogoStrip: {
    gridTemplateColumns: props => `repeat(${props.restAppsCount > 5 ? 5 : props.restAppsCount}, minmax(40px, 60px))`,
  },
}));

export default function LogoStrip({applications}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const applicationsCount = applications?.length;

  const handleClick = useCallback(
    event => {
      setAnchorEl(!anchorEl ? event.currentTarget : null);
    },
    [anchorEl]
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const open = !!anchorEl;

  const apps = applications.slice(0, 9).map(application => (
    <li key={application}>
      <ApplicationImg
        markOnly
        type="export"
        assistant={application}
     />
    </li>
  ));

  const restApps = applications.slice(9, applicationsCount).map(application => (
    <li key={application}>
      <ApplicationImg
        markOnly
        type="export"
        assistant={application}
     />
    </li>
  ));
  const restAppsCount = restApps.length;

  const props = {
    applicationsCount,
    restAppsCount,
  };
  const classes = useStyles(props);

  return (
    <>
      {applicationsCount >= 10 ? (
        <ul className={classes.logoStripWrapper}>
          {apps}
          <li>
            <IconButton
              data-test="openActionsMenu"
              aria-label="openDrop"
              aria-controls="openDrop"
              aria-haspopup="true"
              size="small"
              onClick={handleClick}>
              <Typography component="span">+ {applicationsCount - 9}</Typography>
            </IconButton>
            <ArrowPopper
              placement="right-start"
              open={open}
              anchorEl={anchorEl}
              restrictToParent={false}
              classes={{ popper: classes.applicationsMenuPopper }}
              id="openDrop"
              onClose={handleClose}>
              <ul className={clsx(classes.logoStripWrapper, classes.moreLogoStrip)}>{restApps}</ul>
            </ArrowPopper>
          </li>
        </ul>
      ) : (
        <ul className={classes.logoStripWrapper}>
          {apps}
        </ul>
      )}

    </>
  );
}
