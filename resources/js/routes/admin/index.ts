import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import loginDf2c2a from './login'
import users from './users'
import zones from './zones'
import hubs from './hubs'
import routes from './routes'
import zoneOverrides from './zone-overrides'
import drivers from './drivers'
import categories from './categories'
import collections from './collections'
import products from './products'
import files from './files'
import orders from './orders'
import subscriptions from './subscriptions'
import subscriptionPlans from './subscription-plans'
import payments from './payments'
import wallets from './wallets'
import deliveries from './deliveries'
import bottles from './bottles'
import loyalty from './loyalty'
import referrals from './referrals'
import coupons from './coupons'
import campaigns from './campaigns'
import banners from './banners'
import notifications from './notifications'
import wishlistInsights from './wishlist-insights'
import analytics from './analytics'
import reports from './reports'
import activityLogs from './activity-logs'
/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::login
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:15
 * @route '/admin/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/admin/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::login
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:15
 * @route '/admin/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::login
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:15
 * @route '/admin/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::login
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:15
 * @route '/admin/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:18
 * @route '/admin'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:18
 * @route '/admin'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:18
 * @route '/admin'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:18
 * @route '/admin'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::logout
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:44
 * @route '/admin/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/admin/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::logout
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:44
 * @route '/admin/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::logout
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:44
 * @route '/admin/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})
const admin = {
    login: Object.assign(login, loginDf2c2a),
dashboard: Object.assign(dashboard, dashboard),
logout: Object.assign(logout, logout),
users: Object.assign(users, users),
zones: Object.assign(zones, zones),
hubs: Object.assign(hubs, hubs),
routes: Object.assign(routes, routes),
zoneOverrides: Object.assign(zoneOverrides, zoneOverrides),
drivers: Object.assign(drivers, drivers),
categories: Object.assign(categories, categories),
collections: Object.assign(collections, collections),
products: Object.assign(products, products),
files: Object.assign(files, files),
orders: Object.assign(orders, orders),
subscriptions: Object.assign(subscriptions, subscriptions),
subscriptionPlans: Object.assign(subscriptionPlans, subscriptionPlans),
payments: Object.assign(payments, payments),
wallets: Object.assign(wallets, wallets),
deliveries: Object.assign(deliveries, deliveries),
bottles: Object.assign(bottles, bottles),
loyalty: Object.assign(loyalty, loyalty),
referrals: Object.assign(referrals, referrals),
coupons: Object.assign(coupons, coupons),
campaigns: Object.assign(campaigns, campaigns),
banners: Object.assign(banners, banners),
notifications: Object.assign(notifications, notifications),
wishlistInsights: Object.assign(wishlistInsights, wishlistInsights),
analytics: Object.assign(analytics, analytics),
reports: Object.assign(reports, reports),
activityLogs: Object.assign(activityLogs, activityLogs),
}

export default admin