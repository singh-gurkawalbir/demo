export default function openExternalUrl({ url, options }) {
  const winPopup = window.open(url, 'target=_blank', options, false);

  try {
    if (winPopup) {
      winPopup.opener = null;
    }
  } catch (ex) {
    // TBD - need to write a splunk
  }
}
