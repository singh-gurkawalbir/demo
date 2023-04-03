import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ArrowPopper, Box } from '@celigo/fuse-ui';
import Applications from './Applications';

export const logoSizes = {
  small: 30,
  medium: 45,
  large: 60,
};

const useStyles = makeStyles(theme => ({
  applicationsMenuPaper: {
    right: styleProps => styleProps.additionalAppsCount >= styleProps.columns - 1 ? styleProps.pxSize : styleProps.pxSize / 2,
  },
  applicationsMenuPaperMax: {
    right: styleProps => styleProps.pxSize * 1.5,
  },
  moreLogoStrip: {
    gridTemplateColumns: styleProps => `repeat(${styleProps.additionalAppsCount > styleProps.columns ? styleProps.columns : styleProps.additionalAppsCount}, ${styleProps.pxSize})`,
  },
  logoStripBtn: {
    padding: 0,
    fontSize: theme.spacing(2.5),
    color: theme.palette.secondary.main,
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
            onClick={handleClick}
            size="large">
            <Box display="flex" flexDirection="column" alignItems="center" sx={{height: 24, width: 24}} >+{applicationsCount - apps.length}</Box>
          </IconButton>
          <ArrowPopper
            placement="bottom-end"
            open={open}
            anchorEl={anchorEl}
            sx={{border: 'none'}}
            offset={[10, 0]}
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
