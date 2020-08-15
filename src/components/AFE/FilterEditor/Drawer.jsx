import React from 'react';
import EditorDrawer from '../EditorDrawer';
import FilterEditor from './index';

export default function FilterEditorDrawer(props) {
  const { id, rule, data, disabled, ...rest } = props;

  return (
    <EditorDrawer
      id={id}
      {...rest}
      disabled={disabled}
      showLayoutOptions={false}>
      <FilterEditor disabled={disabled} editorId={id} data={data} rule={rule} />
    </EditorDrawer>
  );
}
