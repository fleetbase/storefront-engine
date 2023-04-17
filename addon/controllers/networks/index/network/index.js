import Controller, { inject as controller } from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { action } from '@ember/object';
import getPodMethods from '@fleetbase/console/utils/get-pod-methods';

export default class NetworksIndexNetworkIndexController extends Controller {
    @controller('settings.gateways') gatewaysController;
    @controller('settings.notifications') notificationsController;
    @service notifications;
    @service fetch;
    @tracked podMethods = getPodMethods();
    @tracked isLoading = false;
    @alias('model.gateways') gateways;
    @alias('model.notification_channels') channels;

    @action saveSettings() {
        this.isLoading = true;

        this.model.save().then(() => {
            this.notifications.success('Changes saved');
            this.isLoading = false;
        });
    }

    @action uploadFile(type, file) {
        const prefix = type.replace('storefront_', '');

        this.fetch.uploadFile.perform(
            file,
            {
                path: `uploads/storefront/${this.model.id}/${type}`,
                key_uuid: this.model.id,
                key_type: `network:storefront`,
                type,
            },
            (uploadedFile) => {
                this.model.setProperties({
                    [`${prefix}_uuid`]: uploadedFile.id,
                    [`${prefix}_url`]: uploadedFile.s3url,
                    [prefix]: uploadedFile,
                });
            }
        );
    }

    @action createGateway() {
        const gateway = this.store.createRecord('gateway', {
            owner_uuid: this.model.id,
            owner_type: 'network:storefront',
        });

        this.editGateway(gateway, {
            title: `Create a new payment gateway`,
            acceptButtonText: 'Save Gateway',
            confirm: (modal) => {
                modal.startLoading();

                return gateway.save().then((gateway) => {
                    this.notifications.success(`New gateway added to network`);
                    this.gateways.pushObject(gateway);
                });
            },
            decline: (modal) => {
                gateway.destroyRecord();
                modal.done();
            },
        });
    }

    @action editGateway(gateway, options = {}) {
        if (options === null) {
            options = {};
        }

        if (!options.confirm) {
            options.confirm = (modal) => {
                modal.startLoading();

                return gateway.save().then(() => {
                    this.notifications.success(`Payment gateway changes saved!`);
                });
            };
        }

        return this.gatewaysController.editGateway(gateway, options);
    }

    @action deleteGateway() {
        return this.gatewaysController.deleteGateway(...arguments);
    }

    @action createChannel() {
        const channel = this.store.createRecord('notification-channel', {
            owner_uuid: this.model.id,
            owner_type: 'network:storefront',
        });

        this.editChannel(channel, {
            title: `Create a new notification channel`,
            acceptButtonText: 'Create Notification Channel',
            confirm: (modal) => {
                modal.startLoading();

                return channel.save().then((channel) => {
                    this.notifications.success(`New notification channel added to network!`);
                    this.channels.pushObject(channel);
                });
            },
            decline: (modal) => {
                channel.destroyRecord();
                modal.done();
            },
        });
    }

    @action editChannel(channel, options = {}) {
        if (options === null) {
            options = {};
        }

        if (!options.confirm) {
            options.confirm = (modal) => {
                modal.startLoading();

                return channel.save().then(() => {
                    this.notifications.success(`Notification channel changes saved!`);
                });
            };
        }

        return this.notificationsController.editChannel(channel, options);
    }

    @action deleteChannel() {
        return this.notificationsController.deleteChannel(...arguments);
    }

    @action makeAlertable(reason, models) {
        if (!this.model.alertable || !this.model.alertable?.length) {
            this.model.set('alertable', {});
        }

        this.model.set(`alertable.${reason}`, models);
    }
}
