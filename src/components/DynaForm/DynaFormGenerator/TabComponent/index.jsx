import { useState } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import FormGenerator from '../';

export default function TabComponent(props) {
  const { containers, classes, fieldMap } = props;
  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = containers.map((set, index) => {
    const { label: header } = set;

    // eslint-disable-next-line react/no-array-index-key
    return <Tab className={classes.child} label={header} key={index} />;
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
        onChange={(evt, value) => {
          setSelectedTab(value);
        }}>
        {tabs}
      </Tabs>
      {tabPannels}
    </div>
  );
}
