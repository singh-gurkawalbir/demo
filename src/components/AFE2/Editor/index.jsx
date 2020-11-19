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

export default function Editor({ editorId, ...rest }) {
  const classes = useStyles();
  const editor = useSelector(state => selectors._editor(state, editorId));
  const {processor: type} = editor;

  if (!type) { return null; }

  const {layout, panels} = editorMetadata[type];
  const gridTemplate = classes[resolveValue(layout, editor)];

  // console.log(layout, panels);

  return (
    <PanelGrid className={gridTemplate}>
      {resolveValue(panels, editor).map(p => (
        <PanelGridItem key={p.area} gridArea={p.area}>
          <PanelTitle title={resolveValue(p.title, editor)} />
          <p.Panel editorId={editorId} {...p.props} {...rest} />
        </PanelGridItem>
      ))}

      <ErrorGridItem editorId={editorId} />
      <WarningGridItem editorId={editorId} />
      <ConsoleGridItem editorId={editorId} />
    </PanelGrid>
  );
}
