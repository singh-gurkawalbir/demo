import { Button, Typography } from '@material-ui/core';
import React from 'react';
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom';
import RightDrawer from '../Right';
import DrawerHeader from '../Right/DrawerHeader';
import DrawerContent from '../Right/DrawerContent';
import DrawerFooter from '../Right/DrawerFooter';
import Spinner from '../../Spinner';
import DrawerSubHeader from '../Right/DrawerSubHeader';
import ActionGroup from '../../ActionGroup';

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
  return (
    <RightDrawer path="example" height="tall">
      <DrawerHeader title="Example Drawer">
        <Spinner size="small" /> Refreshing
        <ActionGroup position="right">
          <Button variant="text">Normal Action</Button>
        </ActionGroup>
      </DrawerHeader>
      <DrawerSubHeader>
        <ActionGroup>
          <Button variant="text">Left 1</Button>
          <Button variant="text">Left 2</Button>
        </ActionGroup>
        <ActionGroup position="right">
          <Button variant="text">Right 1</Button>
          <Button variant="text">Right 2</Button>
        </ActionGroup>
      </DrawerSubHeader>
      <DrawerContent>
        <RouterWrappedContent />
      </DrawerContent>

      <DrawerFooter>
        <ActionGroup>
          <Button variant="contained" color="primary"> OK </Button>
          <Button variant="text" color="primary"> Cancel </Button>
        </ActionGroup>

        <ActionGroup position="right">
          <Button variant="contained" color="secondary"> Preview </Button>
        </ActionGroup>
      </DrawerFooter>
    </RightDrawer>
  );
}
