export default function getImageUrl(url) {
  if (!url || typeof url !== 'string') {
    // If invalid argument passed
    return '';
  }

  if (/^https?:\/\//.test(url)) {
    // If it is an absolute url return as is
    return url;
  }

  // In all other cases, append cdn base uri to the relative uri
  return `${process.env.CDN_BASE_URI}${url.replace(/^\//, '')}`;
}
