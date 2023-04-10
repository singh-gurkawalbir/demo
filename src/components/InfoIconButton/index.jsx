import { IconButton } from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import React, { useState } from 'react';

import ArrowPopper from '../ArrowPopper';
import HelpContent from '../HelpContent';
import InfoIcon from '../icons/InfoIcon';
import TooltipContent from '../TooltipContent';

const useStyles = makeStyles(theme => ({
  small: {
    margin: theme.spacing(0, 1),
  },
  infoText: {
    color: theme.palette.secondary.main,
  },
  xs: {
    marginTop: theme.spacing(-0.5),
    width: theme.spacing(3),
    height: theme.spacing(3),
    '& >* svg': {
      fontSize: theme.spacing(2),
    },
  },
}));

export default function InfoIconButton({
  info,
  size = 'small',
  className,
  escapeUnsecuredDomains,
  tabIndex = 0,
  placement = 'right-start',
  preventOverflow,
  title,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  function handleInfoOpen(event) {
    event.stopPropagation();
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
        tabIndex={tabIndex}
        aria-haspopup="true"
      >
        <InfoIcon />
      </IconButton>
      <ArrowPopper
        id="pageInfo"
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement={placement}
        onClose={handleInfoClose}
        onClick={e => { e.stopPropagation(); }}
        preventOverflow={preventOverflow}
      >
        <HelpContent
          title={title}
          supportFeedback={false}
          onClose={handleInfoClose}
        >
          <TooltipContent
            className={classes.infoText}
            escapeUnsecuredDomains={escapeUnsecuredDomains}
          >
            {info}
          </TooltipContent>
        </HelpContent>
      </ArrowPopper>
    </>
  );
}
