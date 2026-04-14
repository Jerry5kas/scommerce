import DeliveryController from './DeliveryController'
import BottleController from './BottleController'
const Driver = {
    DeliveryController: Object.assign(DeliveryController, DeliveryController),
BottleController: Object.assign(BottleController, BottleController),
}

export default Driver