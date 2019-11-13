import { Fragment, useState } from 'react';
import infoText from '../../views/ResourceList/infoText';
import CeligoPageBar from '../../components/CeligoPageBar';
import GenerateZip from '../../components/GenerateZip';
import UploadFile from '../../components/InstallIntegration/UploadFile';
import RadioGroup from '../../components/DynaForm/fields/DynaRadioGroup';

export default function GenerateOrInstall(props) {
  const { history } = props;
  const [showGenerateZip, setShowGenerateZip] = useState(false);
  const [showUploadZip, setShowUploadZip] = useState(true);
  const handleChange = (id, value) => {
    switch (value) {
      case 'GenerateZip':
        setShowGenerateZip(true);
        setShowUploadZip(false);
        break;
      case 'UploadFile':
        setShowGenerateZip(false);
        setShowUploadZip(true);
        break;
      default:
    }
  };

  return (
    <Fragment>
      <CeligoPageBar
        title="Templates"
        infoText={infoText.templateGenerateOrInstall}
      />
      <RadioGroup
        {...props}
        defaultValue="UploadFile"
        id="generateOrInstall"
        label="What would you like to do?"
        onFieldChange={handleChange}
        options={[
          {
            items: [
              { label: 'Install Integration', value: 'UploadFile' },
              { label: 'Generate Template Zip', value: 'GenerateZip' },
            ],
          },
        ]}
      />
      <div>
        {showGenerateZip && <GenerateZip />}
        {showUploadZip && (
          <UploadFile fileType="application/zip" history={history} />
        )}
      </div>
    </Fragment>
  );
}
