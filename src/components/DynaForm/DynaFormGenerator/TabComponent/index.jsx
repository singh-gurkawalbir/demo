import { useState } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FormGenerator from '../';

const useStyle = makeStyles(theme => ({
  child: {
    flexBasis: 'auto',
  },
  tabsContainer: {
    background: theme.palette.background.default,
    marginBottom: theme.spacing(1),
  },
}));

export default function TabComponent(props) {
  const { containers, fieldMap } = props;
  const classes = useStyle();
  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = containers.map((set, index) => {
    const { label: header } = set;
    const keyIndex = index;

    // eslint-disable-next-line react/no-array-index-key
    return (
      <Tab
        className={classes.child}
        label={header}
        key={`${header}-${keyIndex}`}
      />
    );
  });
  const tabPannels = containers.map((fieldSet, index) => {
    const { label, ...layout } = fieldSet;

    return (
      // eslint-disable-next-line react/no-array-index-key
      <div key={index} className={classes.child}>
        {selectedTab === index && (
          <FormGenerator layout={layout} fieldMap={fieldMap} />
        )}
      </div>
    );
  });

  return (
    <div>
      <Tabs
        value={selectedTab}
        className={classes.tabsContainer}
        variant="scrollable"
        indicatorColor="primary"
        textColor="primary"
        scrollButtons="auto"
        aria-label="Settings Actions"
        onChange={(evt, value) => {
          setSelectedTab(value);
        }}>
        {tabs}
      </Tabs>
      {tabPannels}
    </div>
  );
}
