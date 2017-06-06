process.on('message', (m) => {
    process.env = m
    try{
        const ekconfig = require('../index.js')
    }
    catch (e) {
        process.send(e.name)

    }
});
