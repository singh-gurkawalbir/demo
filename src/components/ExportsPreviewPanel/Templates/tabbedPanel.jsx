import React, { useState, useMemo, useCallback } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import ClipBoardPanel from './clipBoardPanel';
import { getBodyHeaderFieldsForPreviewData } from '../../../utils/exportPanel';
import CodeEditor from '../../CodeEditor2';
// import JsonContent from '../../JsonContent';

const useStyles = makeStyles(theme => ({
  sampleDataWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
    marginTop: -18,
  },
  sampleDataContainer: {
    minHeight: theme.spacing(20),
    marginTop: theme.spacing(2),
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    // height: 345,
    overflow: 'auto',
    color: theme.palette.text.primary,
  },
  tabbedPanelTabs: {
    borderBottom: `1px solid ${theme.palette.background.paper2}`,
  },
  codeEditorWrapper: {
    height: '345px',
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
    <div className={classes.sampleDataWrapper}>
      <div className={classes.sampleDataContainer}>
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
        {
          tabContent && (
            <div className={classes.codeEditorWrapper}>
              <CodeEditor
                value={tabContent}
                mode="json"
                readOnly
                showGutter={false}
              />
            </div>
          )
        }

      </div>
      <ClipBoardPanel content={tabContent} />
    </div>
  );
}
