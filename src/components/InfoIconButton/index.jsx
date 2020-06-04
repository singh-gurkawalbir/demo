import clsx from 'clsx';
import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';
import ArrowPopper from '../ArrowPopper';
import TooltipContent from '../TooltipContent';
import InfoIcon from '../icons/InfoIcon';

const useStyles = makeStyles(theme => ({
  small: {
    margin: theme.spacing(0, 1),
  },
  xs: {
    marginTop: theme.spacing(-0.5),
    '& svg': {
      fontSize: '1rem',
    },
  },
}));

export default function InfoIconButton({ info, size = 'small', className }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  function handleInfoOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleInfoClose() {
    setAnchorEl(null);
  }

  if (!info || !info.length) {
    return null;
  }

  return (
    <>
      <IconButton
        data-test="openPageInfo"
        size="small"
        className={clsx(classes[size], className)}
        onClick={handleInfoOpen}
        aria-owns={!anchorEl ? null : 'pageInfo'}
        aria-haspopup="true">
        <InfoIcon />
      </IconButton>
      <ArrowPopper
        id="pageInfo"
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement="right-start"
        onClose={handleInfoClose}>
        <TooltipContent>{info}</TooltipContent>
      </ArrowPopper>
    </>
  );
}
