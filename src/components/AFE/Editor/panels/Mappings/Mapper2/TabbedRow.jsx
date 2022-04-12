import React, {useMemo, useState, useCallback} from 'react';
import { makeStyles, Tabs, Tab } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import {isEqual} from 'lodash';
import {findNodeInTree} from '../../../../../../utils/mapping';
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
    // minWidth: 'auto',
    color: theme.palette.secondary.main,
    fontSize: 14,
  },

}));

function generateTabs(treeData, key) {
  const tabs = [];

  const {node} = findNodeInTree(treeData, 'key', key);

  if (node.tabMap) {
    Object.keys(node.tabMap).forEach(index => {
      const extract = node.tabMap[index];
      let label = extract;

      if (extract.startsWith('$_')) {
        label = '$';
      } else if (extract.startsWith('$[*]_')) {
        label = '$[*]';
      }

      tabs.push({
        id: extract,
        label,
      });
    });
  }

  return tabs;
}

function TabbedRow({parentKey}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  // todo ashu use makeselector
  const treeData = useSelector(state => selectors.v2MappingsTreeData(state), isEqual);
  const tabs = useMemo(() => generateTabs(treeData, parentKey), [parentKey, treeData]);

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);

    dispatch(actions.mapping.v2.changeArrayTab(parentKey, newValue));
  }, [dispatch, parentKey]);

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
