'use strict'

const _ = require('lodash')
const yaml = require('js-yaml')
const fs = require('fs')

const internals = {}

const filename = require.main.filename;
const filepath = filename.slice(0, filename.lastIndexOf("/"));

internals.config = {}

internals.basePath = process.env.NODE_CONFIG_DIR ? `${process.env.NODE_CONFIG_DIR}/base.yaml` : `./conf/base.yaml`
internals.envMappingPath = process.env.NODE_CONFIG_DIR ? `${process.env.NODE_CONFIG_DIR}/env_mapping.yaml` : `./conf/env_mapping.yaml`
internals.overridesPath = process.env.NODE_ENV ? process.env.NODE_CONFIG_DIR ? `${process.env.NODE_CONFIG_DIR}/${process.env.NODE_ENV}.yaml` : `./conf/${process.env.NODE_ENV}.yaml` : null

/**
 * Get a value from the configuration. Supports dot notation (eg: "key.subkey.subsubkey")...
 *
 * @param {string} key - Key. Support dot notation.
 * @returns {*} value
 */
exports.get = key => _.get(internals.cfg, key)

/**
 * Set a value in the configuration. Supports dot notation (eg: "key.subkey.subsubkey")
 * and array notation (eg: "key.subkey[0].subsubkey").
 *
 * @param {string} key   - Key. Support dot notation.
 * @param {object} value - value. If null or undefined, key is removed.
 * @returns {void}
 */
exports.set = (key, value) => {
    if (_.isUndefined(value) || _.isNull(value)) {
        _.unset(internals.cfg, key)
    } else {
        _.set(internals.cfg, key, value)
    }
}

/**
 * Dumps the whole config object.
 *
 * @returns {object} The whole config object
 */
exports.dump = () => internals.cfg

/** ***** Internals **********/

/**
 * Read a yaml file and convert it to json.
 * WARNING : This use a sync function to read file
 * @param {string} path
 * @return {Object}
 */
internals.read = path => {
    const content = fs.readFileSync(`${filepath}/${path}`, { encoding: 'utf8' })
    let result = yaml.safeLoad(content)
    _.forOwn(result, (value, key) => {
        if(value.type === 'number'){
            if(!isNaN(parseInt(value.value))){
                result[key] = { value: parseInt(value.value) }
            }
            else{
                throw new Error(`'${value.value}' is NaN`)
            }
        }
        else if(value.type === 'string'){
            result[key] = { value: (value.value).toString() }
        }
        else{
            throw new Error('invalid type')
        }
    })
    return result
}


/**
 * Read env variables override file and set config from env vars
 * @return {Object}
 */
internals.readEnvOverrides = () => {
    const result = {}

    try {
        const content = internals.read(internals.envMappingPath)
        _.forOwn(content, (value, key) => {
            _.set(result, key, value)
        })
    } catch (e) {
        console.info('No environment vars mapping')
    }

    return result
}

/**
 * Return the source value if it is an array
 * This function is used to customize the default output of _.mergeWith
 *
 * @param {*} objValue: the target field content
 * @param {*} srcValue: the new value
 * @returns {*}: return what we want as a value, or undefined to let the default behaviour kick in
 */
internals.customizer = (objValue, srcValue) => {
    return _.isArray(srcValue) ? srcValue : undefined
}

/**
 * Read base file, override it with env file and finally override it with env vars
 */
internals.load = () => {
    const base = internals.read(internals.basePath)
    let env = {}
    if (internals.overridesPath) {
        try {
            env = internals.read(internals.overridesPath)
        } catch (e) {
            console.info('No environment config file found')
        }
    }

    const envOverrides = internals.readEnvOverrides()

    internals.cfg = _.mergeWith({}, base, env, envOverrides, internals.customizer)
}

internals.load()
