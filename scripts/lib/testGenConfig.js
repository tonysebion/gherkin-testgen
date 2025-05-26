// testGenConfig.js
// Centralizes parameter patterns, field mappings, and selector heuristics.
// No longer handles config file loading - all config comes from CLI parameters.

// scripts/testGenConfig.js

// Common parameter patterns and their suggested names
export const parameterPatterns = [
  { match: /name/i, name: 'name' },
  { match: /email/i, name: 'email' },
  { match: /rating/i, name: 'rating' },
  { match: /comment/i, name: 'comment' },
  { match: /message/i, name: 'message' },
  { match: /password/i, name: 'password' },
  { match: /username/i, name: 'username' },
  { match: /age/i, name: 'age' },
  { match: /weight/i, name: 'weight' },
  { match: /height/i, name: 'height' },
  { match: /address/i, name: 'address' },
  { match: /phone/i, name: 'phone' },
  { match: /number/i, name: 'number' },
  { match: /text/i, name: 'text' },
  { match: /value/i, name: 'value' },
  { match: /id/i, name: 'id' }
];

// Heuristic: map param names to likely selectors
export const fieldSelectorMap = {
  name: 'input[name="name"]',
  email: 'input[name="email"]',
  rating: 'select[name="rating"]',
  comment: 'textarea[name="comment"]',
  message: 'textarea[name="message"]',
  password: 'input[name="password"]',
  username: 'input[name="username"]',
  age: 'input[name="age"]',
  weight: 'input[name="weight"]',
  height: 'input[name="height"]',
  address: 'input[name="address"]',
  phone: 'input[name="phone"]',
  number: 'input[name="number"]',
  value: 'input[name="value"]',
  id: 'input[name="id"]',
  date: 'input[type="date"]',
  eventDate: 'input[name="eventDate"]',
  accommodations: 'input[name="accommodations"]',
  accommodationsDescription: 'textarea[name="accommodationsDescription"]',
};

export function getFieldSelector(paramName) {
  // Use the fieldSelectorMap if possible, otherwise default to input[name="paramName"]
  if (fieldSelectorMap[paramName]) {
    return fieldSelectorMap[paramName];
  }
  // Heuristic: textarea for 'description', 'comment', 'message', etc.
  if (/description|comment|message/i.test(paramName)) {
    return `textarea[name="${paramName}"]`;
  }
  // Heuristic: select for 'rating', 'type', etc.
  if (/rating|type|option|status/i.test(paramName)) {
    return `select[name="${paramName}"]`;
  }
  // Heuristic: date for 'date', 'eventDate', etc.
  if (/date/i.test(paramName)) {
    return `input[type="date"]`;
  }  // Default: input
  return `input[name="${paramName}"]`;
}