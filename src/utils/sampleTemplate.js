import { adaptorTypeMap } from './resource';

export default {
  getSampleRuleTemplate: adaptorType => {
    const application = adaptorTypeMap[adaptorType];

    switch (application) {
      case adaptorTypeMap.AS2Import:
        return 'sample-{{connection.name}}-{{data.myField}}';
      default:
        return '';
    }
  },
  isTemplateDataArrayWrapped: adaptorType => {
    const application = adaptorTypeMap[adaptorType];

    // if application is http or as2
    if (
      application === adaptorTypeMap.AS2Import ||
      application === adaptorTypeMap.HTTPImport
    )
      return true;

    return false;
  },
};
