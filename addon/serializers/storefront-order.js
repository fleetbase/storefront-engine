import ApplicationSerializer from '@fleetbase/ember-core/serializers/application';

export default class StorefrontOrderSerializer extends ApplicationSerializer {
    payloadKeyFromModelName() {
        return 'order';
    }

    modelNameFromPayloadKey() {
        return 'storefront-order';
    }
}
