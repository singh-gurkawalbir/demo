import React from 'react';
import DynaURI from './DynaURI';

export default function DynaDataURITemplate(props) {
  return (
    <DynaURI
      {...props}
      showLookup={false}
      editorTitle="Build data URI template" />
  );
}
