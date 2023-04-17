import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';

export default class NetworksIndexController extends Controller {
    /**
     * Inject the `NetworksIndexNetworkStoresController` controller
     *
     * @memberof NetworksIndexController
     */
    @controller('networks.index.network.stores') networkStoresController;

    /**
     * Inject the `notifications` service
     *
     * @var {Service}
     */
    @service notifications;

    /**
     * Inject the `modals-manager` service
     *
     * @var {Service}
     */
    @service modalsManager;

    /**
     * Inject the `crud` service
     *
     * @var {Service}
     */
    @service crud;

    /**
     * Inject the `currentUser` service
     *
     * @var {Service}
     */
    @service currentUser;

    /**
     * Inject the `store` service
     *
     * @var {Service}
     */
    @service store;

    /**
     * Inject the `fetch` service
     *
     * @var {Service}
     */
    @service fetch;

    /**
     * Inject the `filters` service
     *
     * @var {Service}
     */
    @service filters;

    /**
     * Queryable parameters for this controller's model
     *
     * @var {Array}
     */
    queryParams = ['page', 'limit', 'sort', 'query'];

    @tracked page = 1;
    @tracked limit;
    @tracked query;
    @tracked sort = '-created_at';

    /**
     * The search task.
     *
     * @void
     */
    @task({ restartable: true }) *search({ target: { value } }) {
        // if no query don't search
        if (isBlank(value)) {
            this.query = null;
            return;
        }

        // timeout for typing
        yield timeout(250);

        // reset page for results
        if (this.page > 1) {
            this.page = 1;
        }

        // update the query param
        this.query = value;
    }

    @action sendInvites(network) {
        this.networkStoresController.invite(network);
    }

    @action manageNetwork(network) {
        this.transitionToRoute('networks.index.network', network);
    }

    @action createNetwork() {
        const network = this.store.createRecord('network');
        const currency = this.currentUser.getWhoisProperty('currency.code');

        if (currency) {
            network.setProperties({ currency });
        }

        this.modalsManager.show('modals/create-network', {
            title: 'Create a new network',
            network,
            confirm: (modal) => {
                modal.startLoading();

                return network.save().then((network) => {
                    this.notifications.success('Your new storefront network has been created!');
                    this.networks.pushObject(network);
                });
            },
            decline: () => {
                return network.destroyRecord();
            },
        });
    }

    @action deleteNetwork(network) {
        return this.crud.delete(network);
    }
}
