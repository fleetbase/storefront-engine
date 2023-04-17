import StorefrontAdapter from './storefront';

export default class StorefrontCustomerAdapter extends StorefrontAdapter {
    pathForType() {
        return 'customers';
    }
}
