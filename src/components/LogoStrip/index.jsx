import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import {IconButton, makeStyles } from '@material-ui/core';
import ArrowPopper from '../ArrowPopper';
import Applications from './Applications';

const useStyles = makeStyles(theme => ({
  applicationsMenuPopper: {
    border: 'none',
  },
  applicationsMenuPaper: {
    right: styleProps => styleProps.additionalAppsCount >= 3 ? styleProps.appWidth : styleProps.appWidth / 2,
  },
  applicationsMenuPaperMax: {
    right: styleProps => styleProps.appWidth * 2,
  },
  applicationsMenuPaperPlaceholder: {
    position: 'relative',
    maxHeight: styleProps => styleProps.appWidth * 4,
    overflowY: 'auto',
  },
  moreLogoStrip: {
    gridTemplateColumns: styleProps => `repeat(${styleProps.additionalAppsCount > styleProps.maxAppsInRow ? styleProps.maxAppsInRow : styleProps.additionalAppsCount}, ${styleProps.appWidth})`,
  },
  logoStripBtn: {
    padding: 0,
    '& >* span': {
      display: 'flex',
      alignItems: 'center',
      fontSize: 12,
      color: theme.palette.secondary.main,
    },
  },
}));

export default function LogoStrip({applications}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const applicationsCount = applications?.length || 0;
  const maxApps = 10;
  const maxAppsInRow = 5;
  const appWidth = 30;
  const apps = applicationsCount > maxApps ? applications.slice(0, maxApps - 1) : applications.slice(0, maxApps);
  const additionalApps = applications.slice(apps.length, applicationsCount);
  const additionalAppsCount = additionalApps.length;
  const styleProps = {
    maxAppsInRow,
    additionalAppsCount,
    appWidth,
  };
  const classes = useStyles(styleProps);
  const appsPaper = additionalAppsCount > maxAppsInRow ? classes.applicationsMenuPaperMax : classes.applicationsMenuPaper;

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

  return (
    <>
      {applicationsCount > maxApps ? (
        <Applications apps={apps}>
          <IconButton
            data-test="logoStrip"
            className={classes.logoStripBtn}
            aria-label="additional apps"
            aria-controls="additionalApps"
            aria-haspopup="true"
            onClick={handleClick}>
            <span>+{applicationsCount - apps.length}</span>
          </IconButton>
          <ArrowPopper
            placement="bottom"
            open={open}
            anchorEl={anchorEl}
            restrictToParent={false}
            classes={{ popper: classes.applicationsMenuPopper, paper: clsx(classes.applicationsMenuPaperPlaceholder, appsPaper) }}
            id="additionalApps"
            onClose={handleClose}>
            <Applications apps={additionalApps} className={classes.moreLogoStrip} />
          </ArrowPopper>
        </Applications>
      ) : (
        <Applications apps={apps} />
      )}
    </>
  );
}
