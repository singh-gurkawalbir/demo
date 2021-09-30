import { Button } from '@material-ui/core';
import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../components/drawer/Right';
import DrawerContent from '../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../components/drawer/Right/DrawerFooter';
import DrawerHeader from '../../../components/drawer/Right/DrawerHeader';
import LoadResources from '../../../components/LoadResources';
import { useSelectorMemo } from '../../../hooks';
import { selectors } from '../../../reducers';
import EventReportDetails from './EventReportDetails';

const RowDetails = ({reportType}) => {
  const match = useRouteMatch();
  const {reportId} = match.params;

  const resource = useSelectorMemo(selectors.makeResourceSelector, reportType, reportId);

  if (reportType === 'eventreports') {
    return (
      <EventReportDetails resource={resource} />
    );
  }

  return null;
};

export default function ViewReportDetails() {
  const match = useRouteMatch();
  const {reportType} = match.params;
  const history = useHistory();

  return (

    <RightDrawer path="view/reportDetails/:reportId" >

      <DrawerHeader title="View report details" />
      <DrawerContent noPadding>
        <LoadResources required resources="integrations,flows">
          <RowDetails reportType={reportType} />
        </LoadResources>
      </DrawerContent>
      <DrawerFooter >
        <Button variant="outlined" color="primary" onClick={() => history.goBack()}>Close </Button>
      </DrawerFooter>
    </RightDrawer>
  );
}
