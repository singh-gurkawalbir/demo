import clsx from 'clsx';
import { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';
import ArrowPopper from '../ArrowPopper';
import TooltipContent from '../TooltipContent';
import InfoIcon from '../icons/InfoIcon';

const useStyles = makeStyles(theme => ({
  icon: {
    margin: theme.spacing(0, 1),
  },
}));

export default function InfoIconButton({ info, className }) {
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
    <Fragment>
      <IconButton
        data-test="openPageInfo"
        size="small"
        className={clsx(classes.icon, className)}
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
    </Fragment>
  );
}
