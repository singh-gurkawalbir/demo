import React, { useState} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import DynaRadio from './radiogroup/DynaRadioGroup';
import { isProduction } from '../../../forms/formFactory/utils';
import DynaLabelValueElement from './DynaLabelValueElement';
import FieldHelp from '../FieldHelp';

const useStyles = makeStyles(() => ({
  inlineElements: {
    display: 'flex',
    flexDirection: 'row !important',
  },
}));

export default function AS2url() {
  const [as2Url, setas2Url] = useState('https');
  const classes = useStyles();

  return (
    <>
      <DynaRadio
        isValid
        value={as2Url}
        onFieldChange={(id, value) => {
          setas2Url(value);
        }}
        label="AS2 mode"
        helpText="Choose AS2 via HTTP or HTTPS for this connection."
        options={[
          {
            items: [{ label: 'AS2 via HTTP', value: 'http' },
              { label: 'AS2 via HTTPS', value: 'https' },
            ],
          },
        ]} />
      <div className={classes.inlineElements}>
        <DynaLabelValueElement
          label="AS2 URL"
          value={as2Url === 'http' ? ((isProduction() && 'http://api.integrator.io/v1/as2') || ('http://api.staging.integrator.io/v1/as2')) : ((isProduction() && 'https://api.integrator.io/v1/as2') || ('https://api.staging.integrator.io/v1/as2'))}
/>
        <FieldHelp helpText="Specify the URL to which your trading partners will send AS2 documents. Since these URLs are shared by all integrator.io accounts, the <b>AS2 identifier</b> below must be unique. Choose the <b>HTTPS</b> protocol if your software has an HTTPS/SSL CA certificate, provided by Amazon Trust Services Repository." />
      </div>
    </>

  );
}
