export default function (isLoggable) {
  return isLoggable ? {} : {'data-private': true};
}
