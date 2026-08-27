function logger(message) {
    const time = new Date().toLocaleString();
    console.log(`[${time}] ${message}`);
}

module.exports = logger;