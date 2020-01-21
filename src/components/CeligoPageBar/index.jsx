import { Fragment, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Paper, Grid, IconButton } from '@material-ui/core';
import ArrowPopper from '../ArrowPopper';
import TooltipContent from '../TooltipContent';
import ElevateOnScroll from '../ElevateOnScroll';
import SlideOnScroll from '../SlideOnScroll';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import * as selectors from '../../reducers';
import InfoIcon from '../icons/InfoIcon';
import WelcomeBanner from './WelcomeBanner';

const useStyles = makeStyles(theme => ({
  pageHeader: {
    zIndex: theme.zIndex.appBar - 1,
    padding: theme.spacing(3),
    height: theme.pageBarHeight,
    width: `calc(100% - ${theme.spacing(2 * 3) + 4}px)`,
    position: 'fixed',
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  pageHeaderShift: {
    width: `calc(100% - ${theme.drawerWidth - theme.spacing(1)}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  pageBarOffset: { height: theme.pageBarHeight },
  // TODO: Azhar, is there a cleaner way than for me to set the style of
  // the child div? Maybe the paper container should set the maxWidth?
  infoPopper: {
    // maxWidth: 320, // <- this only sets the container, but the child is constrained
    // by the value override below...
    '& > div': {
      maxWidth: 350,
      overflow: 'hidden',
      textAlign: 'left',
      ' & > p': {
        textTransform: 'none',
      },
    },
  },
  subTitle: {
    float: 'left',
  },
  bannerOffset: {
    height: theme.pageBarHeight + 66,
  },
}));

export default function CeligoPageBar({
  history,
  children,
  title,
  infoText,
  subtitle,
  titleTag,
  className,
}) {
  const classes = useStyles();
  const location = useLocation();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const bannerOpened = useSelector(state => selectors.bannerOpened(state));
  const [anchorEl, setAnchorEl] = useState(null);
  const handleInfoOpen = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleInfoClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const showBanner = location.pathname.endsWith('pg/dashboard') && bannerOpened;

  return (
    <Fragment>
      <SlideOnScroll threshold={250}>
        <ElevateOnScroll threshold={0}>
          <Paper
            className={clsx(classes.pageHeader, className, {
              [classes.pageHeaderShift]: drawerOpened,
              [classes.bannerOffset]: showBanner,
            })}
            elevation={0}
            square>
            {showBanner && <WelcomeBanner />}

            <Grid container justify="space-between">
              <Grid item>
                <Typography variant="h3">
                  {history && (
                    // eslint-disable-next-line react/jsx-handler-names
                    <IconButton onClick={history.goBack}>
                      <ArrowLeftIcon />
                    </IconButton>
                  )}
                  {title}
                  {titleTag && <span>{titleTag}</span>}
                  {infoText && (
                    <Fragment>
                      <IconButton
                        data-test="openPageInfo"
                        size="small"
                        onClick={handleInfoOpen}
                        aria-owns={!anchorEl ? null : 'pageInfo'}
                        aria-haspopup="true">
                        <InfoIcon />
                      </IconButton>
                      <ArrowPopper
                        id="pageInfo"
                        className={classes.infoPopper}
                        open={!!anchorEl}
                        anchorEl={anchorEl}
                        placement="right-start"
                        onClose={handleInfoClose}>
                        <TooltipContent>{infoText}</TooltipContent>
                      </ArrowPopper>
                    </Fragment>
                  )}
                </Typography>
                <Typography variant="caption" className={classes.subTitle}>
                  {subtitle}
                </Typography>
              </Grid>
              <Grid item>{children}</Grid>
            </Grid>
          </Paper>
        </ElevateOnScroll>
      </SlideOnScroll>
      <div
        className={clsx(classes.pageBarOffset, {
          [classes.bannerOffset]: showBanner,
        })}
      />
    </Fragment>
  );
}
