import React, {useCallback, useState} from 'react';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import ArrowPopper from '../ArrowPopper';
import Applications from './Applications';

const useStyles = makeStyles({
  applicationsMenuPopper: {
    border: 'none',
  },
  applicationsMenuPaper: {
    right: restAppsCount => `calc(${60} * ${restAppsCount})`,
    position: 'relative',
  },
  moreLogoStrip: {
    gridTemplateColumns: restAppsCount => `repeat(${restAppsCount > 5 ? 5 : restAppsCount}, minmax(40px, 60px))`,
  },
});

export default function LogoStrip({applications}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const applicationsCount = applications?.length;
  const initialApps = applications.slice(0, 9);
  const restApps = applications.slice(9, applicationsCount);
  const restAppsCount = restApps.length;
  const classes = useStyles(restAppsCount);

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
      {applicationsCount >= 10 ? (
        <Applications apps={initialApps}>
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
            placement="bottom"
            open={open}
            anchorEl={anchorEl}
            restrictToParent={false}
            classes={{ popper: classes.applicationsMenuPopper, paper: classes.applicationsMenuPaper }}
            id="openDrop"
            onClose={handleClose}>
            <Applications apps={restApps} className={classes.moreLogoStrip} />
          </ArrowPopper>
        </Applications>
      ) : (
        <Applications apps={initialApps} />
      )}
    </>
  );
}
