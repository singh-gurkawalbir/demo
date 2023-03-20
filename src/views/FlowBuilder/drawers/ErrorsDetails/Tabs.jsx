import React, { useCallback } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import InfoIconButton from '../../../../components/InfoIconButton';
import { message } from '../../../../utils/messageStore';
import { useEditRetryConfirmDialog } from '../../../../components/ErrorList/ErrorTable/hooks/useEditRetryConfirmDialog';

const useStyles = makeStyles(theme => ({
  tabContainer: {
    padding: theme.spacing(0, 3),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  tabPanel: {
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: theme.spacing(1, 2),
    overflow: 'visible',
  },
  tab: {
    minWidth: 'auto',
    color: theme.palette.secondary.main,
    fontSize: 14,
  },
  tabInfoIcon: {
    alignItems: 'end',
  },
}));

const RetriesTabLabel = () => {
  const classes = useStyles();

  return (
    <>
      <span>Retries</span>
      <InfoIconButton
        className={classes.tabInfoIcon}
        info={message.RETRY.RETRIES_TAB_INFO} size="xs" placement="right-start"
        preventOverflow={false} />
    </>
  );
};

const tabs = [
  {
    path: 'open',
    label: 'Open errors',
    dataTest: 'flow-builder-open-errors',
  },
  {
    path: 'resolved',
    label: 'Resolved errors',
    dataTest: 'flow-builder-resolved-errors',
  },
  {
    path: 'retries',
    label: (<RetriesTabLabel />),
    dataTest: 'flow-builder-retried-errors',
  }];
export default function ErrorDetailsTabs({flowId, onChange}) {
  const classes = useStyles();
  const match = useRouteMatch();
  const { errorType, resourceId } = match.params;

  const showRetryDataChangedConfirmDialog = useEditRetryConfirmDialog({flowId, resourceId, isResolved: errorType !== 'open'});

  let currentTabIndex = tabs.findIndex(t => t.path === errorType);

  currentTabIndex = currentTabIndex === -1 ? 0 : currentTabIndex;
  const handleTabChange = useCallback(
    (event, newTabIndex) => {
      showRetryDataChangedConfirmDialog(() => {
        const newTab = tabs[newTabIndex].path;

        onChange(newTab);
      });
    },
    [onChange, showRetryDataChangedConfirmDialog]
  );

  return (
    <div className={classes.tabContainer}>
      <Tabs
        value={currentTabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example">
        {tabs.map(({ label, dataTest }, i) => (
          <Tab
            className={classes.tab}
            key={label}
            id={`tab-${i}`}
            {...{ 'aria-controls': `tabpanel-${i}` }}
            label={label}
            data-test={dataTest}
          />
        ))}
      </Tabs>
    </div>
  );
}
