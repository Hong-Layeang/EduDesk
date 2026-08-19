import { create } from 'zustand';
import type { CanteenSettings } from '../types/settings.type';
interface SettingsState { settings: CanteenSettings | null; isLoading: boolean; }
export const useSettingsStore = create<SettingsState>(() => ({ settings: null, isLoading: false }));
