
import { create } from "zustand";
import { ThemeConfig } from "antd/lib/config-provider";
import { themeLightConfig } from "@/constants/theme";

interface ColorState {
    themeColor: ThemeConfig;
    setThemeColor: (themeColor: ThemeConfig) => void;
}

export const useColorState = create<ColorState>()((set) => ({
    themeColor: themeLightConfig,
    setThemeColor: (themeColor) => set({ themeColor }),
}));
