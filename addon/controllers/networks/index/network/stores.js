import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action, set } from '@ember/object';
import consoleUrl from '@fleetbase/console/utils/console-url';
import isEmail from '@fleetbase/console/utils/is-email';

export default class NetworksIndexNetworkStoresController extends Controller {
    @service notifications;
    @service modalsManager;
    @service fetch;
    @service store;
    @tracked network;
    @tracked category;
    @tracked isLoading = false;
    @tracked categories = [];
    @tracked subCategories = [];
    @tracked stores = [];

    dragulaConfig = {
        isContainer: (el) => el.classList.contains('dragula-container'),
        moves: (el) => el.classList.contains('network-store'),
        accepts: (el) => el.classList.contains('network-store'),
        revertOnSpill: true,
    };

    @action dropdownAction(dd, action, ...params) {
        if (dd.actions && typeof dd.actions.close === 'function') {
            dd.actions.close();
        }

        if (typeof this[action] === 'function') {
            this[action](...params);
        }
    }

    @action enterCategory(category) {
        this.category = category;
        this.fetchStores(category);
        this.fetchSubcategories(category);
    }

    @action leaveCategory(parentCategory) {
        if (parentCategory) {
            return this.enterCategory(parentCategory);
        }

        this.category = null;
        this.fetchStores();
    }

    @action deleteCategory(category) {
        this.modalsManager.confirm({
            title: 'Delete network category?',
            body: 'Deleting this category will move all stores inside to the top level, are you sure you want to delete this category?',
            confirm: (modal) => {
                modal.startLoading();

                this.fetch.delete(`networks/${this.network.id}/remove-category`, { category: category.id }, { namespace: 'storefront/int/v1' }).then(() => {
                    this.categories.removeObject(category);
                    this.leaveCategory();
                    modal.done();
                });
            },
        });
    }

    @action fetchSubcategories(parentCategory) {
        this.store
            .query('category', { parent_uuid: parentCategory.id })
            .then((subCategories) => {
                this.subCategories = subCategories.toArray().map((category) => {
                    category.parent_category = parentCategory;

                    return category;
                });
                this.isLoading = false;
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    @action fetchStores(category) {
        const params = {
            network: this.network.id,
        };

        if (category) {
            params.category = category.id;
        } else {
            params.without_category = true;
        }

        this.isLoading = true;

        this.store
            .query('store', params)
            .then((stores) => {
                this.stores = stores.toArray();
                this.isLoading = false;
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    @action setDragulaInstance(dragula) {
        dragula
            .on('over', (el, container) => {
                // console.log('over()', el, container);
                if (container.classList.contains('network-folder')) {
                    container.classList.add('hovering');
                }
            })
            .on('drop', (el, target) => {
                // console.log('drop()', el, target);
                const storeId = el?.dataset?.store;
                const categoryId = target?.dataset?.category;

                Array.from(dragula.containers).forEach((container) => {
                    container.classList.remove('hovering');
                });

                if (categoryId) {
                    const store = this.store.peekRecord('store', storeId);
                    const category = this.store.peekRecord('category', categoryId);

                    this.addStoreToCategory(store, category);
                }
            });
    }

    @action addStoreToCategory(store, category) {
        this.fetch.post(
            `networks/${this.network.id}/set-store-category`,
            {
                category: category.id,
                store: store.id,
            },
            { namespace: 'storefront/int/v1' }
        );
    }

    @action createNewCategory(network) {
        const category = this.store.createRecord('category', {
            owner_uuid: network.id,
            owner_type: 'network:storefront',
            for: 'storefront_network',
        });

        return this.editCategory(category, {
            title: 'Add new network category',
            acceptButtonIcon: 'check',
            category,
            confirm: (modal) => {
                modal.startLoading();

                return category.save().then((category) => {
                    this.notifications.success('New network category created.');
                    this.categories.pushObject(category);
                });
            },
        });
    }

    @action createNewSubCategory(parentCategory) {
        const category = this.store.createRecord('category', {
            parent_uuid: parentCategory.id,
            owner_uuid: parentCategory.owner_uuid,
            owner_type: 'network:storefront',
            for: 'storefront_network',
        });

        return this.editCategory(category, {
            title: 'Add new network category',
            acceptButtonIcon: 'check',
            category,
            confirm: (modal) => {
                modal.startLoading();

                return category.save().then((category) => {
                    this.notifications.success('New network category created.');
                    this.subCategories.pushObject(category);
                });
            },
        });
    }

    @action editCategory(category, options = {}) {
        this.modalsManager.show('modals/create-network-category', {
            title: `Edit category (${category.name})`,
            acceptButtonText: 'Save Changes',
            acceptButtonIcon: 'save',
            iconType: category.icon_file_uuid ? 'image' : 'svg',
            category,
            clearImage: () => {
                category.setProperties({
                    icon_file_uuid: null,
                    icon_url: null,
                    icon_file: null,
                });
            },
            uploadIcon: (file) => {
                this.fetch.uploadFile.perform(
                    file,
                    {
                        path: `uploads/${category.company_uuid}/icons/${category.slug}`,
                        key_uuid: category.id,
                        key_type: `category`,
                        type: `category_icon`,
                    },
                    (uploadedFile) => {
                        category.setProperties({
                            icon_file_uuid: uploadedFile.id,
                            icon_url: uploadedFile.s3url,
                            icon_file: uploadedFile,
                        });
                    }
                );
            },
            confirm: (modal) => {
                modal.startLoading();

                return category.save().then(() => {
                    this.notifications.success('Network category changes saved.');
                });
            },
            ...options,
        });
    }

    @action async addStores(network) {
        this.modalsManager.displayLoader();

        const stores = await this.store.findAll('store');
        const members = await network.loadStores();

        return this.modalsManager.done().then(() => {
            this.modalsManager.show('modals/add-stores-to-network', {
                title: 'Add stores to network',
                acceptButtonIcon: 'check',
                stores,
                members,
                selected: members.toArray(),
                network,
                updateSelected: (selected) => {
                    this.modalsManager.setOption('selected', selected);
                },
                confirm: (modal) => {
                    modal.startLoading();

                    const stores = modal.getOption('selected');
                    const allStores = modal.getOption('stores');
                    const remove = allStores.filter((store) => !stores.includes(store)); // stores to be removed

                    return network.addStores(stores, remove).then(() => {
                        this.updateNetworkStores(stores, remove);
                    });
                },
            });
        });
    }

    @action async removeStore(store, network) {
        this.modalsManager.confirm({
            title: `Remove this store (${store.name}) from this network (${network.name})?`,
            body: 'Are you sure you wish to remove this store from this network? It will no longer be findable by this network.',
            acceptButtonIcon: 'check',
            acceptButtonIconPrefix: 'fas',
            declineButtonIcon: 'times',
            declineButtonIconPrefix: 'fas',
            confirm: (modal) => {
                modal.startLoading();

                this.fetch
                    .post(`networks/${this.network.id}/remove-stores`, { stores: [store.id] }, { namespace: 'storefront/int/v1' })
                    .then(() => {
                        this.stores.removeObject(store);
                        modal.done();
                    })
                    .catch((error) => {
                        modal.stopLoading();
                        this.notifications.serverError(error);
                    });
            },
        });
    }

    @action updateNetworkStores(added = [], removed = []) {
        const updatedStores = [];

        for (let index = 0; index < this.stores.length; index++) {
            const store = this.stores.objectAt(index);

            if (removed.includes(store)) {
                continue;
            }

            updatedStores.push(store);
        }

        for (let index = 0; index < added.length; index++) {
            const addedStore = added.objectAt(index);

            if (updatedStores.includes(addedStore)) {
                continue;
            }

            updatedStores.push(addedStore);
        }

        this.stores = updatedStores.filter(Boolean).uniq();
    }

    @action invite(network) {
        const shareableLink = consoleUrl(`join/network/${network.public_id}`);

        this.modalsManager.show('modals/share-network', {
            title: 'Add stores to network',
            acceptButtonText: 'Send Invitations',
            acceptButtonIcon: 'paper-plane',
            acceptButtonDisabled: true,
            shareableLink,
            recipients: [],
            network,
            addRecipient: (email) => {
                const recipients = this.modalsManager.getOption('recipients');
                recipients.pushObject(email);

                if (recipients.length === 0) {
                    this.modalsManager.setOption('acceptButtonDisabled', true);
                } else {
                    this.modalsManager.setOption('acceptButtonDisabled', false);
                }
            },
            removeRecipient: (index) => {
                const recipients = this.modalsManager.getOption('recipients');
                recipients.removeAt(index);

                if (recipients.length === 0) {
                    this.modalsManager.setOption('acceptButtonDisabled', true);
                } else {
                    this.modalsManager.setOption('acceptButtonDisabled', false);
                }
            },
            toggleShareableLink: (enabled) => {
                set(network, 'options.shareable_link_enabled', enabled);
                network.save();
            },
            confirm: (modal) => {
                modal.startLoading();

                const recipients = modal.getOption('recipients');
                const isValid = recipients.every((email) => isEmail(email));

                if (!isValid) {
                    modal.stopLoading();

                    return this.notifications.error('Invalid emails provided!');
                }

                return network.sendInvites(recipients).then(() => {
                    modal.stopLoading();
                    this.notifications.success('Invitations sent to recipients!');
                });
            },
        });
    }
}
