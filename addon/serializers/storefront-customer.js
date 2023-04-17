import ApplicationSerializer from '@fleetbase/ember-core/serializers/application';

export default class StorefrontCustomerSerializer extends ApplicationSerializer {
    modelNameFromPayloadKey() {
        return 'storefront-customer';
    }
}
