import Model, { attr, hasMany } from '@ember-data/model';

export default class ProductVariantModel extends Model {
    /** @ids */
    @attr('string') product_uuid;
    @attr('string') created_by_uuid;
    @attr('string') company_uuid;

    /** @relationships */
    @hasMany('product-variant-option') options;

    /** @attributes */
    @attr('string', { defaultValue: '' }) name;
    @attr('string', { defaultValue: '' }) description;
    @attr('boolean') is_multiselect;
    @attr('boolean') is_required;
    @attr('raw') translations;

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
