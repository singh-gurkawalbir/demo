import { Fragment, useState, useCallback } from 'react';
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
    maxWidth: 350,
    textAlign: 'left',
    overflow: 'hidden',
    '& p': {
      textTransform: 'none',
    },
  },
}));

export default function PanelHeader(props) {
  const { title, children, infoText } = props;
  const classes = useStyles();
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
              <TooltipContent className={classes.popperMaxWidthView}>
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
