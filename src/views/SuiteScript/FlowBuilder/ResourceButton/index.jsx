import React from 'react';
import { TextButton } from '@celigo/fuse-ui';
import ExportIcon from '../../../../components/icons/ExportsIcon';
import DataLoaderIcon from '../../../../components/icons/DataLoaderIcon';
import ListenerIcon from '../../../../components/icons/ListenerIcon';
import ImportIcon from '../../../../components/icons/ImportsIcon';
import TransferDownIcon from '../../../../components/icons/TransferDownIcon';
import TransferUpIcon from '../../../../components/icons/TransferUpIcon';

const blockMap = {
  export: { label: 'Export', Icon: ExportIcon },
  import: { label: 'Import', Icon: ImportIcon },
  listener: { label: 'Listener', Icon: ListenerIcon },
  dataLoader: { label: 'Data loader', Icon: DataLoaderIcon },
  exportTransfer: { label: 'Transfer', Icon: TransferDownIcon },
  importTransfer: { label: 'Transfer', Icon: TransferUpIcon },
};

export default function ResourceButton({ onClick, variant = 'export', isFileTransfer }) {
  const block = blockMap[isFileTransfer ? `${variant}Transfer` : variant];

  return (
    <TextButton
      sx={{
        fontSize: '16px',
        fontFamily: 'source sans pro',
        mr: 1,
        flexDirection: 'column',
        paddingRight: 1,
        paddingLeft: 1,
        '& >* svg': {
          marginBottom: 5,
          fontSize: '48px !important',
        },
        '&:hover': {
          color: 'secondary.main',
          '& > * svg': {
            color: 'primary.main',
          },
        },
      }}
      data-test={block.label}
      startIcon={<block.Icon />}
      onClick={onClick}>
      {block.label}
    </TextButton>
  );
}
