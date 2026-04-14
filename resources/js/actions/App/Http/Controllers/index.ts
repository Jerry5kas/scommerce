import Api from './Api'
import CatalogController from './CatalogController'
import ProductController from './ProductController'
import FreeSampleController from './FreeSampleController'
import CartController from './CartController'
import SubscriptionController from './SubscriptionController'
import ZoneController from './ZoneController'
import UserAddressController from './UserAddressController'
import AuthController from './AuthController'
import WishlistController from './WishlistController'
import UserController from './UserController'
import OrderController from './OrderController'
import WalletController from './WalletController'
import DeliveryController from './DeliveryController'
import BottleController from './BottleController'
import LoyaltyController from './LoyaltyController'
import ReferralController from './ReferralController'
import CouponController from './CouponController'
import NotificationController from './NotificationController'
import BannerController from './BannerController'
import TrackingController from './TrackingController'
import Admin from './Admin'
const Controllers = {
    Api: Object.assign(Api, Api),
CatalogController: Object.assign(CatalogController, CatalogController),
ProductController: Object.assign(ProductController, ProductController),
FreeSampleController: Object.assign(FreeSampleController, FreeSampleController),
CartController: Object.assign(CartController, CartController),
SubscriptionController: Object.assign(SubscriptionController, SubscriptionController),
ZoneController: Object.assign(ZoneController, ZoneController),
UserAddressController: Object.assign(UserAddressController, UserAddressController),
AuthController: Object.assign(AuthController, AuthController),
WishlistController: Object.assign(WishlistController, WishlistController),
UserController: Object.assign(UserController, UserController),
OrderController: Object.assign(OrderController, OrderController),
WalletController: Object.assign(WalletController, WalletController),
DeliveryController: Object.assign(DeliveryController, DeliveryController),
BottleController: Object.assign(BottleController, BottleController),
LoyaltyController: Object.assign(LoyaltyController, LoyaltyController),
ReferralController: Object.assign(ReferralController, ReferralController),
CouponController: Object.assign(CouponController, CouponController),
NotificationController: Object.assign(NotificationController, NotificationController),
BannerController: Object.assign(BannerController, BannerController),
TrackingController: Object.assign(TrackingController, TrackingController),
Admin: Object.assign(Admin, Admin),
}

export default Controllers