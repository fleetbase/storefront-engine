import BaseCustomerModel from '@fleetbase/fleetops-data/models/customer';
import { attr, hasMany } from '@ember-data/model';

export default class CustomerModel extends BaseCustomerModel {
    @attr('string') address;
    @hasMany('place') addresses;
}
