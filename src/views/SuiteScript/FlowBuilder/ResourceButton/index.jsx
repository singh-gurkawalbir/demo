import React from 'react';
import ExportIcon from '../../../../components/icons/ExportsIcon';
import DataLoaderIcon from '../../../../components/icons/DataLoaderIcon';
import ListenerIcon from '../../../../components/icons/ListenerIcon';
import ImportIcon from '../../../../components/icons/ImportsIcon';
import TransferDownIcon from '../../../../components/icons/TransferDownIcon';
import TransferUpIcon from '../../../../components/icons/TransferUpIcon';
import { TextButton } from '../../../../components/Buttons';
import { resourceButtonStyles } from '../../../FlowBuilder/ResourceButton';

const blockMap = {
  export: { label: 'Export', Icon: ExportIcon },
  import: { label: 'Import', Icon: ImportIcon },
  listener: { label: 'Listener', Icon: ListenerIcon },
  dataLoader: { label: 'Data Loader', Icon: DataLoaderIcon },
  exportTransfer: { label: 'Transfer', Icon: TransferDownIcon },
  importTransfer: { label: 'Transfer', Icon: TransferUpIcon },
};

export default function ResourceButton({ onClick, variant = 'export', isFileTransfer }) {
  const classes = resourceButtonStyles();
  const block = blockMap[isFileTransfer ? `${variant}Transfer` : variant];

  return (
    <TextButton
      className={classes.resourceButton}
      data-test={block.label}
      startIcon={<block.Icon />}
      onClick={onClick}>
      {block.label}
    </TextButton>
  );
}
