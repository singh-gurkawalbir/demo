import React from 'react';
import UrlEditor from '.';
import AFE2EditorDialog from '../AFE2EditorDialog';

export default function UrlEditorDialog(props) {
  const {
    id,
    isSampleDataLoading,
    rule,
    lookups = [],
    data,
    disabled,
    ...rest
  } = props;
  const defaults = {
    layout: 'compact',
    width: '70vw',
    height: '55vh',
    open: true,
  };

  return (
    <AFE2EditorDialog
      id={id}
      {...defaults}
      {...rest}
      disabled={disabled}
      showFullScreen>
      <UrlEditor
        lookups={lookups}
        disabled={disabled}
        editorId={id}
        rule={rule}
        data={data}
        isSampleDataLoading={isSampleDataLoading}
      />
    </AFE2EditorDialog>
  );
}
