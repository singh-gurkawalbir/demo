import React from 'react';
import EditorDialog from '../EditorDialog';
import FilterEditor from './index';

export default function FilterEditorDialog(props) {
  const { id, rule, data, ...rest } = props;
  const defaults = {
    width: '85vw',
    height: '60vh',
    layout: 'column',
    open: true,
  };

  return (
    <EditorDialog id={id} {...defaults} {...rest} showLayoutOptions={false}>
      <FilterEditor editorId={id} data={data} rule={rule} />
    </EditorDialog>
  );
}
