import ApplicationSerializer from '@fleetbase/ember-core/serializers/application';

export default class StorefrontDriverSerializer extends ApplicationSerializer {
    modelNameFromPayloadKey() {
        return 'storefront-driver';
    }

    serializeHasMany(snapshot, json, relationship) {
        let key = relationship.key;
        if (key === 'fleets') {
            return;
        } else {
            super.serializeHasMany(...arguments);
        }
    }

    serializeBelongsTo(snapshot, json, relationship) {
        let key = relationship.key;
        if (key === 'driver' || key === 'vendor') {
            return;
        } else {
            super.serializeHasMany(...arguments);
        }
    }
}
