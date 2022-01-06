import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import {IconButton, makeStyles } from '@material-ui/core';
import ArrowPopper from '../ArrowPopper';
import Applications from './Applications';
import { MAX_APPLICATIONS, MAX_APPLICATIONS_IN_A_ROW } from '../../utils/constants';

const useStyles = makeStyles(theme => ({
  applicationsMenuPopper: {
    border: 'none',
  },
  applicationsMenuPaper: {
    right: styleProps => styleProps.additionalAppsCount >= 3 ? styleProps.logoSizeApp : styleProps.logoSizeApp / 2,
  },
  applicationsMenuPaperMax: {
    right: styleProps => styleProps.logoSizeApp * 2,
  },
  applicationsMenuPaperPlaceholder: {
    position: 'relative',
    maxHeight: styleProps => styleProps.logoSizeApp * 4,
    overflowY: 'auto',
  },
  moreLogoStrip: {
    gridTemplateColumns: styleProps => `repeat(${styleProps.additionalAppsCount > styleProps.maxAppsInRow ? styleProps.maxAppsInRow : styleProps.additionalAppsCount}, ${styleProps.logoSizeApp})`,
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
export const logoSizes = {
  small: 30,
  medium: 45,
  large: 60,
};
export default function LogoStrip({applications = emptyArr, logoSize = 'small'}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const applicationsCount = applications?.length || 0;
  const apps = applicationsCount > MAX_APPLICATIONS ? applications.slice(0, MAX_APPLICATIONS - 1) : applications.slice(0, MAX_APPLICATIONS);
  const additionalApps = applications.slice(apps.length, applicationsCount);
  const additionalAppsCount = additionalApps.length;
  const logoSizeApp = logoSizes[logoSize];
  const styleProps = {
    maxAppsInRow: MAX_APPLICATIONS_IN_A_ROW,
    additionalAppsCount,
    logoSizeApp,
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
        <Applications apps={apps} logoSize={logoSize}>
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
            <Applications apps={additionalApps} className={classes.moreLogoStrip} logoSize={logoSize} />
          </ArrowPopper>
        </Applications>
      ) : (
        <Applications apps={apps} logoSize={logoSize} />
      )}
    </>
  );
}
