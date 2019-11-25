import { useState } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FormGenerator from '../';

const useStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  panelContainer: {
    flexGrow: 1,
  },
  tabsContainer: {
    minWidth: 150,
    background: theme.palette.background.default,
    marginRight: theme.spacing(2),
  },
  MuiTabWrapper: {
    justifyContent: 'left',
  },
  MuiTabsIndicator: {
    right: 'unset',
  },
}));

export default function TabComponent(props) {
  const { containers, fieldMap } = props;
  const classes = useStyle();
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className={classes.root}>
      <Tabs
        value={selectedTab}
        classes={{ indicator: classes.MuiTabsIndicator }}
        className={classes.tabsContainer}
        variant="scrollable"
        orientation="vertical"
        indicatorColor="primary"
        textColor="primary"
        scrollButtons="auto"
        aria-label="Settings Actions"
        onChange={(evt, value) => {
          setSelectedTab(value);
        }}>
        {containers.map(({ label }) => (
          <Tab
            classes={{ wrapper: classes.MuiTabWrapper }}
            label={label}
            key={label}
            data-test={label}
          />
        ))}
      </Tabs>
      <div className={classes.panelContainer}>
        {containers.map(({ label, ...layout }, index) => (
          <div key={label}>
            {selectedTab === index && (
              <FormGenerator layout={layout} fieldMap={fieldMap} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
