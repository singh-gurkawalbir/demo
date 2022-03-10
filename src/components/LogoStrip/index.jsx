import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {IconButton, makeStyles } from '@material-ui/core';
import ArrowPopper from '../ArrowPopper';
import Applications from './Applications';

export const logoSizes = {
  small: 30,
  medium: 45,
  large: 60,
};

const useStyles = makeStyles(theme => ({
  applicationsMenuPopper: {
    border: 'none',
  },
  applicationsMenuPaper: {
    right: styleProps => styleProps.additionalAppsCount >= styleProps.columns - 1 ? styleProps.pxSize : styleProps.pxSize / 2,
  },
  applicationsMenuPaperMax: {
    right: styleProps => styleProps.pxSize * 1.5,
  },
  applicationsMenuPaperPlaceholder: {
    position: 'relative',
    maxHeight: styleProps => styleProps.pxSize * 4,
    overflowY: 'auto',
  },
  moreLogoStrip: {
    gridTemplateColumns: styleProps => `repeat(${styleProps.additionalAppsCount > styleProps.columns ? styleProps.columns : styleProps.additionalAppsCount}, ${styleProps.pxSize})`,
  },
  logoStripBtn: {
    padding: 0,
    '& >* span': {
      display: 'flex',
      alignItems: 'center',
      fontSize: styleProps => styleProps.pxSize / 2.5,
      color: theme.palette.secondary.main,
    },
  },
}));

export default function LogoStrip(props) {
  const {applications, size, rows, columns} = props;
  const maxItems = rows * columns;
  const [anchorEl, setAnchorEl] = useState(null);
  const applicationsCount = applications?.length || 0;
  const apps = applicationsCount > maxItems ? applications.slice(0, maxItems - 1) : applications.slice(0, maxItems);
  const additionalApps = applications.slice(apps.length, applicationsCount);
  const additionalAppsCount = additionalApps.length;
  const pxSize = logoSizes[size];
  const styleProps = {
    columns,
    additionalAppsCount,
    pxSize,
  };
  const classes = useStyles(styleProps);
  const appsPaper = additionalAppsCount > columns ? classes.applicationsMenuPaperMax : classes.applicationsMenuPaper;

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
      {applicationsCount > maxItems ? (
        <Applications {...props} applications={apps}>
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
            <Applications {...props} applications={additionalApps} className={classes.moreLogoStrip} />
          </ArrowPopper>
        </Applications>
      ) : (
        <Applications {...props} />
      )}
    </>
  );
}

LogoStrip.propTypes = {
  applications: PropTypes.array.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  rows: PropTypes.number,
  columns: PropTypes.number,
};

LogoStrip.defaultProps = {
  size: 'small',
  rows: 2,
  columns: 5,
};
