import React from 'react';
import DynaURI from './DynaURI';

export default function DynaConcurrencyIdLockTemplate(props) {
  return (
    <DynaURI
      {...props}
      showExtract={false}
      showLookup={false}
      editorTitle="Build concurrency ID lock template"
    />
  );
}
