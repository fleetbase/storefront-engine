import Route from '@ember/routing/route';

export default class NetworksIndexNetworkStoresRoute extends Route {
    model() {
        const network = this.modelFor('networks.index.network');

        return this.store.query('store', { network: network.id, without_category: true });
    }

    async setupController(controller, model) {
        super.setupController(controller, model);

        // get the network
        const network = this.modelFor('networks.index.network');

        // set stores to the controller
        controller.stores = model.toArray();

        // set network to controller
        controller.network = network;

        // load the network categories
        const categories = await this.store.query('category', { owner_uuid: network.id, parents_only: true, for: 'storefront_network' });

        // set the categories loaded
        controller.categories = categories.toArray();
    }
}
