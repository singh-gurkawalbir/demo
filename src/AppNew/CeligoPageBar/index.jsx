import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Breadcrumbs,
  Paper,
  Link,
  Grid,
  Button,
} from '@material-ui/core';
import CeligoIconButton from '../../components/IconButton';
import AddIcon from '../../components/icons/AddIcon';
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

export default function CeligoPageBar({ title }) {
  const classes = useStyles();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

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
                <Typography variant="h5">{title}</Typography>
              </Grid>
              <Grid item>
                <Button variant="text">
                  <AddIcon /> Create integration
                </Button>
                <CeligoIconButton variant="text">
                  <AddIcon /> Install Zip
                </CeligoIconButton>
              </Grid>
            </Grid>
          </Paper>
        </ElevateOnScroll>
      </SlideOnScroll>
      <div className={classes.pageBarOffset} />
    </Fragment>
  );
}
