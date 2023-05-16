import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FilledButton } from '@celigo/fuse-ui';
import RightDrawer from '../../../components/drawer/Right';
import DrawerContent from '../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../components/drawer/Right/DrawerFooter';
import DrawerHeader from '../../../components/drawer/Right/DrawerHeader';
import LoadResources from '../../../components/LoadResources';
import { useSelectorMemo } from '../../../hooks';
import { selectors } from '../../../reducers';
import { drawerPaths } from '../../../utils/rightDrawer';
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

    <RightDrawer path={drawerPaths.ACCOUNT.VIEW_REPORT_DETAILS} >
      <DrawerHeader title="View report details" />
      <DrawerContent noPadding>
        <LoadResources required resources="integrations,flows">
          <RowDetails reportType={reportType} />
        </LoadResources>
      </DrawerContent>
      <DrawerFooter >
        <FilledButton onClick={() => history.goBack()}>Close </FilledButton>
      </DrawerFooter>
    </RightDrawer>
  );
}
