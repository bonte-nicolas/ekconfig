const { test } = require('ava');
const config = require('../index');
const childProcess = require('child_process');

test.cb('I can override conf directory path ', t => {
    const child = childProcess.fork(`${__dirname}/env.js`);
    child.send({NODE_CONFIG_DIR: 'test/conf'});
    child.on('message', message => {
        t.deepEqual(message, { name: "test-app", port: 80, uuid: "01A", version: "0.0.1" })
        t.end()
    })
});


test.cb('check merge order', t => {
    const child = childProcess.fork(`${__dirname}/env.js`);
    child.send({NODE_CONFIG_DIR: 'test/conf', NODE_ENV: 'prod', PORT: 8082});
    child.on('message', message => {
        t.deepEqual(message, {name: "test-app", port: 8082, uuid: "01A", version: "0.0.2", env: 'prod'})
        t.end()
    })
});



test.cb('set node env', t => {
    const child = childProcess.fork(`${__dirname}/env.js`);
    child.send({NODE_CONFIG_DIR: 'test/conf', NODE_ENV: 'prod'});
    child.on('message', message => {
        t.deepEqual(message, { name: "test-app", port: 8081, uuid: "01A", version: "0.0.2", env: 'prod' })
        t.end()
    })
});

test.cb('use default config directory and check cast', t => {
    const child = childProcess.fork(`${__dirname}/cast.js`);
    child.send({PORT : 8080, NAME : 'app', ID : '12'});
    child.on('message', message => {
        t.deepEqual(typeof message.port, 'number')
        t.deepEqual(typeof message.name, 'string')
        t.deepEqual(typeof message.id, 'string')
        t.end()
    })

});

test.cb('throw error when env_mapping have wrong format', t => {
    const child = childProcess.fork(`${__dirname}/throw.js`);
    child.send({NODE_CONFIG_DIR : 'test/format_envMapping_conf'});
    child.on('message', message => {
        t.deepEqual(message, 'YAMLException')
        t.end()
    })

});

test.cb('throw error when base.yaml have wrong format', t => {
    const child = childProcess.fork(`${__dirname}/throw.js`);
    child.send({NODE_CONFIG_DIR : 'test/format_base_conf'});
    child.on('message', message => {
        t.deepEqual(message, 'YAMLException')
        t.end()
    })
});

test.cb('throw error when envorinment variable is Not a Number', t => {
    const child = childProcess.fork(`${__dirname}/throw.js`);
    child.send({NODE_CONFIG_DIR : 'test/NaN_conf', PORT : '8080a'});
    child.on('message', message => {
        t.deepEqual(message, 'Error')
        t.end()
    })

});

test.cb('throw error when there is not base.yaml', t => {
    const child = childProcess.fork(`${__dirname}/throw.js`);
    child.send({NODE_CONFIG_DIR : 'test/no_base_conf'});
    child.on('message', message => {
        t.deepEqual(message, 'Error')
        t.end()
    })

});

test('add an element', t => {
    t.deepEqual(config.get('test'), undefined);
    config.set('test', 'value');
    t.deepEqual(config.get('test'), 'value');
});

test('add an element with dot notation', t => {
    t.deepEqual(config.get('test.subtest'), undefined);
    config.set('test.subtest', 'value');
    t.deepEqual(config.get('test.subtest'), 'value');
});

test('add an element with dot and array notation', t => {
    t.deepEqual(config.get('test.subtestarray[0]'), undefined);
    config.set('test.subtestarray[0].subsubtest', 'value');
    t.deepEqual(config.get('test.subtestarray[0]'), { subsubtest: 'value' });
});

test('delete an element', t => {
    config.set('toDelete', 'value')
    t.deepEqual(config.get('toDelete'), 'value')
    config.set('toDelete')
    t.deepEqual(config.get('toDelete'), undefined)
});

test('delete an element with dot notation', t => {
    t.deepEqual(config.get('test'), { subtest: 'value', subtestarray: [ { subsubtest: 'value' } ] })
    t.deepEqual(config.get('test.subtest'), 'value');
    config.set('test.subtest');
    t.deepEqual(config.get('test.subtest'), undefined);
    t.deepEqual(config.get('test'), { subtestarray: [ { subsubtest: 'value' } ] })
});

test('delete an element with dot and array notation', t => {
    t.deepEqual(config.get('test'), { subtestarray: [ { subsubtest: 'value' } ] })
    t.deepEqual(config.get('test.subtestarray'), [{subsubtest: 'value'}]);
    config.set('test.subtestarray');
    t.deepEqual(config.get('test.subtestarray'), undefined);
    t.deepEqual(config.get('test'), {})
});

test('update an available element', t => {
    config.set('test', 'value' );
    config.set('test', 'newValue');
    t.deepEqual(config.get('test'), 'newValue');
});

test('get an available element', t => {
    t.deepEqual(config.get('test'), 'newValue');
});

test('get an element with dot  notation', t => {
    config.set('test.subtest', 'value');
    t.deepEqual(config.get('test.subtest'), 'value');
});

test('get an element with dot and array notation', t => {
    config.set('test.subtestarray[0].subsubtest', 'value');
    t.deepEqual(config.get('test.subtestarray[0]'), { subsubtest: 'value' });
});

test('get an unavailable element', t => {
    t.deepEqual(config.get('test3'), undefined);
});
