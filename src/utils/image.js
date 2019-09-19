export default function formattedImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return '';
  }

  return url.replace(/^\/images\//, '');
}
