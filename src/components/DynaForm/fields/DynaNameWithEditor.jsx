import React from 'react';
import DynaURI from './DynaURI';

export default function DynaNameWithEditor(props) {
  return <DynaURI {...props} showLookup={false} showExtract={false} />;
}
