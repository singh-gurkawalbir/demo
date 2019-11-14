import React from 'react';
import EditorDialog from '../EditorDialog';
import FilterEditor from './index';

export default function FilterEditorDialog(props) {
  const { id, rule, data, disabled, ...rest } = props;
  const defaults = {
    width: '85vw',
    height: '60vh',
    layout: 'column',
    open: true,
  };

  return (
    <EditorDialog
      id={id}
      {...defaults}
      {...rest}
      disabled={disabled}
      showLayoutOptions={false}>
      <FilterEditor disabled={disabled} editorId={id} data={data} rule={rule} />
    </EditorDialog>
  );
}
