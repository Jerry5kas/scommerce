import deliveries from './deliveries'
import location from './location'
import bottles from './bottles'
const driver = {
    deliveries: Object.assign(deliveries, deliveries),
location: Object.assign(location, location),
bottles: Object.assign(bottles, bottles),
}

export default driver