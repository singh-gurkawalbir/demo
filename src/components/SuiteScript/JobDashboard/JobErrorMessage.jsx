import { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import openExternalUrl from '../../../utils/window';
import RawHtml from '../../RawHtml';

const handleRecordLinkClick = url => openExternalUrl({ url });
const recordLabels = {
  export: 'View Export Record',
  import: 'View Import Record',
};

export default function JobErrorMessage({ type, message, recordLink }) {
  return (
    <Fragment>
      <RawHtml html={message} options={{ allowedTags: ['a'] }} />
      <div>
        {recordLink && (
          <Button
            data-test="viewRecord"
            variant="text"
            onClick={() => {
              handleRecordLinkClick(recordLink);
            }}>
            {recordLabels[type]}
          </Button>
        )}
      </div>
    </Fragment>
  );
}
