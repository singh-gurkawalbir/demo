import React from 'react';
import EditorDialog from '../EditorDialog';
import QueryBuilder from './index';

export default function QueryBuilderDialog(props) {
  const { id, rule, data, ...rest } = props;
  const defaults = {
    width: '85vw',
    height: '60vh',
    layout: 'column',
    open: true,
  };

  return (
    <EditorDialog id={id} {...defaults} {...rest} showLayoutOptions={false}>
      <QueryBuilder editorId={id} data={data} rule={rule} />
    </EditorDialog>
  );
}
