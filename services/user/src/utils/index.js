function formatPayload(payload, event) {
  const formatted = {
    event,
    data: payload
  };

  return JSON.stringify(formatted);
}

module.exports = {
  formatPayload
};
