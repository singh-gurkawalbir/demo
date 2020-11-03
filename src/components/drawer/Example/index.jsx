import { makeStyles, Button, Typography } from '@material-ui/core';
import React from 'react';
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom';
import RightDrawer from '../Right';
import DrawerHeader from '../Right/DrawerHeader';
import DrawerContent from '../Right/DrawerContent';
import DrawerFooter from '../Right/DrawerFooter';
import ButtonGroup from '../../ButtonGroup';
import Spinner from '../../Spinner';

const useStyles = makeStyles(
  {
    spaceBetween: { flexGrow: 100 },
  });

const rootPath = 'example';

function RouterWrappedContent() {
  const match = useRouteMatch();

  return (
    <>
      <Switch>
        <Route path={`${match.url}/next`}>
          <Typography variant="h2">Next page</Typography>
        </Route>
        <Route path={`${match.url}/last`}>
          <Typography variant="h2">Last page</Typography>
        </Route>
        <Route path={match.url}>
          <Typography variant="h4">Overflow is done automatically.</Typography>
          <Typography>
            DrawerContent child component should not have padding or margins.<br />
            This is controlled by the Drawer components universally.
          </Typography>
        </Route>
      </Switch>

      <br />
      <Link to={`${match.url}/next`}>Next sub-page</Link>
      <br />
      <Link to={`${match.url}/last`}>Final page</Link>
    </>
  );
}

export default function ExampleDrawer() {
  const classes = useStyles();

  return (
    <RightDrawer path={rootPath}>
      <DrawerHeader title="Example Drawer">
        <Spinner size={16} /> Refreshing
        <div className={classes.spaceBetween} />
        <Button variant="text">Normal Action</Button>
      </DrawerHeader>

      <DrawerContent>
        <RouterWrappedContent />
      </DrawerContent>

      <DrawerFooter>
        <ButtonGroup>
          <Button variant="contained" color="primary"> OK </Button>
          <Button variant="text" color="primary"> Cancel </Button>
        </ButtonGroup>

        <div className={classes.spaceBetween} />

        <Button variant="contained" color="secondary"> Preview </Button>
      </DrawerFooter>
    </RightDrawer>
  );
}
