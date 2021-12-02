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
