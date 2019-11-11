import { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@material-ui/core';
import infoText from '../../views/ResourceList/infoText';
import CeligoPageBar from '../../components/CeligoPageBar';
import GenerateZip from '../../views/TemplateList/GenerateZip';
import UploadFile from '../../components/InstallIntegration/UploadFile';

const useStyles = makeStyles(() => ({
  radio: {
    display: 'inline',
  },
}));

export default function GenerateOrInstall(props) {
  const { history } = props;
  const classes = useStyles();
  const [showGenerateZip, setShowGenerateZip] = useState(false);
  const [showUploadZip, setShowUploadZip] = useState(true);
  const handleChange = evt => {
    const showView = evt.target.value;

    switch (showView) {
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
      <FormControl component="fieldset">
        <FormLabel component="legend">What would you like to do?</FormLabel>
        <RadioGroup
          defaultValue="UploadFile"
          onChange={handleChange}
          className={classes.radio}>
          <FormControlLabel
            value="UploadFile"
            control={<Radio />}
            label="Install Integration"
          />
          <FormControlLabel
            value="GenerateZip"
            control={<Radio />}
            label="Generate Template Zip"
          />
        </RadioGroup>
      </FormControl>
      <div>
        {showGenerateZip && <GenerateZip />}
        {showUploadZip && (
          <UploadFile fileType="application/zip" history={history} />
        )}
      </div>
    </Fragment>
  );
}
