import { Fragment, useState, useCallback } from 'react';
import clsx from 'clsx';
import { Typography, makeStyles, IconButton } from '@material-ui/core';
import InfoIcon from '../icons/InfoIcon';
import ArrowPopper from '../ArrowPopper';
import TooltipContent from '../TooltipContent';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  infoIcon: {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.hint,
  },
  popperMaxWidthView: {
    maxWidth: props => props.popperMaxWidth,
    textAlign: 'left',
    overflow: 'hidden',
    '& p': {
      textTransform: 'none',
    },
  },
}));

export default function PanelHeader(props) {
  const { title, children, infoText, popperMaxWidth } = props;
  const classes = useStyles({ popperMaxWidth });
  const [anchorEl, setAnchorEl] = useState(null);
  const handleInfoOpen = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleInfoClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <div className={classes.root}>
      <Typography variant="h4">
        {title}
        {infoText && (
          <Fragment>
            <IconButton
              data-test="openPanelInfo"
              size="small"
              className={classes.infoIcon}
              onClick={handleInfoOpen}
              aria-owns={!anchorEl ? null : 'panelInfo'}
              aria-haspopup="true">
              <InfoIcon />
            </IconButton>
            <ArrowPopper
              id="panelInfo"
              open={!!anchorEl}
              anchorEl={anchorEl}
              placement="right-start"
              onClose={handleInfoClose}>
              <TooltipContent
                className={clsx({
                  [classes.popperMaxWidthView]: popperMaxWidth,
                })}>
                {infoText}
              </TooltipContent>
            </ArrowPopper>
          </Fragment>
        )}
      </Typography>
      <div>{children}</div>
    </div>
  );
}
