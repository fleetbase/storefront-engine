import Model, { attr, hasMany } from '@ember-data/model';

export default class ProductStoreLocationModel extends Model {
    /** @ids */
    @attr('string') created_by_uuid;
    @attr('string') company_uuid;

    /** @relationships */
    @hasMany('store') stores;

    /** @attributes */
    @attr('string', { defaultValue: '' }) name;
    @attr('string', { defaultValue: '' }) description;
    @attr('string') slug;

    /** @dates */
    @attr('date') created_at;
    @attr('date') updated_at;

    /** @methods */
    toJSON() {
        return this.serialize();
    }

    /** @computed */
    get updatedAgo() {
        return moment(this.updated_at).fromNow();
    }

    get updatedAt() {
        return moment(this.updated_at).format('DD MMM YYYY');
    }

    get createdAgo() {
        return moment(this.created_at).fromNow();
    }

    get createdAt() {
        return moment(this.created_at).format('DD MMM YYYY');
    }
}
