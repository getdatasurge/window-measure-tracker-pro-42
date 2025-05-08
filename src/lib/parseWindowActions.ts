import { Action } from "@/types/dashboard";

/**
 * Parses a string of window actions into an array of Action objects.
 *
 * @param {string} actions - A string of window actions, separated by commas.
 * @returns {Action[]} An array of Action objects.
 */
export const parseWindowActions = (actions: string): Action[] => {
  if (!actions) {
    return [];
  }

  // Split the actions string into an array of individual actions
  const actionArray = actions.split(",");

  // Map each action string to an Action object
  return actionArray.map((action) => {
    // Trim whitespace from the action string
    const trimmedAction = action.trim();

    // Split the action string into an array of key-value pairs, separated by colons
    const keyValueArray = trimmedAction.split(":");

    // Extract the key and value from the key-value array
    const key = keyValueArray[0];
    const value = keyValueArray[1];

    // Return an Action object with the key and value
    return {
      key: key,
      value: value,
    };
  });
};

/**
 * Parses a string of window actions into an object of key-value pairs.
 *
 * @param {string} actions - A string of window actions, separated by commas.
 * @returns {object} An object of key-value pairs.
 */
export const parseWindowActionsToObject = (actions: string): object => {
  if (!actions) {
    return {};
  }

  // Split the actions string into an array of individual actions
  const actionArray = actions.split(",");

  // Reduce the array of actions into an object of key-value pairs
  return actionArray.reduce((obj, action) => {
    // Trim whitespace from the action string
    const trimmedAction = action.trim();

    // Split the action string into an array of key-value pairs, separated by colons
    const keyValueArray = trimmedAction.split(":");

    // Extract the key and value from the key-value array
    const key = keyValueArray[0];
    const value = keyValueArray[1];

    // Add the key-value pair to the object
    obj[key] = value;

    // Return the object
    return obj;
  }, {});
};

/**
 * Parses a string of actions into an array of strings.
 *
 * @param {string} action - A string of actions, separated by commas.
 * @returns {string[]} An array of strings.
 */
// Fix the TS error related to split not existing on type never
// This might be a simplified fix - the actual code might need more context
const parseActionString = (action: string | undefined): string[] => {
  if (!action) return [];
  return action.split(',').map(a => a.trim());
};

/**
 * Parses a string of actions into an array of strings.
 *
 * @param {string} actions - A string of actions, separated by commas.
 * @returns {string[]} An array of strings.
 */
export const parseWindowActionString = (actions: string): string[] => {
  if (!actions) {
    return [];
  }

  // Split the actions string into an array of individual actions
  const actionArray = actions.split(",");

  // Map each action string to an Action object
  return actionArray.map((action) => {
    // Trim whitespace from the action string
    return action.trim();
  });
};
