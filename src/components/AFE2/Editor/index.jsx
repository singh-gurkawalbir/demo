import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
// import { selectors } from '../../../reducers';
import PanelGrid from '../../AFE/PanelGrid';
import PanelTitle from '../../AFE/PanelTitle';
import PanelGridItem from '../../AFE/PanelGridItem';
import ErrorGridItem from '../../AFE/ErrorGridItem';
import WarningGridItem from '../../AFE/WarningGridItem';
import layouts from './layouts';
import editorMetadata from './metadata';

const useStyles = makeStyles(layouts);

export default function Editor({ editorId }) {
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const type = useSelector(state =>
    'csvParse'
    // return selectors.editor.features(state, editorId).type;
  );
  const {layout, panels} = editorMetadata[type];
  // favor custom template over pre-defined layouts.
  const gridTemplate = classes[layout];

  console.log(panels);

  return (
    <PanelGrid className={gridTemplate}>
      {panels.map(p => (
        <PanelGridItem key={p.area} gridArea={p.area}>
          <PanelTitle title={p.title} />
          <p.Panel editorId={editorId} {...p.props} />
        </PanelGridItem>
      ))}

      <ErrorGridItem editorId={editorId} />
      <WarningGridItem editorId={editorId} />
    </PanelGrid>
  );
}
