import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import {makeStyles, Typography } from '@material-ui/core';
import ArrowPopper from '../ArrowPopper';
import Applications from './Applications';
import {TextButton} from '../Buttons';

const useStyles = makeStyles({
  applicationsMenuPopper: {
    border: 'none',
  },
  applicationsMenuPaper: {
    right: 60,
  },
  applicationsMenuPaperMax: {
    right: 120,
  },
  applicationsMenuPaperPlaceholder: {
    position: 'relative',
    maxHeight: 160,
    overflowY: 'auto',
  },
  moreLogoStrip: {
    gridTemplateColumns: styleProps => `repeat(${styleProps.additionalAppsCount > styleProps.maxAppsInRow ? styleProps.maxAppsInRow : styleProps.additionalAppsCount}, minmax(40px, 60px))`,
  },
});

export default function LogoStrip({applications}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const applicationsCount = applications?.length;
  const maxApps = 10;
  const maxAppsInRow = 5;
  const apps = applicationsCount > maxApps ? applications.slice(0, maxApps - 1) : applications.slice(0, maxApps);
  const additionalApps = applications.slice(apps.length, applicationsCount);
  const additionalAppsCount = additionalApps.length;
  const styleProps = {
    maxAppsInRow,
    additionalAppsCount,
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
          <TextButton
            data-test="logoStrip"
            aria-label="additional apps"
            aria-controls="additionalApps"
            aria-haspopup="true"
            size="medium"
            onClick={handleClick}>
            <Typography className={classes.appsIconButton}>+ {applicationsCount - apps.length}</Typography>
          </TextButton>
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
