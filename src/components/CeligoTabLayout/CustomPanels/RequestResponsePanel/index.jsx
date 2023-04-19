import React, { useState, useCallback, useMemo } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import makeStyles from '@mui/styles/makeStyles';
import DefaultPanel from '../DefaultPanel';
import { getErrorReqResFields, getContentType } from '../../../../utils/http';

const useStyles = makeStyles(theme => ({
  panelContainer: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    marginTop: theme.spacing(2),
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
  panelTabs: {
    borderBottom: `1px solid ${theme.palette.background.paper2}`,
    '& .MuiTab-root': {
      minWidth: theme.spacing(20),
    },
  },
}));

export default function RequestResponsePanel({ value = {}, hideClipboard = false, variant}) {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState('body');

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  const bodyHeaderFields = useMemo(() => getErrorReqResFields(value, variant), [value, variant]);

  const contentType = getContentType(value);

  return (
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
      <DefaultPanel
        isLoggable={false}
        value={bodyHeaderFields[tabValue]}
        hideClipboard={hideClipboard}
        contentType={tabValue === 'body' ? contentType : 'json'}
        />
    </div>
  );
}
