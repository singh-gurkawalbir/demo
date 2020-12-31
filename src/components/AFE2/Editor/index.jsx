import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { selectors } from '../../../reducers';
import PanelGrid from '../../AFE/PanelGrid';
import ErrorGridItem from './gridItems/ErrorGridItem';
import WarningGridItem from './gridItems/WarningGridItem';
import ConsoleGridItem from './gridItems/ConsoleGridItem';
import SinglePanelGridItem from './gridItems/SinglePanelGridItem';
import TabbedPanelGridItem from './gridItems/TabbedPanelGridItem';
import layouts from './layouts';
import editorMetadata from '../metadata';

function resolveValue(value, editorContext) {
  if (typeof value === 'function') {
    return value(editorContext);
  }

  return value;
}

const useStyles = makeStyles(layouts);

export default function Editor({ editorId }) {
  const classes = useStyles();
  const editorContext = useSelector(state => {
    // we want to remove all volatile fields. If we take the
    // editor state directly, it causes re-renders since its ref changes
    // with any change. Possibly we can create a dedicated selector to
    // return a static editor context object.
    // for now, adding fields as they are used so we understand what part of the
    // editor state is needed to render the editor wire-frame.
    const e = selectors._editor(state, editorId);

    return {
      editorId,
      editorType: e.editorType,
      layout: e.layout,
      activeProcessor: e.activeProcessor,
      autoEvaluate: e.autoEvaluate,
      resultMode: e.resultMode,
      fieldId: e.fieldId,
      formKey: e.formKey,
    };
  }, shallowEqual);

  const {editorType, layout} = editorContext;

  if (!editorType) { return null; }

  const { panels } = editorMetadata[editorType];
  const gridTemplate = classes[resolveValue(layout, editorContext)];

  return (
    <PanelGrid className={gridTemplate}>
      {resolveValue(panels, editorContext).map(p => !p.group
        ? (
          <SinglePanelGridItem
            key={p.area}
            area={p.area}
            title={resolveValue(p.title, editorContext)}>
            <p.Panel editorId={editorId} {...resolveValue(p.props, editorContext)} />
          </SinglePanelGridItem>
        )
        : (
          <TabbedPanelGridItem
            editorId={editorId}
            key={p.area}
            area={p.area}
            panelGroup={p} />
        )
      )}

      <ErrorGridItem editorId={editorId} />
      <WarningGridItem editorId={editorId} />
      <ConsoleGridItem editorId={editorId} />
    </PanelGrid>
  );
}
