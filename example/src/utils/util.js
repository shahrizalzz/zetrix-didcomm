import { v4 as uuidv4 } from 'uuid';

export function parseStringToJson(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return false;
  }
}

export function createUUID() {
  return uuidv4();
}

export function getCurrentTimestampMillis() {
  return Date.now(); // Returns Unix timestamp in milliseconds
}

export function encodeToBase64(input) {
  // Convert the input to UTF-8
  const utf8Encoded = new TextEncoder().encode(input);

  // Encode the UTF-8 bytes to Base64
  const base64Encoded = btoa(String.fromCharCode(...utf8Encoded));

  return base64Encoded;
}

export function decodeFromBase64(base64String) {
  const utf8Decoded = atob(base64String)
    .split('')
    .map((char) => char.charCodeAt(0));
  return new TextDecoder().decode(new Uint8Array(utf8Decoded));
}

export function formatTimestampToTime(timestamp) {
  const date = new Date(timestamp);

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // Determine AM or PM
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert 24-hour format to 12-hour format
  hours = hours % 12 || 12; // If hour is 0, set to 12

  // Return formatted time
  return `${hours}:${minutes}:${seconds} ${ampm}`;
}
