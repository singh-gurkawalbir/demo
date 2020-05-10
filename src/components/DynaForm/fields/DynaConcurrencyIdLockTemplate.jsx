import DynaRelativeUri from './DynaRelativeUri';

export default function DynaConcurrencyIdLockTemplate(props) {
  return (
    <DynaRelativeUri
      {...props}
      showExtract={false}
      showLookup={false}
      editorTitle="Build concurrency id lock template"
    />
  );
}
