export default function openExternalUrl({ url, index = 0, options }) {
  const winPopup = window.open(url, `target=_blank${index}`, options, false);

  try {
    if (winPopup) {
      winPopup.opener = null;
    }
  } catch (ex) {
    // TBD - need to write to splunk ??
  }
}

/**
 * Ref: https://stackoverflow.com/a/2401861
 * Returns name and version of the Browser user currently working on
 * Ex: { name: 'chrome', version: '96' }
 */
export const getBrowserInfo = () => {
  const { userAgent } = navigator;
  let match = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  let temp;

  if (/trident/i.test(match[1])) {
    temp = /\brv[ :]+(\d+)/g.exec(userAgent) || [];

    return { name: 'IE', version: temp[1]};
  }

  if (match[1] === 'Chrome') {
    temp = userAgent.match(/\b(OPR|Edge)\/(\d+)/);

    if (temp !== null) {
      const info = temp.slice(1).join(' ').replace('OPR', 'Opera').split(' ');

      return { name: info[0], version: info[1]};
    }

    temp = userAgent.match(/\b(Edg)\/(\d+)/);

    if (temp !== null) {
      const info = temp.slice(1).join(' ').replace('Edg', 'Edge(Chromium)').split(' ');

      return { name: info[0], version: info[1]};
    }
  }

  match = match[2] ? [match[1], match[2]] : [navigator.appName, navigator.appVersion];
  temp = userAgent.match(/version\/(\d+)/i);

  if (temp !== null) {
    match.splice(1, 1, temp[1]);
  }

  return { name: match[0], version: match[1]};
};

