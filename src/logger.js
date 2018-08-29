class Logger {
  constructor() {}

  log() {
    const log_type = arguments[1];
    const log_value = arguments[2];
    w2ui.layout.content(
      "bottom",
      `${log_type} ${log_value ? log_value + "%" : ""}`
    );
  }
}

module.exports = Logger;
