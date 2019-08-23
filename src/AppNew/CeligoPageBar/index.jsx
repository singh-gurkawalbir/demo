import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import {
  Typography,
  Breadcrumbs,
  Paper,
  Link,
  Grid,
  IconButton,
} from '@material-ui/core';
import ArrowPopper from '../../components/ArrowPopper';
import TooltipContent from '../../components/TooltipContent';
import ElevateOnScroll from '../ElevateOnScroll';
import SlideOnScroll from '../SlideOnScroll';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
  pageHeader: {
    zIndex: theme.zIndex.appBar - 1,
    padding: theme.spacing(1, 3),
    height: theme.pageBarHeight,
    width: `calc(100% - ${theme.spacing(2 * 3) + 1}px)`,
    margin: theme.spacing(-3, -3, 0),
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
            <Breadcrumbs maxItems={3} aria-label="breadcrumb">
              <Link color="inherit" href="/pg">
                Home
              </Link>
              <Link color="inherit" href="/pg">
                Profile
              </Link>
              <Link color="inherit" href="/pg">
                Subscription
              </Link>
              <Typography color="textPrimary">Add-ons</Typography>
            </Breadcrumbs>
            <Grid container justify="space-between">
              <Grid item>
                <Typography variant="h5">
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
                        zIndex={theme.zIndex.appBar - 1}
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
