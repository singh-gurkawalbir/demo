import React from 'react';
import openExternalUrl from '../../../utils/window';
import RawHtml from '../../RawHtml';
import { TextButton } from '../../Buttons';

const handleRecordLinkClick = url => openExternalUrl({ url });
const recordLabels = {
  export: 'View Export Record',
  import: 'View Import Record',
};

export default function JobErrorMessage({ type, message, recordLink }) {
  return (
    <>
      <RawHtml html={message} options={{ allowedTags: ['a'] }} />
      <div>
        {recordLink && (
          <TextButton
            data-test="viewRecord"
            onClick={() => {
              handleRecordLinkClick(recordLink);
            }}>
            {recordLabels[type]}
          </TextButton>
        )}
      </div>
    </>
  );
}
