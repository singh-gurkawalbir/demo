import React, {useMemo, useCallback} from 'react';
import { makeStyles, Tabs, Tab } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import {findNodeInTree, getUniqueExtractId} from '../../../../../../utils/mapping';
import {selectors} from '../../../../../../reducers';
import actions from '../../../../../../actions';

const useStyles = makeStyles(theme => ({
  tabComponentRoot: {
    display: 'flex',
    marginLeft: theme.spacing(-9),
  },
  tabsContainer: {
    minWidth: 150,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    marginBottom: theme.spacing(1),
  },
  tab: {
    color: theme.palette.secondary.main,
    fontSize: 14,
  },

}));

function generateTabs(parentNode) {
  const tabs = [];

  if (parentNode?.combinedExtract) {
    const splitExtracts = parentNode.combinedExtract.split(',');

    splitExtracts.forEach((extract, index) => {
      if (!extract) return;

      tabs.push({
        id: getUniqueExtractId(extract, index),
        label: extract,
      });
    });
  }

  return tabs;
}

function TabbedRow({parentKey}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const treeData = useSelector(state => selectors.v2MappingsTreeData(state));
  const parentNode = useMemo(() => (findNodeInTree(treeData, 'key', parentKey)?.node), [parentKey, treeData]);

  const tabs = useMemo(() => generateTabs(parentNode), [parentNode]);

  const handleTabChange = useCallback((event, newValue) => {
    dispatch(actions.mapping.v2.changeArrayTab(parentKey, newValue, tabs[newValue].id));
  }, [dispatch, parentKey, tabs]);

  return (
    <div className={classes.tabComponentRoot}>
      <Tabs
        className={classes.tabsContainer}
        value={parentNode?.activeTab || 0}
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
