import React from 'react';
import HttpRequestBodyEditor from '.';
import HandlebarEditorDialog from '../HandlebarEditorDialog';

export default function HttpRequestBodyDialog(props) {
  const {
    id,
    rule,
    data,
    contentType,
    lookups = [],
    disabled,
    isSampleDataLoading,
    editorVersion,
    ...rest
  } = props;
  const defaults = {
    layout: 'compact',
    width: '80vw',
    height: '50vh',
    open: true,
  };

  return (
    <HandlebarEditorDialog
      id={id}
      {...defaults}
      {...rest}
      disabled={disabled}
      editorVersion={editorVersion}>
      <HttpRequestBodyEditor
        contentType={contentType}
        editorId={id}
        lookups={lookups}
        rule={rule}
        data={data}
        isSampleDataLoading={isSampleDataLoading}
        disabled={disabled}
      />
    </HandlebarEditorDialog>
  );
}
