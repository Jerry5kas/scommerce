import ConfigController from './ConfigController'
import PaymentWebhookController from './PaymentWebhookController'
import V1 from './V1'
const Api = {
    ConfigController: Object.assign(ConfigController, ConfigController),
PaymentWebhookController: Object.assign(PaymentWebhookController, PaymentWebhookController),
V1: Object.assign(V1, V1),
}

export default Api