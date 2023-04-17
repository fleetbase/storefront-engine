import Customer from '@fleetbase/fleetops-data/models/customer';
import { attr, hasMany } from '@ember-data/model';

export default class StorefrontCustomerModel extends Customer {
    @attr('string') address;
    @hasMany('storefront-place') addresses;
}
