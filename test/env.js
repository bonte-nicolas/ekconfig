process.on('message', (m) => {
    process.env = m
    const ekconfig = require('../index.js')
    process.send(ekconfig.dump())
});


