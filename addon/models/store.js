import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { getOwner } from '@ember/application';
import { tracked } from '@glimmer/tracking';
import { format, formatDistanceToNow } from 'date-fns';

export default class StoreModel extends Model {
    /** @ids */
    @attr('string') created_by_uuid;
    @attr('string') company_uuid;
    @attr('string') logo_uuid;
    @attr('string') backdrop_uuid;

    /** @relationships */
    @hasMany('notification-channel') notification_channels;
    @hasMany('gateway') gateways;
    @belongsTo('file') logo;
    @belongsTo('file') backdrop;
    @hasMany('file') files;

    /** @attributes */
    @attr('string', { defaultValue: '' }) name;
    @attr('string', { defaultValue: '' }) description;
    @attr('string', { defaultValue: '' }) website;
    @attr('string', { defaultValue: '' }) email;
    @attr('string', { defaultValue: '' }) phone;
    @attr('string', { defaultValue: '' }) facebook;
    @attr('string', { defaultValue: '' }) instagram;
    @attr('string', { defaultValue: '' }) twitter;
    @attr('string') public_id;
    @attr('string') key;
    @attr('boolean') online;
    @attr('string') currency;
    @attr('string') timezone;
    @attr('string') pod_method;
    @attr('object') options;
    @attr('raw') translations;
    @attr('raw') tags;
    @attr('raw') alertable;
    @attr('string') logo_url;
    @attr('string') backdrop_url;
    @attr('string') slug;

    /** @dates */
    @attr('date') created_at;
    @attr('date') updated_at;

    /** @tracked */
    @tracked isLoadingFiles = false;

    /** @computed */
    get updatedAgo() {
        return formatDistanceToNow(this.updated_at);
    }

    get updatedAt() {
        return format(this.updated_at, 'PPP');
    }

    get createdAgo() {
        return formatDistanceToNow(this.created_at);
    }

    get createdAt() {
        return format(this.created_at, 'PPP p');
    }

    /** @methods */
    toJSON() {
        return {
            name: this.name,
            description: this.description,
            currency: this.currency,
            timezone: this.timezone,
            options: this.options,
        };
    }

    loadFiles() {
        const owner = getOwner(this);
        const store = owner.lookup(`service:store`);

        this.isLoadingFiles = true;

        return new Promise((resolve) => {
            return store
                .query('file', { subject_uuid: this.id, type: 'storefront_store_media' })
                .then((files) => {
                    this.files = files.toArray();
                    this.isLoadingFiles = false;

                    resolve(files);
                })
                .catch((error) => {
                    this.isLoadingFiles = false;
                    resolve([]);
                    throw error;
                });
        });
    }
}
