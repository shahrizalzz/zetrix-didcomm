export function shortenUserName(string) {
  if (!string) {
    return "--";
  }
  const len = string.length;
  if (len > 10) {
    return string.substr(0, 8) + "..." + string.substr(len - 7, len);
  } else {
    return string;
  }
}

export function shortenTxHash(string) {
  if (!string) {
    return "--";
  }
  const len = string.length;
  if (len > 10) {
    return string.substr(0, 4) + "..." + string.substr(len - 6, len);
  } else {
    return string;
  }
}