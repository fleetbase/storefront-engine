import ApplicationAdapter from '@fleetbase/ember-core/adapters/application';

export default class StorefrontPlaceAdapter extends ApplicationAdapter {
    pathForType() {
        return 'drivers';
    }
}
