import CategorySerializer from '@fleetbase/console/serializers/category';

export default class StorefrontCategorySerializer extends CategorySerializer {
    payloadKeyFromModelName() {
        return 'category';
    }

    modelNameFromPayloadKey() {
        return 'storefront-category';
    }
}
