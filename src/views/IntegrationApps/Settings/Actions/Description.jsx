import { Fragment, useState } from 'react';
import { IconButton, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ArrowPopper from '../../../../components/ArrowPopper';
import TooltipContent from '../../../../components/TooltipContent';
import InfoIcon from '../../../../components/icons/InfoIcon';

const useStyles = makeStyles(theme => ({
  pageHeader: {
    zIndex: theme.zIndex.appBar - 1,
    padding: theme.spacing(3),
    height: theme.pageBarHeight,
    width: `calc(100% - ${theme.spacing(2 * 3) + 1}px)`,
    position: 'fixed',
  },
  pageHeaderShift: {
    width: `calc(100% - ${theme.drawerWidth - theme.spacing(2)}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  pageBarOffset: { height: theme.pageBarHeight },
  infoPopper: {
    '& > div': {
      maxWidth: 350,
      textAlign: 'left',
      ' & > p': {
        textTransform: 'none',
      },
    },
  },
}));

export default {
  label: 'Description',
  component: function Description({ resource }) {
    const classes = useStyles();
    const theme = useTheme();
    const infoText = resource.description || 'No description';
    const [anchorEl, setAnchorEl] = useState(null);

    function handleInfoOpen(event) {
      setAnchorEl(event.currentTarget);
    }

    function handleInfoClose() {
      setAnchorEl(null);
    }

    return (
      <Typography variant="h3">
        {infoText && (
          <Fragment>
            <IconButton
              size="small"
              onClick={handleInfoOpen}
              aria-owns={!anchorEl ? null : 'pageInfo'}
              aria-haspopup="true">
              <InfoIcon />
            </IconButton>
            <ArrowPopper
              id="pageInfo"
              className={classes.infoPopper}
              zIndex={theme.zIndex.appBar + 1}
              open={!!anchorEl}
              anchorEl={anchorEl}
              placement="right-start"
              onClose={handleInfoClose}>
              <TooltipContent>{infoText}</TooltipContent>
            </ArrowPopper>
          </Fragment>
        )}
      </Typography>
    );
  },
};
