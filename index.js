'use strict';
const { buildEngine } = require('ember-engines/lib/engine-addon');
const { name } = require('./package');

module.exports = buildEngine({
    name,
    lazyLoading: {
        enabled: true,
    },
    _concatStyles: () => {},
    included: function (app) {
        this._super.included.apply(this, arguments);

        // socketcluster
        this.import('node_modules/socketcluster-client/socketcluster-client.min.js', {
            using: [{ transformation: 'es6', as: 'socketcluster' }],
        });
    },
    isDevelopingAddon() {
        return true;
    },
});
