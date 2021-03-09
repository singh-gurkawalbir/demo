import React, { useState, useCallback } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import ClipBoardPanel from '../ClipboardPanel';
import CodeEditor from '../../../CodeEditor2';

const useStyles = makeStyles(theme => ({
  panelContainer: {
    minHeight: theme.spacing(20),
    marginTop: theme.spacing(2),
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    color: theme.palette.text.primary,
  },
  panelTabs: {
    borderBottom: `1px solid ${theme.palette.background.paper2}`,
  },
  codeEditorWrapper: {
    height: props => props.height || 345,
    paddingTop: theme.spacing(1),
  },
}));

export default function RequestResponsePanel({ value = {}, hideClipboard = false, height }) {
  const classes = useStyles({ height });
  const [tabValue, setTabValue] = useState('body');

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  return (
    <>
      <div className={classes.panelContainer}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          centered
          className={classes.panelTabs}
          indicatorColor="primary">
          <Tab
            label="Body"
            value="body"
            id="tab-body"
            aria-controls="tab-body"
          />
          <Tab
            label="Headers"
            value="headers"
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
          value[tabValue] && (
            <div className={classes.codeEditorWrapper}>
              <CodeEditor
                value={value[tabValue]}
                mode="json"
                readOnly
                showGutter={false}
              />
            </div>
          )
        }

      </div>
      { !hideClipboard && <ClipBoardPanel content={value[tabValue]} /> }
    </>
  );
}
