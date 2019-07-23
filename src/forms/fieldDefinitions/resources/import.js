{  
  "_userId":{  
     "path":"_userId",
     "instance":"ObjectID",
     "validators":[  
        {  
           "message":"Path `{PATH}` is required.",
           "type":"required"
        }
     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "required":true,
        "ref":"User",
        "template":false
     },
     "_index":null,
     "isRequired":true,
     "originalRequiredValue":true
  },
  "_connectionId":{  
     "path":"_connectionId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"Connection"
     },
     "_index":null
  },
  "_integrationId":{  
     "path":"_integrationId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"Integration",
        "template":false
     },
     "_index":null
  },
  "_connectorId":{  
     "path":"_connectorId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"Connector",
        "template":false
     },
     "_index":null
  },
  "externalId":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"externalId",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "template":false
     },
     "_index":null
  },
  "createdAt":{  
     "path":"createdAt",
     "instance":"Date",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "lastModified":{  
     "path":"lastModified",
     "instance":"Date",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "index":true,
        "template":false
     },
     "_index":true
  },
  "name":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"name",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "maxSize":200
     },
     "_index":null
  },
  "description":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"description",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "maxSize":10240
     },
     "_index":null
  },
  "apiIdentifier":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"apiIdentifier",
     "instance":"String",
     "validators":[  
        {  
           "message":"Path `{PATH}` is required.",
           "type":"required"
        }
     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "required":true,
        "template":false
     },
     "_index":null,
     "isRequired":true,
     "originalRequiredValue":true
  },
  "sampleData":{  
     "path":"sampleData",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "distributed":{  
     "path":"distributed",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "maxAttempts":{  
     "path":"maxAttempts",
     "instance":"Number",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "ignoreExisting":{  
     "path":"ignoreExisting",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "ignoreMissing":{  
     "path":"ignoreMissing",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "idLockTemplate":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"idLockTemplate",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "dataURITemplate":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"dataURITemplate",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "oneToMany":{  
     "path":"oneToMany",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "pathToMany":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"pathToMany",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "blobKeyPath":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"blobKeyPath",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "assistant":{  
     "enumValues":[  
        "3dcart",
        "accelo",
        "adp",
        "amazonaws",
        "amazonmws",
        "anaplan",
        "ariba",
        "asana",
        "atera",
        "authorize.net",
        "avalara",
        "banking",
        "bigcommerce",
        "bill.com",
        "box",
        "braintree",
        "campaignmonitor",
        "certify",
        "chargebee",
        "chargify",
        "clover",
        "dcl",
        "desk",
        "dnb",
        "docusign",
        "doubleclick",
        "dropbox",
        "ebay",
        "ebay-xml",
        "eloquent",
        "etsy",
        "eventbrite",
        "exacterp",
        "expensify",
        "facebookads",
        "fieldaware",
        "freshbooks",
        "freshdesk",
        "ftp",
        "github",
        "gooddata",
        "google",
        "googleanalytics",
        "googlecontacts",
        "googledrive",
        "googlemail",
        "googlesheets",
        "googleshopping",
        "harvest",
        "hoovers",
        "hubspot",
        "hybris",
        "insightly",
        "integratorio",
        "jet",
        "jira",
        "jobvite",
        "lightspeed",
        "linkedin",
        "liquidplanner",
        "magento",
        "mailchimp",
        "mediaocean",
        "namely",
        "netsuite",
        "newegg",
        "newrelic",
        "okta",
        "openair",
        "osn",
        "other",
        "paychex",
        "paylocity",
        "paypal",
        "pulseway",
        "quickbooks",
        "recurly",
        "replicon",
        "s3",
        "sageone",
        "salesforce",
        "servicenow",
        "shiphawk",
        "shipstation",
        "shipwire",
        "shopify",
        "skubana",
        "slack",
        "smartsheet",
        "snapfulfil",
        "splunk",
        "spreecommerce",
        "squareup",
        "steelbrick",
        "stripe",
        "surveymonkey",
        "svb",
        "tableau",
        "tesco",
        "travis",
        "tsheets",
        "twilio",
        "walmart",
        "wiser",
        "woocommerce",
        "wrike",
        "xcart",
        "yahoo",
        "yammer",
        "zendesk",
        "zoho",
        "zuora",
        "coupa",
        "taxjar",
        "quip",
        "allbound",
        "zohocrm",
        "zohodesk",
        "microsoftoffice365",
        "microsoftdynamics365",
        "pitneybowes",
        "mysql",
        "postgresql",
        "mssql",
        "greenhouse",
        "shippo",
        "gusto",
        "easypost",
        "segment",
        "zohobooks",
        "microsoftbusinesscentral",
        "microsoftoutlookcalendar",
        "microsoftoutlookmail",
        "microsoftoutlookcontacts",
        "microsoftonenote",
        "wish",
        "pdffiller",
        "signnow",
        "acton",
        "acumatica",
        "mongodb",
        "zohomail",
        "zoom",
        "myobessentials",
        "nimble",
        "bronto",
        "strata",
        "returnly",
        "activecampaign",
        "klaviyo",
        "postmark",
        "powerbi",
        "procurify",
        "mailgun",
        "zimbra",
        "merchantesolutions",
        "aptrinsic",
        "cardknox",
        "skuvault",
        "nextag",
        "concur",
        "oandav20fxtrade",
        "oandaexchangerates",
        "spreecommerce",
        "tophatter",
        "concurv4",
        "sugarcrm",
        "marketo",
        "grms",
        "retailops",
        "sharepoint",
        "parseur",
        "authorize.net",
        "firstdata",
        "propack",
        "outreach",
        "ramplogistics",
        "constantcontactv3",
        "constantcontactv2",
        "concurall",
        "dunandbradstreet",
        "trinet",
        "pacejet",
        "solidcommerce",
        "intercom",
        "bamboohr"
     ],
     "regExp":null,
     "path":"assistant",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "3dcart",
              "accelo",
              "adp",
              "amazonaws",
              "amazonmws",
              "anaplan",
              "ariba",
              "asana",
              "atera",
              "authorize.net",
              "avalara",
              "banking",
              "bigcommerce",
              "bill.com",
              "box",
              "braintree",
              "campaignmonitor",
              "certify",
              "chargebee",
              "chargify",
              "clover",
              "dcl",
              "desk",
              "dnb",
              "docusign",
              "doubleclick",
              "dropbox",
              "ebay",
              "ebay-xml",
              "eloquent",
              "etsy",
              "eventbrite",
              "exacterp",
              "expensify",
              "facebookads",
              "fieldaware",
              "freshbooks",
              "freshdesk",
              "ftp",
              "github",
              "gooddata",
              "google",
              "googleanalytics",
              "googlecontacts",
              "googledrive",
              "googlemail",
              "googlesheets",
              "googleshopping",
              "harvest",
              "hoovers",
              "hubspot",
              "hybris",
              "insightly",
              "integratorio",
              "jet",
              "jira",
              "jobvite",
              "lightspeed",
              "linkedin",
              "liquidplanner",
              "magento",
              "mailchimp",
              "mediaocean",
              "namely",
              "netsuite",
              "newegg",
              "newrelic",
              "okta",
              "openair",
              "osn",
              "other",
              "paychex",
              "paylocity",
              "paypal",
              "pulseway",
              "quickbooks",
              "recurly",
              "replicon",
              "s3",
              "sageone",
              "salesforce",
              "servicenow",
              "shiphawk",
              "shipstation",
              "shipwire",
              "shopify",
              "skubana",
              "slack",
              "smartsheet",
              "snapfulfil",
              "splunk",
              "spreecommerce",
              "squareup",
              "steelbrick",
              "stripe",
              "surveymonkey",
              "svb",
              "tableau",
              "tesco",
              "travis",
              "tsheets",
              "twilio",
              "walmart",
              "wiser",
              "woocommerce",
              "wrike",
              "xcart",
              "yahoo",
              "yammer",
              "zendesk",
              "zoho",
              "zuora",
              "coupa",
              "taxjar",
              "quip",
              "allbound",
              "zohocrm",
              "zohodesk",
              "microsoftoffice365",
              "microsoftdynamics365",
              "pitneybowes",
              "mysql",
              "postgresql",
              "mssql",
              "greenhouse",
              "shippo",
              "gusto",
              "easypost",
              "segment",
              "zohobooks",
              "microsoftbusinesscentral",
              "microsoftoutlookcalendar",
              "microsoftoutlookmail",
              "microsoftoutlookcontacts",
              "microsoftonenote",
              "wish",
              "pdffiller",
              "signnow",
              "acton",
              "acumatica",
              "mongodb",
              "zohomail",
              "zoom",
              "myobessentials",
              "nimble",
              "bronto",
              "strata",
              "returnly",
              "activecampaign",
              "klaviyo",
              "postmark",
              "powerbi",
              "procurify",
              "mailgun",
              "zimbra",
              "merchantesolutions",
              "aptrinsic",
              "cardknox",
              "skuvault",
              "nextag",
              "concur",
              "oandav20fxtrade",
              "oandaexchangerates",
              "spreecommerce",
              "tophatter",
              "concurv4",
              "sugarcrm",
              "marketo",
              "grms",
              "retailops",
              "sharepoint",
              "parseur",
              "authorize.net",
              "firstdata",
              "propack",
              "outreach",
              "ramplogistics",
              "constantcontactv3",
              "constantcontactv2",
              "concurall",
              "dunandbradstreet",
              "trinet",
              "pacejet",
              "solidcommerce",
              "intercom",
              "bamboohr"
           ]
        }
     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "3dcart",
           "accelo",
           "adp",
           "amazonaws",
           "amazonmws",
           "anaplan",
           "ariba",
           "asana",
           "atera",
           "authorize.net",
           "avalara",
           "banking",
           "bigcommerce",
           "bill.com",
           "box",
           "braintree",
           "campaignmonitor",
           "certify",
           "chargebee",
           "chargify",
           "clover",
           "dcl",
           "desk",
           "dnb",
           "docusign",
           "doubleclick",
           "dropbox",
           "ebay",
           "ebay-xml",
           "eloquent",
           "etsy",
           "eventbrite",
           "exacterp",
           "expensify",
           "facebookads",
           "fieldaware",
           "freshbooks",
           "freshdesk",
           "ftp",
           "github",
           "gooddata",
           "google",
           "googleanalytics",
           "googlecontacts",
           "googledrive",
           "googlemail",
           "googlesheets",
           "googleshopping",
           "harvest",
           "hoovers",
           "hubspot",
           "hybris",
           "insightly",
           "integratorio",
           "jet",
           "jira",
           "jobvite",
           "lightspeed",
           "linkedin",
           "liquidplanner",
           "magento",
           "mailchimp",
           "mediaocean",
           "namely",
           "netsuite",
           "newegg",
           "newrelic",
           "okta",
           "openair",
           "osn",
           "other",
           "paychex",
           "paylocity",
           "paypal",
           "pulseway",
           "quickbooks",
           "recurly",
           "replicon",
           "s3",
           "sageone",
           "salesforce",
           "servicenow",
           "shiphawk",
           "shipstation",
           "shipwire",
           "shopify",
           "skubana",
           "slack",
           "smartsheet",
           "snapfulfil",
           "splunk",
           "spreecommerce",
           "squareup",
           "steelbrick",
           "stripe",
           "surveymonkey",
           "svb",
           "tableau",
           "tesco",
           "travis",
           "tsheets",
           "twilio",
           "walmart",
           "wiser",
           "woocommerce",
           "wrike",
           "xcart",
           "yahoo",
           "yammer",
           "zendesk",
           "zoho",
           "zuora",
           "coupa",
           "taxjar",
           "quip",
           "allbound",
           "zohocrm",
           "zohodesk",
           "microsoftoffice365",
           "microsoftdynamics365",
           "pitneybowes",
           "mysql",
           "postgresql",
           "mssql",
           "greenhouse",
           "shippo",
           "gusto",
           "easypost",
           "segment",
           "zohobooks",
           "microsoftbusinesscentral",
           "microsoftoutlookcalendar",
           "microsoftoutlookmail",
           "microsoftoutlookcontacts",
           "microsoftonenote",
           "wish",
           "pdffiller",
           "signnow",
           "acton",
           "acumatica",
           "mongodb",
           "zohomail",
           "zoom",
           "myobessentials",
           "nimble",
           "bronto",
           "strata",
           "returnly",
           "activecampaign",
           "klaviyo",
           "postmark",
           "powerbi",
           "procurify",
           "mailgun",
           "zimbra",
           "merchantesolutions",
           "aptrinsic",
           "cardknox",
           "skuvault",
           "nextag",
           "concur",
           "oandav20fxtrade",
           "oandaexchangerates",
           "spreecommerce",
           "tophatter",
           "concurv4",
           "sugarcrm",
           "marketo",
           "grms",
           "retailops",
           "sharepoint",
           "parseur",
           "authorize.net",
           "firstdata",
           "propack",
           "outreach",
           "ramplogistics",
           "constantcontactv3",
           "constantcontactv2",
           "concurall",
           "dunandbradstreet",
           "trinet",
           "pacejet",
           "solidcommerce",
           "intercom",
           "bamboohr"
        ]
     },
     "_index":null
  },
  "deleteAfterImport":{  
     "path":"deleteAfterImport",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "sandbox":{  
     "path":"sandbox",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  
        null
     ],
     "getters":[  

     ],
     "options":{  
        "cLocked":false,
        "template":false
     },
     "_index":null
  },
  "_templateId":{  
     "path":"_templateId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"Template",
        "template":false
     },
     "_index":null
  },
  "assistantMetadata":{  
     "path":"assistantMetadata",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "cLocked":false,
        "patch":true
     },
     "_index":null
  },
  "deletedAt":{  
     "path":"deletedAt",
     "instance":"Date",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "useTechAdaptorForm":{  
     "path":"useTechAdaptorForm",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "filter.type":{  
     "enumValues":[  
        "expression",
        "script"
     ],
     "regExp":null,
     "path":"filter.type",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "expression",
              "script"
           ]
        }
     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "expression",
           "script"
        ]
     },
     "_index":null
  },
  "filter.expression.version":{  
     "enumValues":[  
        "1"
     ],
     "regExp":null,
     "path":"filter.expression.version",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "1"
           ]
        }
     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "1"
        ]
     },
     "_index":null
  },
  "filter.expression.rules":{  
     "path":"filter.expression.rules",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "filter.script._scriptId":{  
     "path":"filter.script._scriptId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"Script"
     },
     "_index":null
  },
  "filter.script.function":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"filter.script.function",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "parsers[*].version":{  
     "enum":[  
        "1"
     ]
  },
  "parsers[*].type":{  
     "enum":[  
        "xml"
     ]
  },
  "parsers[*].rules":{  
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "hooks.preMap.function":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"hooks.preMap.function",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "hooks.preMap._scriptId":{  
     "path":"hooks.preMap._scriptId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"Script"
     },
     "_index":null
  },
  "hooks.preMap._stackId":{  
     "path":"hooks.preMap._stackId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"Stack",
        "template":false
     },
     "_index":null
  },
  "hooks.preMap.configuration":{  
     "path":"hooks.preMap.configuration",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "hooks.postMap.function":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"hooks.postMap.function",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "hooks.postMap._scriptId":{  
     "path":"hooks.postMap._scriptId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"Script"
     },
     "_index":null
  },
  "hooks.postMap._stackId":{  
     "path":"hooks.postMap._stackId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"Stack",
        "template":false
     },
     "_index":null
  },
  "hooks.postMap.configuration":{  
     "path":"hooks.postMap.configuration",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "hooks.postSubmit.function":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"hooks.postSubmit.function",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "hooks.postSubmit._scriptId":{  
     "path":"hooks.postSubmit._scriptId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"Script"
     },
     "_index":null
  },
  "hooks.postSubmit._stackId":{  
     "path":"hooks.postSubmit._stackId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"Stack",
        "template":false
     },
     "_index":null
  },
  "hooks.postSubmit.configuration":{  
     "path":"hooks.postSubmit.configuration",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "hooks.postAggregate.function":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"hooks.postAggregate.function",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "hooks.postAggregate._scriptId":{  
     "path":"hooks.postAggregate._scriptId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"Script"
     },
     "_index":null
  },
  "hooks.postAggregate._stackId":{  
     "path":"hooks.postAggregate._stackId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"Stack",
        "template":false
     },
     "_index":null
  },
  "hooks.postAggregate.configuration":{  
     "path":"hooks.postAggregate.configuration",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "sampleResponseData":{  
     "path":"sampleResponseData",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "cLocked":false
     },
     "_index":null
  },
  "responseTransform.type":{  
     "enumValues":[  
        "expression",
        "script"
     ],
     "regExp":null,
     "path":"responseTransform.type",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "expression",
              "script"
           ]
        }
     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "expression",
           "script"
        ]
     },
     "_index":null
  },
  "responseTransform.expression.version":{  
     "enumValues":[  
        "1"
     ],
     "regExp":null,
     "path":"responseTransform.expression.version",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "1"
           ]
        }
     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "1"
        ]
     },
     "_index":null
  },
  "responseTransform.expression.rules":{  
     "path":"responseTransform.expression.rules",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "responseTransform.script._scriptId":{  
     "path":"responseTransform.script._scriptId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"Script"
     },
     "_index":null
  },
  "responseTransform.script.function":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"responseTransform.script.function",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "modelMetadata":{  
     "path":"modelMetadata",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "cLocked":false
     },
     "_index":null
  },
  "mapping.fields[*].extract":{  

  },
  "mapping.fields[*].extractDateFormat":{  

  },
  "mapping.fields[*].extractDateTimezone":{  

  },
  "mapping.fields[*].generate":{  

  },
  "mapping.fields[*].generateDateFormat":{  

  },
  "mapping.fields[*].generateDateTimezone":{  

  },
  "mapping.fields[*].hardCodedValue":{  

  },
  "mapping.fields[*].immutable":{  

  },
  "mapping.fields[*].lookupName":{  

  },
  "mapping.fields[*].dataType":{  
     "enum":[  
        "string",
        "number",
        "boolean",
        "numberarray",
        "stringarray"
     ],
     "lowercase":true
  },
  "mapping.fields[*].default":{  

  },
  "mapping.fields[*].conditional.lookupName":{  

  },
  "mapping.fields[*].conditional.when":{  
     "enum":[  
        "record_created",
        "record_updated",
        "extract_not_empty",
        "lookup_not_empty",
        "lookup_empty",
        "expression"
     ]
  },
  "mapping.fields[*].conditional.expression":{  

  },
  "mapping.fields[*].discardIfEmpty":{  

  },
  "mapping.lists[*].generate":{  

  },
  "mapping.lists[*].fields[*].extract":{  

  },
  "mapping.lists[*].fields[*].extractDateFormat":{  

  },
  "mapping.lists[*].fields[*].extractDateTimezone":{  

  },
  "mapping.lists[*].fields[*].generate":{  

  },
  "mapping.lists[*].fields[*].generateDateFormat":{  

  },
  "mapping.lists[*].fields[*].generateDateTimezone":{  

  },
  "mapping.lists[*].fields[*].hardCodedValue":{  

  },
  "mapping.lists[*].fields[*].immutable":{  

  },
  "mapping.lists[*].fields[*].lookupName":{  

  },
  "mapping.lists[*].fields[*].dataType":{  
     "enum":[  
        "string",
        "number",
        "boolean",
        "numberarray",
        "stringarray"
     ],
     "lowercase":true
  },
  "mapping.lists[*].fields[*].default":{  

  },
  "mapping.lists[*].fields[*].conditional.lookupName":{  

  },
  "mapping.lists[*].fields[*].conditional.when":{  
     "enum":[  
        "record_created",
        "record_updated",
        "extract_not_empty",
        "lookup_not_empty",
        "lookup_empty",
        "expression"
     ]
  },
  "mapping.lists[*].fields[*].conditional.expression":{  

  },
  "mapping.lists[*].fields[*].discardIfEmpty":{  

  },
  "lookups[*].name":{  

  },
  "lookups[*].map":{  
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "lookups[*].default":{  

  },
  "lookups[*].allowFailures":{  

  },
  "_id":{  
     "path":"_id",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  
        null
     ],
     "getters":[  

     ],
     "options":{  
        "auto":true
     },
     "_index":null
  },
  "file.delete":{  
     "path":"file.delete",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "file.skipAggregation":{  
     "path":"file.skipAggregation",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "file.type":{  
     "enumValues":[  
        "csv",
        "xlsx",
        "json",
        "xml",
        "filedefinition"
     ],
     "regExp":null,
     "path":"file.type",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "csv",
              "xlsx",
              "json",
              "xml",
              "filedefinition"
           ]
        }
     ],
     "setters":[  
        null
     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "csv",
           "xlsx",
           "json",
           "xml",
           "filedefinition"
        ],
        "lowercase":true
     },
     "_index":null
  },
  "file.compressionFormat":{  
     "enumValues":[  
        "gzip"
     ],
     "regExp":null,
     "path":"file.compressionFormat",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "gzip"
           ]
        }
     ],
     "setters":[  
        null
     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "gzip"
        ],
        "lowercase":true
     },
     "_index":null
  },
  "file.purgeInternalBackup":{  
     "path":"file.purgeInternalBackup",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "file.csv.rowDelimiter":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"file.csv.rowDelimiter",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "file.csv.columnDelimiter":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"file.csv.columnDelimiter",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "file.csv.includeHeader":{  
     "path":"file.csv.includeHeader",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "file.csv.wrapWithQuotes":{  
     "path":"file.csv.wrapWithQuotes",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "file.csv.replaceTabWithSpace":{  
     "path":"file.csv.replaceTabWithSpace",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "file.csv.replaceNewlineWithSpace":{  
     "path":"file.csv.replaceNewlineWithSpace",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "file.csv.customHeaderRows[*]":{  
     "maxSize":25600
  },
  "file.csv.headerRow":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"file.csv.headerRow",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "maxSize":25600,
        "cLocked":false
     },
     "_index":null
  },
  "file.xlsx.includeHeader":{  
     "path":"file.xlsx.includeHeader",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "file.xlsx.headerRow":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"file.xlsx.headerRow",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "maxSize":25600,
        "cLocked":false
     },
     "_index":null
  },
  "file.json.prettyPrint":{  
     "path":"file.json.prettyPrint",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "file.xml.body":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"file.xml.body",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "maxSize":20480
     },
     "_index":null
  },
  "file.fileDefinition._fileDefinitionId":{  
     "path":"file.fileDefinition._fileDefinitionId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"FileDefinition"
     },
     "_index":null
  },
  "file.lookups[*].name":{  

  },
  "file.lookups[*].map":{  
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "file.lookups[*].default":{  

  },
  "file.lookups[*].allowFailures":{  

  },
  "__v":{  
     "path":"__v",
     "instance":"Number",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "lookups[*].relativeURI":{  

  },
  "lookups[*].method":{  
     "enum":[  
        "GET",
        "POST"
     ],
     "uppercase":true
  },
  "lookups[*].postBody":{  
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "lookups[*].extract":{  

  },
  "rest.relativeURI[*]":{  

  },
  "rest.method[*]":{  
     "enum":[  
        "PUT",
        "POST",
        "DELETE",
        "PATCH"
     ],
     "uppercase":true
  },
  "rest.requestType[*]":{  
     "enum":[  
        "CREATE",
        "UPDATE"
     ]
  },
  "rest.body[*]":{  
     "maxSize":10240
  },
  "rest.headers[*].name":{  

  },
  "rest.headers[*].value":{  

  },
  "rest.responseIdPath[*]":{  

  },
  "rest.successPath[*]":{  

  },
  "rest.successValues[*]":{  

  },
  "rest.ignoreLookupName":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"rest.ignoreLookupName",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "rest.ignoreExtract":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"rest.ignoreExtract",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "rest.blobFormat":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"rest.blobFormat",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "rest.lookups[*].name":{  

  },
  "rest.lookups[*].map":{  
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "rest.lookups[*].default":{  

  },
  "rest.lookups[*].relativeURI":{  

  },
  "rest.lookups[*].method":{  
     "enum":[  
        "GET",
        "POST"
     ],
     "uppercase":true
  },
  "rest.lookups[*].postBody":{  
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "rest.lookups[*].extract":{  

  },
  "rest.lookups[*].allowFailures":{  

  },
  "adaptorType":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"adaptorType",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  
        null
     ],
     "getters":[  

     ],
     "options":{  
        "default":"RESTImport",
        "select":true
     },
     "_index":null,
     "defaultValue":"RESTImport",
     "selected":true
  },
  "ftp.directoryPath":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"ftp.directoryPath",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "ftp.fileName":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"ftp.fileName",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "ftp.inProgressFileName":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"ftp.inProgressFileName",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "ftp.backupDirectoryPath":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"ftp.backupDirectoryPath",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "lookups[*].body":{  
     "maxSize":10240
  },
  "http.requestMediaType":{  
     "enumValues":[  
        "xml",
        "json",
        "csv",
        "urlencoded"
     ],
     "regExp":null,
     "path":"http.requestMediaType",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "xml",
              "json",
              "csv",
              "urlencoded"
           ]
        }
     ],
     "setters":[  
        null
     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "xml",
           "json",
           "csv",
           "urlencoded"
        ],
        "lowercase":true
     },
     "_index":null
  },
  "http.successMediaType":{  
     "enumValues":[  
        "xml",
        "json"
     ],
     "regExp":null,
     "path":"http.successMediaType",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "xml",
              "json"
           ]
        }
     ],
     "setters":[  
        null
     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "xml",
           "json"
        ],
        "lowercase":true
     },
     "_index":null
  },
  "http.requestType[*]":{  
     "enum":[  
        "CREATE",
        "UPDATE"
     ]
  },
  "http.errorMediaType":{  
     "enumValues":[  
        "xml",
        "json"
     ],
     "regExp":null,
     "path":"http.errorMediaType",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "xml",
              "json"
           ]
        }
     ],
     "setters":[  
        null
     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "xml",
           "json"
        ],
        "lowercase":true
     },
     "_index":null
  },
  "http.relativeURI[*]":{  
     "maxSize":4096
  },
  "http.method[*]":{  
     "enum":[  
        "GET",
        "PUT",
        "POST",
        "PATCH",
        "DELETE"
     ],
     "uppercase":true
  },
  "http.body[*]":{  
     "maxSize":204800,
     "saveToS3":true,
     "s3MaxSize":1048576,
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "http.endPointBodyLimit":{  
     "path":"http.endPointBodyLimit",
     "instance":"Number",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "http.headers[*].name":{  

  },
  "http.headers[*].value":{  
     "maxSize":4096
  },
  "http.response.resourcePath[*]":{  

  },
  "http.response.resourceIdPath[*]":{  

  },
  "http.response.successPath":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"http.response.successPath",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "http.response.successValues[*]":{  

  },
  "http.response.errorPath":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"http.response.errorPath",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "http._asyncHelperId":{  
     "path":"http._asyncHelperId",
     "instance":"ObjectID",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "ref":"AsyncHelper"
     },
     "_index":null
  },
  "http.batchSize":{  
     "path":"http.batchSize",
     "instance":"Number",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "http.ignoreLookupName":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"http.ignoreLookupName",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "http.ignoreExtract":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"http.ignoreExtract",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "http.lookups[*].name":{  

  },
  "http.lookups[*].map":{  
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "http.lookups[*].default":{  

  },
  "http.lookups[*].relativeURI":{  

  },
  "http.lookups[*].method":{  
     "enum":[  
        "GET",
        "POST"
     ],
     "uppercase":true
  },
  "http.lookups[*].body":{  
     "maxSize":10240
  },
  "http.lookups[*].extract":{  

  },
  "http.lookups[*].allowFailures":{  

  },
  "http.ignoreEmptyNodes":{  
     "path":"http.ignoreEmptyNodes",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "lookups[*].useDefaultOnMultipleMatches":{  

  },
  "lookups[*].recordType":{  

  },
  "lookups[*].searchField":{  

  },
  "lookups[*].expression":{  
     "maxSize":20480
  },
  "lookups[*].resultField":{  

  },
  "lookups[*].includeInactive":{  

  },
  "netsuite_da.rawOverride":{  
     "path":"netsuite_da.rawOverride",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite_da.useRawOverride":{  
     "path":"netsuite_da.useRawOverride",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite_da.isMigrated":{  
     "path":"netsuite_da.isMigrated",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite_da.recordIdentifier":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite_da.recordIdentifier",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite_da.batchSize":{  
     "path":"netsuite_da.batchSize",
     "instance":"Number",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite_da.recordType":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite_da.recordType",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite_da.operation":{  
     "enumValues":[  
        "add",
        "update",
        "addupdate"
     ],
     "regExp":null,
     "path":"netsuite_da.operation",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "add",
              "update",
              "addupdate"
           ]
        }
     ],
     "setters":[  
        null
     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "add",
           "update",
           "addupdate"
        ],
        "lowercase":true
     },
     "_index":null
  },
  "netsuite_da.internalIdLookup.extract":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite_da.internalIdLookup.extract",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "cLocked":false
     },
     "_index":null
  },
  "netsuite_da.internalIdLookup.searchField":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite_da.internalIdLookup.searchField",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "cLocked":false
     },
     "_index":null
  },
  "netsuite_da.internalIdLookup.operator":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite_da.internalIdLookup.operator",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "cLocked":false
     },
     "_index":null
  },
  "netsuite_da.internalIdLookup.expression":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite_da.internalIdLookup.expression",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "maxSize":20480,
        "cLocked":false
     },
     "_index":null
  },
  "netsuite_da.hooks.preMap.fileInternalId":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite_da.hooks.preMap.fileInternalId",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite_da.hooks.preMap.function":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite_da.hooks.preMap.function",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite_da.hooks.preMap.configuration":{  
     "path":"netsuite_da.hooks.preMap.configuration",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite_da.hooks.postMap.fileInternalId":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite_da.hooks.postMap.fileInternalId",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite_da.hooks.postMap.function":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite_da.hooks.postMap.function",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite_da.hooks.postMap.configuration":{  
     "path":"netsuite_da.hooks.postMap.configuration",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite_da.hooks.postSubmit.fileInternalId":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite_da.hooks.postSubmit.fileInternalId",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite_da.hooks.postSubmit.function":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite_da.hooks.postSubmit.function",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite_da.hooks.postSubmit.configuration":{  
     "path":"netsuite_da.hooks.postSubmit.configuration",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite_da.mapping.fields[*].extract":{  
     "maxSize":20480
  },
  "netsuite_da.mapping.fields[*].extractDateFormat":{  

  },
  "netsuite_da.mapping.fields[*].extractDateTimezone":{  

  },
  "netsuite_da.mapping.fields[*].generate":{  

  },
  "netsuite_da.mapping.fields[*].hardCodedValue":{  

  },
  "netsuite_da.mapping.fields[*].immutable":{  

  },
  "netsuite_da.mapping.fields[*].lookupName":{  

  },
  "netsuite_da.mapping.fields[*].dataType":{  

  },
  "netsuite_da.mapping.fields[*].internalId":{  

  },
  "netsuite_da.mapping.fields[*].subRecordMapping":{  
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "netsuite_da.mapping.fields[*].discardIfEmpty":{  

  },
  "netsuite_da.mapping.fields[*].conditional.lookupName":{  

  },
  "netsuite_da.mapping.fields[*].conditional.when":{  
     "enum":[  
        "record_created",
        "record_updated",
        "extract_not_empty",
        "lookup_not_empty",
        "lookup_empty",
        "ignore_if_set"
     ],
     "lowercase":true
  },
  "netsuite_da.mapping.lists[*].generate":{  

  },
  "netsuite_da.mapping.lists[*].jsonPath":{  

  },
  "netsuite_da.mapping.lists[*].fields[*].extract":{  
     "maxSize":20480
  },
  "netsuite_da.mapping.lists[*].fields[*].extractDateFormat":{  

  },
  "netsuite_da.mapping.lists[*].fields[*].extractDateTimezone":{  

  },
  "netsuite_da.mapping.lists[*].fields[*].generate":{  

  },
  "netsuite_da.mapping.lists[*].fields[*].hardCodedValue":{  

  },
  "netsuite_da.mapping.lists[*].fields[*].immutable":{  

  },
  "netsuite_da.mapping.lists[*].fields[*].lookupName":{  

  },
  "netsuite_da.mapping.lists[*].fields[*].dataType":{  

  },
  "netsuite_da.mapping.lists[*].fields[*].internalId":{  

  },
  "netsuite_da.mapping.lists[*].fields[*].isKey":{  

  },
  "netsuite_da.mapping.lists[*].fields[*].subRecordMapping":{  
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "netsuite_da.mapping.lists[*].fields[*].discardIfEmpty":{  

  },
  "netsuite_da.mapping.lists[*].fields[*].conditional.lookupName":{  

  },
  "netsuite_da.mapping.lists[*].fields[*].conditional.when":{  
     "enum":[  
        "record_created",
        "record_updated",
        "extract_not_empty",
        "lookup_not_empty",
        "lookup_empty",
        "ignore_if_set"
     ],
     "lowercase":true
  },
  "netsuite_da.lookups[*].name":{  

  },
  "netsuite_da.lookups[*].map":{  
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "netsuite_da.lookups[*].default":{  

  },
  "netsuite_da.lookups[*].useDefaultOnMultipleMatches":{  

  },
  "netsuite_da.lookups[*].recordType":{  

  },
  "netsuite_da.lookups[*].searchField":{  

  },
  "netsuite_da.lookups[*].expression":{  
     "maxSize":20480
  },
  "netsuite_da.lookups[*].resultField":{  

  },
  "netsuite_da.lookups[*].includeInactive":{  

  },
  "netsuite_da.lookups[*].allowFailures":{  

  },
  "netsuite.operation":{  
     "enumValues":[  
        "add",
        "update",
        "addupdate",
        "attach",
        "detach",
        "delete"
     ],
     "regExp":null,
     "path":"netsuite.operation",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "add",
              "update",
              "addupdate",
              "attach",
              "detach",
              "delete"
           ]
        }
     ],
     "setters":[  
        null
     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "add",
           "update",
           "addupdate",
           "attach",
           "detach",
           "delete"
        ],
        "lowercase":true
     },
     "_index":null
  },
  "netsuite.customFieldMetadata":{  
     "path":"netsuite.customFieldMetadata",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite.recordType":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite.recordType",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite.recordTypeId":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite.recordTypeId",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite.retryUpdateAsAdd":{  
     "path":"netsuite.retryUpdateAsAdd",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite.batchSize":{  
     "path":"netsuite.batchSize",
     "instance":"Number",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite.internalIdLookup.extract":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite.internalIdLookup.extract",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite.internalIdLookup.searchField":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite.internalIdLookup.searchField",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite.internalIdLookup.expression":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite.internalIdLookup.expression",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite.lookups[*].name":{  

  },
  "netsuite.lookups[*].map":{  
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "netsuite.lookups[*].default":{  

  },
  "netsuite.lookups[*].recordType":{  

  },
  "netsuite.lookups[*].searchField":{  

  },
  "netsuite.lookups[*].expression":{  

  },
  "netsuite.lookups[*].resultField":{  

  },
  "netsuite.lookups[*].includeInactive":{  

  },
  "netsuite.lookups[*].allowFailures":{  

  },
  "netsuite.preferences.ignoreReadOnlyFields":{  
     "path":"netsuite.preferences.ignoreReadOnlyFields",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite.preferences.warningAsError":{  
     "path":"netsuite.preferences.warningAsError",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite.preferences.skipCustomMetadataRequests":{  
     "path":"netsuite.preferences.skipCustomMetadataRequests",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite.file.name":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite.file.name",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite.file.fileType":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite.file.fileType",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite.file.folder":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite.file.folder",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "netsuite.file.internalId":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"netsuite.file.internalId",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "lookups[*].query":{  
     "maxSize":32768
  },
  "rdbms.query[*]":{  
     "maxSize":32768
  },
  "rdbms.queryType[*]":{  
     "enum":[  
        "INSERT",
        "UPDATE"
     ],
     "uppercase":true
  },
  "rdbms.updateLookupName":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"rdbms.updateLookupName",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "rdbms.updateExtract":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"rdbms.updateExtract",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "rdbms.ignoreLookupName":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"rdbms.ignoreLookupName",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "rdbms.ignoreExtract":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"rdbms.ignoreExtract",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "rdbms.lookups[*].name":{  

  },
  "rdbms.lookups[*].map":{  
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "rdbms.lookups[*].default":{  

  },
  "rdbms.lookups[*].query":{  
     "maxSize":32768
  },
  "rdbms.lookups[*].extract":{  

  },
  "rdbms.lookups[*].allowFailures":{  

  },
  "s3.region":{  
     "enumValues":[  
        "us-east-1",
        "us-east-2",
        "us-west-1",
        "us-west-2",
        "ca-central-1",
        "ap-south-1",
        "ap-northeast-2",
        "ap-southeast-1",
        "ap-southeast-2",
        "ap-northeast-1",
        "eu-central-1",
        "eu-west-1",
        "eu-west-2",
        "sa-east-1",
        "cn-north-1"
     ],
     "regExp":null,
     "path":"s3.region",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "us-east-1",
              "us-east-2",
              "us-west-1",
              "us-west-2",
              "ca-central-1",
              "ap-south-1",
              "ap-northeast-2",
              "ap-southeast-1",
              "ap-southeast-2",
              "ap-northeast-1",
              "eu-central-1",
              "eu-west-1",
              "eu-west-2",
              "sa-east-1",
              "cn-north-1"
           ]
        }
     ],
     "setters":[  
        null
     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "us-east-1",
           "us-east-2",
           "us-west-1",
           "us-west-2",
           "ca-central-1",
           "ap-south-1",
           "ap-northeast-2",
           "ap-southeast-1",
           "ap-southeast-2",
           "ap-northeast-1",
           "eu-central-1",
           "eu-west-1",
           "eu-west-2",
           "sa-east-1",
           "cn-north-1"
        ],
        "lowercase":true
     },
     "_index":null
  },
  "s3.bucket":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"s3.bucket",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "s3.fileKey":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"s3.fileKey",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "s3.backupBucket":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"s3.backupBucket",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "lookups[*].sObjectType":{  

  },
  "lookups[*].whereClause":{  

  },
  "salesforce.operation":{  
     "enumValues":[  
        "insert",
        "update",
        "upsert",
        "upsertpicklistvalues",
        "delete"
     ],
     "regExp":null,
     "path":"salesforce.operation",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "insert",
              "update",
              "upsert",
              "upsertpicklistvalues",
              "delete"
           ]
        }
     ],
     "setters":[  
        null
     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "insert",
           "update",
           "upsert",
           "upsertpicklistvalues",
           "delete"
        ],
        "lowercase":true
     },
     "_index":null
  },
  "salesforce.api":{  
     "enumValues":[  
        "rest",
        "soap",
        "metadata",
        "compositerecord"
     ],
     "regExp":null,
     "path":"salesforce.api",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "rest",
              "soap",
              "metadata",
              "compositerecord"
           ]
        }
     ],
     "setters":[  
        null
     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "rest",
           "soap",
           "metadata",
           "compositerecord"
        ],
        "lowercase":true
     },
     "_index":null
  },
  "salesforce.soap.headers.allOrNone":{  
     "path":"salesforce.soap.headers.allOrNone",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.soap.batchSize":{  
     "path":"salesforce.soap.batchSize",
     "instance":"Number",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.sObjectType":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.sObjectType",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.idLookup.extract":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.idLookup.extract",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.idLookup.whereClause":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.idLookup.whereClause",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.upsert.externalIdField":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.upsert.externalIdField",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.upsertpicklistvalues.type":{  
     "enumValues":[  
        "picklist",
        "multipicklist"
     ],
     "regExp":null,
     "path":"salesforce.upsertpicklistvalues.type",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "picklist",
              "multipicklist"
           ]
        }
     ],
     "setters":[  
        null
     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "picklist",
           "multipicklist"
        ],
        "lowercase":true
     },
     "_index":null
  },
  "salesforce.upsertpicklistvalues.fullName":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.upsertpicklistvalues.fullName",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.upsertpicklistvalues.label":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.upsertpicklistvalues.label",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.upsertpicklistvalues.visibleLines":{  
     "path":"salesforce.upsertpicklistvalues.visibleLines",
     "instance":"Number",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.removeNonSubmittableFields":{  
     "path":"salesforce.removeNonSubmittableFields",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.lookups[*].allowFailures":{  

  },
  "salesforce.lookups[*].name":{  

  },
  "salesforce.lookups[*].map":{  
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "salesforce.lookups[*].default":{  
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "salesforce.lookups[*].sObjectType":{  

  },
  "salesforce.lookups[*].resultField":{  

  },
  "salesforce.lookups[*].whereClause":{  

  },
  "salesforce.document.id":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.document.id",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.document.name":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.document.name",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.document.folderId":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.document.folderId",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.document.contentType":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.document.contentType",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.document.developerName":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.document.developerName",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.document.isInternalUseOnly":{  
     "path":"salesforce.document.isInternalUseOnly",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.document.isPublic":{  
     "path":"salesforce.document.isPublic",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.attachment.id":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.attachment.id",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.attachment.name":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.attachment.name",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.attachment.parentId":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.attachment.parentId",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.attachment.contentType":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.attachment.contentType",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.attachment.isPrivate":{  
     "path":"salesforce.attachment.isPrivate",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.attachment.description":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.attachment.description",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.contentVersion.id":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.contentVersion.id",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.contentVersion.title":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.contentVersion.title",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.contentVersion.pathOnClient":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.contentVersion.pathOnClient",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.contentVersion.tagCsv":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.contentVersion.tagCsv",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "salesforce.contentVersion.contentLocation":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"salesforce.contentVersion.contentLocation",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "wrapper.function":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"wrapper.function",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "wrapper.configuration":{  
     "path":"wrapper.configuration",
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "wrapper.lookups[*].name":{  

  },
  "wrapper.lookups[*].map":{  
     "instance":"Mixed",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "_index":null
  },
  "wrapper.lookups[*].default":{  

  },
  "wrapper.lookups[*].allowFailures":{  

  },
  "mongodb.method":{  
     "enumValues":[  
        "insertMany",
        "updateOne"
     ],
     "regExp":null,
     "path":"mongodb.method",
     "instance":"String",
     "validators":[  
        {  
           "message":"`{VALUE}` is not a valid enum value for path `{PATH}`.",
           "type":"enum",
           "enumValues":[  
              "insertMany",
              "updateOne"
           ]
        }
     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "enum":[  
           "insertMany",
           "updateOne"
        ]
     },
     "_index":null
  },
  "mongodb.collection":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"mongodb.collection",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "mongodb.filter":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"mongodb.filter",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "maxSize":32768
     },
     "_index":null
  },
  "mongodb.document":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"mongodb.document",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "maxSize":32768
     },
     "_index":null
  },
  "mongodb.update":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"mongodb.update",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "maxSize":32768
     },
     "_index":null
  },
  "mongodb.upsert":{  
     "path":"mongodb.upsert",
     "instance":"Boolean",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "mongodb.ignoreExtract":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"mongodb.ignoreExtract",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "mongodb.ignoreLookupFilter":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"mongodb.ignoreLookupFilter",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  
        "maxSize":32768
     },
     "_index":null
  },
  "as2.fileNameTemplate":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"as2.fileNameTemplate",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "as2.messageIdTemplate":{  
     "enumValues":[  

     ],
     "regExp":null,
     "path":"as2.messageIdTemplate",
     "instance":"String",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "as2.maxRetries":{  
     "path":"as2.maxRetries",
     "instance":"Number",
     "validators":[  

     ],
     "setters":[  

     ],
     "getters":[  

     ],
     "options":{  

     },
     "_index":null
  },
  "as2.headers[*].name":{  

  },
  "as2.headers[*].value":{  
     "maxSize":4096
  }
}
