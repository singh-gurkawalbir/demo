import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import {IconButton, makeStyles } from '@material-ui/core';
import ArrowPopper from '../ArrowPopper';
import Applications from './Applications';
import { APP_WIDTH, MAX_APPLICATIONS, MAX_APPLICATIONS_IN_A_ROW } from '../../utils/constants';

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

const emptyArr = [];
export default function LogoStrip({applications = emptyArr}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const applicationsCount = applications?.length || 0;
  const apps = applicationsCount > MAX_APPLICATIONS ? applications.slice(0, MAX_APPLICATIONS - 1) : applications.slice(0, MAX_APPLICATIONS);
  const additionalApps = applications.slice(apps.length, applicationsCount);
  const additionalAppsCount = additionalApps.length;
  const styleProps = {
    maxAppsInRow: MAX_APPLICATIONS_IN_A_ROW,
    additionalAppsCount,
    appWidth: APP_WIDTH,
  };
  const classes = useStyles(styleProps);
  const appsPaper = additionalAppsCount > MAX_APPLICATIONS_IN_A_ROW ? classes.applicationsMenuPaperMax : classes.applicationsMenuPaper;

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
      {applicationsCount > MAX_APPLICATIONS ? (
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
