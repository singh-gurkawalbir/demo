import React, { Fragment } from 'react';
import EditorDialog from '../EditorDialog';
import HttpRequestBodyEditor from './';

export default function HttpRequestBodyDialog(props) {
  const { id, rule, data, ...rest } = props;
  const defaults = {
    layout: 'compact',
    width: '80vw',
    height: '50vh',
    open: true,
  };

  return (
    <EditorDialog id={id} {...defaults} {...rest}>
      <Fragment>
        {props.children}
        <HttpRequestBodyEditor editorId={id} rule={rule} data={data} />
      </Fragment>
    </EditorDialog>
  );
}
