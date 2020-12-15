import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { selectors } from '../../../reducers';
import PanelGrid from '../../AFE/PanelGrid';
import PanelTitle from '../../AFE/PanelTitle';
import PanelGridItem from './PanelGridItem';
import ErrorGridItem from './ErrorGridItem';
import WarningGridItem from './WarningGridItem';
import ConsoleGridItem from './ConsoleGridItem';
import layouts from './layouts';
import editorMetadata from '../metadata';

function resolveValue(value, editorContext) {
  if (typeof value === 'function') {
    return value(editorContext);
  }

  return value;
}

const useStyles = makeStyles(layouts);
const usePanelStyles = makeStyles({
  flexContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  title: { flex: '0 0 auto' },
  panel: { flex: '1 1 100px', minHeight: 50 },
});

const useTabStyles = makeStyles(theme => ({
  tabPanel: {
    height: '100%',
  },
  tabs: {
    backgroundColor: theme.palette.common.white,
  },
}));

export default function Editor({ editorId }) {
  const classes = useStyles();
  const editorContext = useSelector(state => {
    // we want to remove all volatile fields. If we take the
    // editor state directly, it causes re-renders since its ref changes
    // with any change. Possibly we can create a dedicated selector to
    // return a static editor context object.
    // for now, adding fields as they are used so we understand what part of the
    // editor state is needed to render the editor wire-frame.
    const {editorType, layout, activeProcessor, autoEvaluate, resultMode} = selectors._editor(state, editorId);

    return {editorType, layout, activeProcessor, autoEvaluate, resultMode};
  }, shallowEqual);

  const {editorType, layout} = editorContext;

  if (!editorType) { return null; }

  const { panels } = editorMetadata[editorType];
  const gridTemplate = classes[resolveValue(layout, editorContext)];

  // console.log(layout, panels);
  const SinglePanel = ({panel: p}) => {
    const classes = usePanelStyles();

    return (
      <div className={classes.flexContainer}>
        <div className={classes.title}>
          <PanelTitle title={resolveValue(p.title, editorContext)} />
        </div>
        <div className={classes.panel}>
          <p.Panel editorId={editorId} {...resolveValue(p.props, editorContext)} />
        </div>
      </div>
    );
  };

  const TabbedPanel = ({panelGroup}) => {
    const classes = useTabStyles();
    const panelClasses = usePanelStyles();
    const [tabValue, setTabValue] = useState(0);

    function handleTabChange(event, newValue) {
      setTabValue(newValue);
    }

    const {
      key: activeKey,
      Panel: ActivePanel,
      props: activePanelProps } = panelGroup.panels[tabValue];

    return (
      <div className={panelClasses.flexContainer}>
        <div className={panelClasses.title}>
          <Tabs
            className={classes.tabs}
            value={tabValue} onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
        >
            {panelGroup.panels.map((p, i) => (
              <Tab
                label={p.name}
                value={i}
                id={`tab-${p.key}`} key={p.key}
                aria-controls={`tabpanel-${p.key}`}
        />
            ))}
          </Tabs>
        </div>
        <div className={panelClasses.panel}>

          <div
            role="tabpanel"
            id={`tabpanel-${activeKey}`}
            aria-labelledby={`tab-${tabValue}`}
            className={classes.tabPanel}>
            <ActivePanel
              editorId={editorId}
              {...resolveValue(activePanelProps, editorContext)}
          />
          </div>
        </div>
      </div>
    );
  };

  return (
    <PanelGrid className={gridTemplate}>
      {resolveValue(panels, editorContext).map(p => (
        <PanelGridItem key={p.area} gridArea={p.area}>
          {!p.group
            ? <SinglePanel panel={p} />
            : <TabbedPanel panelGroup={p} />}
        </PanelGridItem>
      ))}

      <ErrorGridItem editorId={editorId} />
      <WarningGridItem editorId={editorId} />
      <ConsoleGridItem editorId={editorId} />
    </PanelGrid>
  );
}
