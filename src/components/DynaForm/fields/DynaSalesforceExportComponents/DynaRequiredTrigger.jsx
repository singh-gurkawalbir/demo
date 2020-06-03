import DynaText from '../DynaText';

const getTriggerCode = sObjectType => {
  const triggerCodeText = `trigger <name> on ${sObjectType} (after insert, after update) 
  {\n  integrator_da__.RealTimeExportResult res = integrator_da__.RealTimeExporter.processExport(); \n}`;

  return triggerCodeText;
};

/* return 'A Salesforce (Apex) trigger is required per SObject type to facilitate realtime data exports.  Salesforce does not provide a mechanism to deploy this code automatically, and therefore you will need to copy the trigger text above and then click '+
    '<a target="_blank" href = "'+
    this.parent.parent.connection.salesforce.baseURI+'/setup/build/editApexTrigger.apexp?retURL=%2Fp%2Fsetup%2Flayout%2FApexTriggerList&entity='+sObjectType+
    '">here</a> to manually create the trigger in your Salesforce account.  Please note that this only needs to be done once per SObject type.'
    */

export default function DynaRequiredTrigger(props) {
  const { options: selectedOption } = props;
  const triggerCode = getTriggerCode(selectedOption);

  return <DynaText {...props} options={triggerCode} />;
}
