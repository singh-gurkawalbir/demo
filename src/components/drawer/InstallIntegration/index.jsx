import GenerateZip from '../../GenerateZip';
import RightDrawer from '../Right';

export default function DownloadIntegrationDrawer() {
  return (
    <RightDrawer
      path="downloadIntegration"
      title="Download integration"
      // variant="temporary"
    >
      <GenerateZip />
    </RightDrawer>
  );
}
