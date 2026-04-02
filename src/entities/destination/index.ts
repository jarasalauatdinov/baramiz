export type {
  DestinationConfig,
  DestinationDefinition,
  DestinationMetric,
  DestinationNearbyPoint,
  DestinationSupportCard,
  DestinationSupportData,
} from './model/types';
export { destinationCatalog, destinationSupportFallbacks, destinationTextFallbacks } from './model/catalog';
export {
  featuredDestinations,
  getDestinationByCity,
  getDestinationBySlug,
  getLocalizedDestinationByCity,
  getLocalizedDestinationBySlug,
  getLocalizedDestinationSupportData,
  getLocalizedDestinations,
  localizeDestination,
} from './lib/localizedDestinations';
export { DestinationCard } from './ui/DestinationCard';
export { DestinationNearbyPointCard } from './ui/DestinationNearbyPointCard';