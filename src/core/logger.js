/**
 * Logging Utility Module
 * Provides a simple logging function for the healing process.
 * All log messages are prefixed with '[Healing]' for easy identification.
 */

/**
 * Logs a message to the console if logging is enabled.
 * @param {string} message - The message to log
 * @param {boolean} [enabled=true] - Whether to actually log the message
 */
function log(message, enabled = true) {
  // Only log if logging is enabled (default is true)
  if (enabled) {
    // Prefix all messages with '[Healing]' for easy filtering
    console.log(`[Healing] ${message}`);
  }
}

// Export the logging function
export { log };