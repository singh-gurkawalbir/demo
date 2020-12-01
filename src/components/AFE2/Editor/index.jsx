import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import { selectors } from '../../../reducers';
import PanelGrid from '../../AFE/PanelGrid';
import PanelTitle from '../../AFE/PanelTitle';
import PanelGridItem from '../../AFE/PanelGridItem';
import ErrorGridItem from './ErrorGridItem';
import WarningGridItem from './WarningGridItem';
import ConsoleGridItem from './ConsoleGridItem';
import layouts from './layouts';
import editorMetadata from './metadata';

function resolveValue(value, editor) {
  if (typeof value === 'function') {
    return value(editor);
  }

  return value;
}

const useStyles = makeStyles(layouts);
const useTabStyles = makeStyles({
  tabPanel: {
    height: '100%',
  },
});

export default function Editor({ editorId, ...rest }) {
  const classes = useStyles();
  const editor = useSelector(state => selectors._editor(state, editorId));
  const {processor: type, layout} = editor;

  if (!type) { return null; }

  const { panels } = editorMetadata[type];
  const gridTemplate = classes[resolveValue(layout, editor)];

  // console.log(layout, panels);
  const SinglePanel = ({panel: p}) => (
    <>
      <PanelTitle title={resolveValue(p.title, editor)} />
      <p.Panel editorId={editorId} {...p.props} {...rest} />
    </>
  );

  const TabbedPanel = ({panelGroup}) => {
    const classes = useTabStyles();
    const [tabValue, setTabValue] = useState(0);

    function handleTabChange(event, newValue) {
      setTabValue(newValue);
    }

    const {
      key: activeKey,
      Panel: ActivePanel,
      props: activePanelProps } = panelGroup.panels[tabValue];

    return (
      <>
        <Tabs
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

        <div
          role="tabpanel"
          id={`tabpanel-${activeKey}`}
          aria-labelledby={`tab-${tabValue}`}
          className={classes.tabPanel}>
          <ActivePanel editorId={editorId} {...activePanelProps} {...rest} />
        </div>
      </>
    );
  };

  return (
    <PanelGrid className={gridTemplate}>
      {resolveValue(panels, editor).map(p => (
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
