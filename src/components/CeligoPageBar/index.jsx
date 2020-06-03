import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Paper, Grid, IconButton } from '@material-ui/core';
import ElevateOnScroll from '../ElevateOnScroll';
import SlideOnScroll from '../SlideOnScroll';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import * as selectors from '../../reducers';
import InfoIconButton from '../InfoIconButton';
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
  emptySpace: {
    flexGrow: 1,
    minWidth: theme.spacing(10),
  },
  title: {
    minWidth: 70,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  bannerOffset: {
    height: theme.pageBarHeight + 58,
  },
  subTitleShift: {
    marginLeft: theme.spacing(4),
  },
}));

export default function CeligoPageBar(props) {
  const {
    history,
    children,
    title,
    infoText,
    subtitle,
    titleTag,
    className,
  } = props;
  const classes = useStyles();
  const location = useLocation();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const bannerOpened = useSelector(state => selectors.bannerOpened(state));
  const showBanner = location.pathname.includes('pg/dashboard') && bannerOpened;

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

            <Grid item container wrap="nowrap">
              {history && (
                // eslint-disable-next-line react/jsx-handler-names
                <IconButton size="small" onClick={history.goBack}>
                  <ArrowLeftIcon />
                </IconButton>
              )}
              <Typography className={classes.title} variant="h3">
                {title}
              </Typography>
              {titleTag && <span>{titleTag}</span>}
              {infoText && <InfoIconButton info={infoText} />}
              <div className={classes.emptySpace} />
              {children}
            </Grid>
            <Typography
              variant="caption"
              className={clsx({ [classes.subTitleShift]: history })}>
              {subtitle}
            </Typography>
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
