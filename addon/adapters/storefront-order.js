import StorefrontAdapter from './storefront';

export default class StorefrontOrderAdapter extends StorefrontAdapter {
    pathForType() {
        return 'orders';
    }
}
