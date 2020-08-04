import React from 'react';
import EditorDrawer from '../EditorDrawer';
import FilterEditor from './index';

export default function FilterEditorDrawer(props) {
  const { id, rule, data, disabled, ...rest } = props;
  const defaults = {
    width: '85vw',
    height: '60vh',
    layout: 'compact',
    open: true,
  };

  return (
    <EditorDrawer
      id={id}
      {...defaults}
      {...rest}
      disabled={disabled}
      showLayoutOptions={false}>
      <FilterEditor disabled={disabled} editorId={id} data={data} rule={rule} />
    </EditorDrawer>
  );
}
