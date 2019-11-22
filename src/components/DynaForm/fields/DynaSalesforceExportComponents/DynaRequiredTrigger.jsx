import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import DynaText from '../DynaText';
import * as selectors from '../../../../reducers';

const getTriggerCode = sObjectType => {
  let toReturn = `trigger <name> on ${sObjectType} (after insert, after update) {\n  integrator_da__.RealTimeExportResult result = integrator_da__.RealTimeExporter.run(); \n}`;

  toReturn += `\n/* Please use the below code for batch export */\n/*\ntrigger <name> on ${sObjectType} (after insert, after update) {\n  integrator_da__.RealTimeExporter.runBatch();\n}\n*/`;

  return toReturn;
};

/* return 'A Salesforce (Apex) trigger is required per SObject type to facilitate realtime data exports.  Salesforce does not provide a mechanism to deploy this code automatically, and therefore you will need to copy the trigger text above and then click '+
    '<a target="_blank" href = "'+
    this.parent.parent.connection.salesforce.baseURI+'/setup/build/editApexTrigger.apexp?retURL=%2Fp%2Fsetup%2Flayout%2FApexTriggerList&entity='+sObjectType+
    '">here</a> to manually create the trigger in your Salesforce account.  Please note that this only needs to be done once per SObject type.'
    */
const getTriggerCodeHelpText = (sObjectType, baseURI) => (
  <Fragment>
    A Salesforce (Apex) trigger is required per SObject type to facilitate
    realtime data exports. You will need to copy the trigger text above and then
    click
    <a
      // eslint-disable-next-line react/jsx-no-target-blank
      target="_blank"
      href={`${baseURI}/setup/build/editApexTrigger.apexp?retURL=%2Fp%2Fsetup%2Flayout%2FApexTriggerList&entity=${sObjectType}`}>
      here
    </a>
    to manually create the trigger in your Salesforce account.
  </Fragment>
);

export default function DynaRequiredTrigger(props) {
  const { options: selectedOption, resourceId, resourceType } = props;
  const { merged } = useSelector(state =>
    selectors.resourceData(state, resourceType, resourceId)
  );
  const { _connectionId } = merged;
  const { merged: connRes } = useSelector(state =>
    selectors.resourceData(state, 'connections', _connectionId)
  );
  const { salesforce } = connRes;
  const helpText = getTriggerCodeHelpText(
    selectedOption,
    salesforce && salesforce.baseURI
  );
  const triggerCode = getTriggerCode(selectedOption);

  return <DynaText {...props} description={helpText} options={triggerCode} />;
}
