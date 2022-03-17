import React from 'react';
import { useStoreState } from 'react-flow-renderer';
import TitleTypography from '../../../../../../views/FlowBuilder/TitleTypography';
import AddButton from './AddButton';
import { FB_SOURCE_COLUMN_WIDTH } from '../../constants';

export default function CanvasTitle({onClick, children}) {
  // we dont care about the y axis since we always want 100% y axis coverage,
  // regardless of pan or zoom settings.
  const [x,, scale] = useStoreState(s => s.transform);

  return (
    <svg xmlns="http://www.w3.org/2000/svg">
      <foreignObject
        width={FB_SOURCE_COLUMN_WIDTH - 40}
        height={40}
        x={(FB_SOURCE_COLUMN_WIDTH * scale - FB_SOURCE_COLUMN_WIDTH) + 20 + x}
        y={20}
        requiredExtensions="http://www.w3.org/1999/xhtml">
        <TitleTypography>
          {children}
          <AddButton onClick={onClick} />
        </TitleTypography>
      </foreignObject>
    </svg>
  );
}
