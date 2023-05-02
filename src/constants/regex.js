// email regex is used in our backend as well and is
// referenced from this repo https://github.com/celigo/integrator-adaptor/blob/master/util/validator.js
export const EMAIL_REGEX = /^[\w\-.+]+@[a-zA-Z0-9.-]+\.[a-zA-z0-9]{2,10}$/;

export const FULL_NAME_WITH_TWO_WORDS = /\w+ \w+/;

// Regular Expression to Simple multiple email addresses separated by commas from regextester.com
export const MULTIPLE_EMAILS = /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/;
// Regular Expression to absolute url, e.g: (https|http)://abc.com but not relative urls such as www.abc.com or abc.com
export const ABS_URL_VALIDATION_PATTERN = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/i;
// eslint-disable-next-line no-useless-escape
// export const URI_VALIDATION_PATTERN = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|localhost|127\.0\.0\.1|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
export const URI_VALIDATION_PATTERN = /(?:(?:https?:)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:1\d\d|2[0-4]\d|25[0-4]|[1-9]\d?)))|\[(?:(?:[\da-f]{1,4}:){7,7}[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,4}:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:1\d\d|2[0-4]\d|25[0-4]|[1-9]\d?)))|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:1\d\d|2[0-4]\d|25[0-4]|[1-9]\d?)))|[\da-f]{1,4}:(?:(?::[\da-f]{1,4}){1,6})|(?:[\da-f]{1,4}:){1,2}(?::[\da-f]{1,4}){1,5}|(?:[\da-f]{1,4}:){1,3}(?::[\da-f]{1,4}){1,4}|(?:[\da-f]{1,4}:){1,4}(?::[\da-f]{1,4}){1,3}|(?:[\da-f]{1,4}:){1,5}(?::[\da-f]{1,4}){1,2}|(?:[\da-f]{1,4}:){1,6}:[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,7}:|:(?:(?::[\da-f]{1,4}){1,7}|:))\]|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?/i;

export const NUMBER_REGEX = /^[\d]+$/;
export const VALID_MONGO_ID = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

export const LAST_EXPORT_DATE_TIME_REGEX_STRING = '.*{{.*lastExportDateTime.*}}';
export const HTTP_PAGING_TOKEN_REGEX_STRING = '.*{{.*export\\.http\\.paging\\.token.*}}';
export const HTTP_PAGING_SKIP_REGEX_STRING = '.*{{.*export\\.http\\.paging\\.skip.*}}';
export const HTTP_PAGING_PAGE_REGEX_STRING = '.*{{.*export\\.http\\.paging\\.page.*}}';

