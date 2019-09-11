import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { Typography, Paper, Grid, IconButton } from '@material-ui/core';
import ArrowPopper from '../ArrowPopper';
import TooltipContent from '../TooltipContent';
import ElevateOnScroll from '../ElevateOnScroll';
import SlideOnScroll from '../SlideOnScroll';
import * as selectors from '../../reducers';

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
}));

export default function CeligoPageBar({ children, title, infoText }) {
  const classes = useStyles();
  const theme = useTheme();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const [anchorEl, setAnchorEl] = useState(null);

  function handleInfoOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleInfoClose() {
    setAnchorEl(null);
  }

  return (
    <Fragment>
      <SlideOnScroll threshold={250}>
        <ElevateOnScroll threshold={0}>
          <Paper
            className={clsx(classes.pageHeader, {
              [classes.pageHeaderShift]: drawerOpened,
            })}
            elevation={0}
            square>
            <Grid container justify="space-between">
              <Grid item>
                <Typography variant="h3">
                  {title}
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
                        zIndex={theme.zIndex.appBar + 1}
                        open={!!anchorEl}
                        anchorEl={anchorEl}
                        placement="right"
                        onClose={handleInfoClose}>
                        <TooltipContent>{infoText}</TooltipContent>
                      </ArrowPopper>
                    </Fragment>
                  )}
                </Typography>
              </Grid>
              <Grid item>{children}</Grid>
            </Grid>
          </Paper>
        </ElevateOnScroll>
      </SlideOnScroll>
      <div className={classes.pageBarOffset} />
    </Fragment>
  );
}
