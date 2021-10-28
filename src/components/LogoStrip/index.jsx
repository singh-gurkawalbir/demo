import React, {useCallback, useState} from 'react';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import ArrowPopper from '../ArrowPopper';
import Applications from './Applications';

const useStyles = makeStyles({
  applicationsMenuPopper: {
    border: 'none',
  },
  applicationsMenuPaper: {
    right: styleProps => styleProps.additionalAppsCount * 20,
    position: 'relative',
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
            aria-label="application logos"
            aria-controls="additionalApps"
            aria-haspopup="true"
            size="small"
            onClick={handleClick}>
            <Typography component="span">+ {applicationsCount - apps.length}</Typography>
          </IconButton>
          <ArrowPopper
            placement="bottom"
            open={open}
            anchorEl={anchorEl}
            restrictToParent={false}
            classes={{ popper: classes.applicationsMenuPopper, paper: classes.applicationsMenuPaper }}
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
