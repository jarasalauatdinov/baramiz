import type {
  Category,
  ChatMessageRequest,
  ChatMessageResponse,
  GeneratedRoute,
  Place,
  RouteGenerationInput,
} from '../types/api';
import { getCategories as getCategoriesEntity } from '../entities/category/api/categoryApi';
import { sendChatMessage as sendChatMessageEntity } from '../entities/chat/api/chatApi';
import {
  getFeaturedPlaces as getFeaturedPlacesEntity,
  getPlaceById as getPlaceByIdEntity,
  getPlaces as getPlacesEntity,
  type GetPlacesOptions,
} from '../entities/place/api/placeApi';
import { generateRoute as generateRouteEntity } from '../entities/route/api/routeApi';
import { API_BASE_URL } from '../shared/config/api';
import { getHealth as getHealthShared, type HealthResponse } from '../shared/api/healthApi';

export { API_BASE_URL };
export type { GetPlacesOptions };

export const getHealth = async (): Promise<HealthResponse> => getHealthShared();

export const getCategories = async (): Promise<Category[]> => getCategoriesEntity();

export const getPlaces = async (options: GetPlacesOptions = {}): Promise<Place[]> =>
  getPlacesEntity(options);

export const getPlaceById = async (id: string): Promise<Place | null> =>
  getPlaceByIdEntity(id);

export const generateRoute = async (
  data: RouteGenerationInput,
): Promise<GeneratedRoute> => generateRouteEntity(data);

export const sendChatMessage = async (
  data: ChatMessageRequest,
): Promise<ChatMessageResponse> => sendChatMessageEntity(data);

export const getFeaturedPlaces = async (limit = 4): Promise<Place[]> =>
  getFeaturedPlacesEntity(limit);

