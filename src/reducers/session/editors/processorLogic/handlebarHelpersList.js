export default `
abs: {{abs field}}
add: {{add field field}}
and: {{#and field field}} expr {{else}} expr {{/and}}
avg: {{avg field field}}
base64Encode: {{base64Encode field}}
base64Decode: {{base64Decode field decodeFormat}}
capitalize: {{capitalize field}}
capitalizeAll: {{capitalizeAll field}}
ceil: {{ceil field}}
compare: {{#compare field operator field}} expr {{else}} expr {{/compare}}
contains: {{#contains collection field}} expr {{else}} expr {{/contains}}
dateAdd: {{dateAdd dateField offsetField timeZoneField}}
dateFormat: {{dateFormat o/pformat date i/pformat timezone}}
decodeURI: {{decodeURI field}}
divide: {{divide field field}}
each: {{#each field}}{{this}}{{/each}}
encodeURI: {{encodeURI field}}
floor: {{floor field}}
getValue: {{getValue field "defaultValue"}}
hash: {{hash algorithm encoding field}}
hmac: {{hmac algorithm key encoding field keyEncoding}}
if_else: {{#if field}} expr {{else}} expr {{/if}}
ifEven: {{#ifEven field}} expr {{else}} expr {{/ifEven}}
join: {{join delimiterField field1 field2}}
jsonEncode: {{jsonEncode field}}
jsonSerialize: {{jsonSerialize field}}
lookup: {{lookup lookupName contextPath}}
lowercase: {{lowercase field}}
multiply: {{multiply field field}}
neither: {{#neither field field}} expr {{else}} expr {{/neither}}
or: {{#or field field}} expr {{else}} expr {{/or}}
random: {{random “CRYPTO”/“UUID” length}}
regexMatch: {{regexMatch field regex index options}}
regexReplace: {{regexReplace field1 field2 regex options}}
regexSearch: {{regexSearch field regex options}}
replace: {{replace field string string}}
round: {{round field}}
sortnumbers: {{sort field number="true"}}
sortstrings: {{sort field}}
split: {{split field delimiter index}}
substring: {{substring stringField startIndex endIndex}}
subtract: {{subtract field field}}
sum: {{sum <array>}}
timestamp: {{timestamp format timezone}}
toExponential: {{toExponential field fractionDigits}}
toFixed: {{toFixed field digits}}
toPrecision: {{toPrecision field precision}}
trim: {{trim field}}
unless: {{#unless field}} expr {{else}} expr {{/unless}}
uppercase: {{uppercase field}}
with: {{#with field}} {{field1}} {{field2}} {{/with}}`;
