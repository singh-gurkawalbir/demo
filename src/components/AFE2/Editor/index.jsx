import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
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

export default function Editor({ editorId }) {
  const classes = useStyles();
  let editor = useSelector(state => selectors.editor(state, editorId));

  // hardcode editor for now until data layer is connected..
  editor = { type: 'formBuilder', mode: 'json' };
  const {type} = editor;
  const {layout, panels} = editorMetadata[type];
  const gridTemplate = classes[resolveValue(layout, editor)];

  // console.log(layout, panels);

  return (
    <PanelGrid className={gridTemplate}>
      {resolveValue(panels, editor).map(p => (
        <PanelGridItem key={p.area} gridArea={p.area}>
          <PanelTitle title={resolveValue(p.title, editor)} />
          <p.Panel editorId={editorId} {...p.props} />
        </PanelGridItem>
      ))}

      <ErrorGridItem editorId={editorId} />
      <WarningGridItem editorId={editorId} />
      <ConsoleGridItem editorId={editorId} />
    </PanelGrid>
  );
}
