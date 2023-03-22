#!/bin/bash
# routes
ember g route customers/index
ember g route customers/index/edit
ember g route networks/index
ember g route networks/index/network
ember g route networks/index/network/index
ember g route networks/index/network/customers
ember g route networks/index/network/orders
ember g route networks/index/network/stores
ember g route orders/index
ember g route orders/index/edit
ember g route orders/index/new
ember g route orders/index/view
ember g route products/index
ember g route products/index/category
ember g route products/index/category/edit
ember g route products/index/category/new
ember g route settings/index
ember g route settings/api
ember g route settings/locations
ember g route settings/notifications

# controllers 
ember g controller customers/index
ember g controller networks/index
ember g controller networks/index/network
ember g controller networks/index/network/index
ember g controller networks/index/network/customers
ember g controller networks/index/network/orders
ember g controller networks/index/network/stores
ember g controller orders/index
ember g controller products/index
ember g controller products/index/category
ember g controller products/index/category/edit
ember g controller products/index/category/new
ember g controller settings/index
ember g controller settings/api
ember g controller settings/locations
ember g controller settings/notifications

# services
ember g service storefront

# utils
ember g util get-gateway-schemas
ember g util get-notification-schemas

# helpers
ember g helper get-tip-amount

# models
ember g model addon-category
ember g model gateway
ember g model network
ember g model notification-channel
ember g model product-addon-category
ember g model product-addon
ember g model product-hour
ember g model product-store-location
ember g model product-variant-option
ember g model product-variant
ember g model product
ember g model store-hour
ember g model store-location
ember g model store

# serializers
ember g serializer addon-category
ember g serializer network
ember g serializer notification-channel
ember g serializer product-addon-category
ember g serializer product-variant
ember g serializer product
ember g serializer store-location
ember g serializer store

# components
ember g component modals/add-store-hours
ember g component modals/add-stores-to-network
ember g component modals/assign-driver
ember g component modals/create-first-store
ember g component modals/create-gateway
ember g component modals/create-network-category
ember g component modals/create-network
ember g component modals/create-new-variant
ember g component modals/create-notification-channel
ember g component modals/create-product-category
ember g component modals/create-store
ember g component modals/edit-network
ember g component modals/import-products
ember g component modals/incoming-order
ember g component modals/manage-addons -gc
ember g component modals/order-ready-assign-driver
ember g component modals/select-addon-category
ember g component modals/share-network
ember g component widget/customers -gc
ember g component widget/orders -gc
ember g component widget/storefront-metrics -gc
