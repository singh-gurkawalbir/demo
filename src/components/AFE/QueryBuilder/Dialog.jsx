import React from 'react';
import EditorDialog from '../EditorDialog';
import QueryBuilder from './index';

function QueryBuilderDialog(props) {
  const defaults = {
    width: '80vw',
    height: '50vh',
    open: true,
  };
  const { id, rule, sampleData, defaultData, ...rest } = props;

  return (
    <EditorDialog
      id={id}
      {...defaults}
      {...rest}
      showLayoutOptions={false}
      showFullScreen>
      <QueryBuilder />
    </EditorDialog>
  );
}

export default QueryBuilderDialog;
