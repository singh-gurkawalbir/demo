import React, {useMemo, useState, useRef, useCallback} from 'react';
import { makeStyles, Tabs, Tab } from '@material-ui/core';
import {useTreeContext} from './TreeContext';
import {findNode} from './util';

const useStyles = makeStyles(theme => ({
  tabComponentRoot: {
    display: 'flex',
  },

  tabsContainer: {
    minWidth: 150,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    marginBottom: theme.spacing(1),
  },
  tab: {
    // minWidth: 'auto',
    color: theme.palette.secondary.main,
    fontSize: 14,
  },

}));

function generateTabs(treeData, key) {
  const tabs = [
    {
      id: 'All',
      label: 'All',
    },
  ];

  let buildArrayHelper;

  findNode(treeData, key, item => {
    buildArrayHelper = item.buildArrayHelper;
  });

  buildArrayHelper.forEach(obj => {
    const {extract, mappings} = obj;

    if (!mappings || !extract) return;
    tabs.push({
      id: extract,
      label: extract,
    });
  });

  return tabs;
}

function TabbedRow({parentKey}) {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const { treeData, setTreeData } = useTreeContext();

  const parentNode = useMemo(() => treeData.find(node => node.key === parentKey), [parentKey, treeData]);
  const {children} = parentNode || {};
  const ref = useRef(children);

  const tabs = useMemo(() => generateTabs(treeData, parentKey), [parentKey, treeData]);

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
    const newTabExtract = tabs[newValue].label;
    const newTreeData = [...treeData];
    let newChildren = ref.current;

    // loop over children
    // find parentExtract === newTabExtract
    // only keep those in children and setTreeData
    if (newTabExtract !== 'All') {
      newChildren = newChildren.filter(c => c.isTabNode || (c.parentExtract === newTabExtract));
    }

    parentNode.children = newChildren;
    setTreeData(newTreeData);
  }, [parentNode, setTreeData, tabs, treeData]);

  return (
    <div className={classes.tabComponentRoot}>
      <Tabs
        className={classes.tabsContainer}
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto" >
        {tabs.map(({ id, label }) => (
          <Tab
            className={classes.tab}
            key={id}
            label={label}
          />
        ))}
      </Tabs>
    </div>
  );
}

const TabRow = props => (
  <TabbedRow {...props} />
);
export default TabRow;
