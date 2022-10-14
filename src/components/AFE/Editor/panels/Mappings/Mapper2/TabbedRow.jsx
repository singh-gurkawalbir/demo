import React, {useMemo, useCallback} from 'react';
import { makeStyles, Tabs, Tab, Tooltip } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import {findNodeInTree, getExtractFromUniqueId} from '../../../../../../utils/mapping';
import {selectors} from '../../../../../../reducers';
import actions from '../../../../../../actions';

const useStyles = makeStyles(theme => ({
  tabComponentRoot: {
    display: 'flex',
    marginLeft: theme.spacing(-5),
  },
  tabsContainer: {
    minWidth: 150,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    marginBottom: theme.spacing(1),
  },
  tab: {
    color: theme.palette.secondary.main,
    fontSize: 14,
    maxWidth: 'none',
  },
}));

function generateTabs(parentNode) {
  const tabs = [];
  let anyExtractHasMappings = false;

  if (parentNode?.extractsArrayHelper) {
    parentNode.extractsArrayHelper.forEach(extractConfig => {
      if (!extractConfig.extract) return;
      if (extractConfig.copySource !== 'yes') {
        anyExtractHasMappings = true;
      }

      const shouldDisableTab = parentNode.extractsWithoutMappings?.includes(extractConfig.extract);

      tabs.push({
        id: extractConfig.extract,
        label: getExtractFromUniqueId(extractConfig.extract),
        disabled: (extractConfig.copySource === 'yes') || shouldDisableTab,
        disabledInfo: shouldDisableTab ? 'No matching fields in this tab' : 'No fields need to be configured because this source has the setting "Copy an object array from the source as-is" set to "Yes".',
      });
    });
  }

  // if all sources have copy source setting as yes, then no tab is shown
  if (!anyExtractHasMappings) return [];

  return tabs;
}

function TabbedRow({parentKey}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const treeData = useSelector(state => selectors.filteredV2TreeData(state).filteredTreeData);
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
        {tabs.map(({ id, label, disabled, disabledInfo }) =>
          disabled ? (
            <Tooltip
              key={id}
              title={disabled ? disabledInfo : ''}
              placement="bottom">
              {/* this div needs to be added to render the tooltip correctly */}
              <div>
                <Tab
                  className={classes.tab}
                  key={id}
                  label={label}
                  disabled={disabled} />
              </div>
            </Tooltip>
          )
            : (
              <Tab
                className={classes.tab}
                key={id}
                label={label} />
            )
        )}
      </Tabs>
    </div>
  );
}

const TabRow = props => (
  <TabbedRow {...props} />
);
export default TabRow;
