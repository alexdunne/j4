module.exports = response => ({
  report: (...messages) => {
    messages.forEach(msg => {
      response.send(msg);
    });
  }
});
