import React, { useState, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import ClipBoardPanel from './clipBoardPanel';
import { getBodyHeaderFieldsForPreviewData } from '../../../utils/exportPanel';
import JsonContent from '../../JsonContent';

const useStyles = makeStyles(theme => ({
  sampleDataWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  sampleDataWrapperAlign: {
    marginTop: -18,
  },
  sampleDataContainer: {
    minHeight: theme.spacing(20),
    position: 'relative',
    backgroundColor: 'white',
    maxHeight: 400,
    overflow: 'auto',
    maxWidth: 680,
    color: theme.palette.text.primary,
    '& > div': {
      wordBreak: 'break-word',
    },
  },
  sampleDataContainerAlign: {
    marginTop: theme.spacing(2),
  },
  tabbedPanelTabs: {
    borderBottom: `1px solid ${theme.palette.background.paper2}`,
  },
}));

export default function TabbedPanel(props) {
  const { previewStageDataList, panelType } = props;
  const classes = useStyles();
  const [tabValue, setTabValue] = useState('body');

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  const tabContent = useMemo(() => {
    const { body, headers, others } = getBodyHeaderFieldsForPreviewData(
      previewStageDataList[panelType],
      panelType
    );

    switch (tabValue) {
      case 'body':
        return body;
      case 'header':
        return headers;
      default:
        return others;
    }
  }, [
    tabValue,
    panelType,
    previewStageDataList,
  ]);

  return (
    <div
      className={clsx(
        classes.sampleDataWrapper,
        classes.sampleDataWrapperAlign
      )}>
      <div
        className={clsx(
          classes.sampleDataContainer,
          classes.sampleDataContainerAlign
        )}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          centered
          className={classes.tabbedPanelTabs}
          indicatorColor="primary">
          <Tab
            label="Body"
            value="body"
            id="tab-body"
            aria-controls="tab-body"
          />
          <Tab
            label="Headers"
            value="header"
            id="tab-header"
            aria-controls="tab-header"
          />
          <Tab
            label="Other"
            value="others"
            id="tab-others"
            aria-controls="tab-others"
          />
          )
        </Tabs>
        <div>
          <JsonContent json={tabContent} />
        </div>
      </div>
      <ClipBoardPanel content={tabContent} />
    </div>
  );
}
