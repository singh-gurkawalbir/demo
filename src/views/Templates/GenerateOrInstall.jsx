import { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CeligoPageBar from '../../components/CeligoPageBar';
import GenerateZip from '../../components/GenerateZip';
import UploadFile from '../../views/InstallIntegration/UploadFile';
import RadioGroup from '../../components/DynaForm/fields/radiogroup/DynaRadioGroup';
import { TEMPLATE_GENERATE_OR_INSTALL_HELPINFO } from '../../utils/helpInfo';

const useStyles = makeStyles(theme => ({
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

export default function GenerateOrInstall(props) {
  const classes = useStyles();
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
        infoText={TEMPLATE_GENERATE_OR_INSTALL_HELPINFO}
      />
      <div className={classes.resultContainer}>
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
      </div>
    </Fragment>
  );
}
