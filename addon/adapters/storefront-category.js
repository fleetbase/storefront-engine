import ApplicationAdapter from '@fleetbase/ember-core/adapters/application';

export default class StorefrontCategoryAdapter extends ApplicationAdapter {
    pathForType() {
        return 'categories';
    }
}
