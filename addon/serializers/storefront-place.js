import ApplicationSerializer from '@fleetbase/ember-core/serializers/application';

export default class StorefrontPlaceSerializer extends ApplicationSerializer {
    modelNameFromPayloadKey() {
        return 'storefront-place';
    }
}
