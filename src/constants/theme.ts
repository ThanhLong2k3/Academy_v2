import { theme } from "antd";
import { ThemeConfig } from "antd/lib/config-provider";

export const themeDarkConfig: ThemeConfig = {
    algorithm: [
        theme.darkAlgorithm,
    ],
    token: {
        colorBgElevated: '#141414',
        colorPrimaryText: '#141414',
        colorBgLayout: '#141414',
        colorPrimary: '#00b96b',
        colorBorder: "rgba(253, 253, 253, 0.12)",
        borderRadius: 5,
        colorLink: "#ffffff",
        colorLinkHover: "#000000",
        fontFamily: "Reddit Sans, sans-serif",
    },
    components: {
        Layout: {
            headerBg: "#141414"
        },
    }
}

export const themeLightConfig: ThemeConfig = {
    algorithm: [
        theme.defaultAlgorithm,
    ],
    token: {
        colorBgElevated: '#ffffff',
        colorBgLayout: '#ffffff',
        colorPrimaryText: '#ffffff',
        colorPrimary: '#1677ff',
        colorBorder: "rgba(5, 5, 5, 0.06)",
        borderRadius: 5,
        colorLink: "#000000",
        colorLinkHover: "#000000",
        fontFamily: "Reddit Sans, sans-serif",

    },
    components: {
        Layout: {
            headerBg: "#ffffff"
        },
        Table: {
            rowExpandedBg: "#ffffff"
        },
    }
}

export const themeBlueConfig: ThemeConfig = {
    algorithm: [
        theme.defaultAlgorithm,
    ],
    token: {
        colorPrimaryText: "#284973", 
        // colorBgElevated: "#284973", 
        colorBgLayout: '#ffffff',   
        colorBorder: "#e1e1e1",
        colorPrimary: '#284973',
        borderRadius: 5,
        fontFamily: "Reddit Sans, sans-serif",

    },
    components: {
        Menu: {
            colorBgContainer: "#284973",
            colorBgElevated: "#284973", // bg child menu when hover or active li parent
            colorText: "#ffffff",
            colorBorder: "#e1e1e1",
            colorPrimary: '#8abbff',
            controlItemBgActive: '#1a3357',
        },
        Typography: {
            colorLink: "#000000",
            colorLinkHover: "#000000",
        },
        Drawer: {
            colorBgElevated: "#284973",
            colorText: "#ffffff",
            colorIcon: "#ffffff",
            colorIconHover: "#ffffff",
        },
        Layout: {
            headerBg: "#284973"
        },
        Table: {
            controlItemBgActive: "#c8ced2",
            controlItemBgActiveHover: "#c8ced2",
            rowExpandedBg: "#ffffff"
            
        }
    }
}


export const themeBrownConfig: ThemeConfig = {
    algorithm: [
        theme.defaultAlgorithm,
    ],
    token: {
        // colorBgElevated: "#48433d", 
        colorPrimaryText: "#48433d", 
        colorBgLayout: '#ffffff',
        colorBorder: "#e1e1e1",
        colorPrimary: '#48433d',
        borderRadius: 5,
        fontFamily: "Reddit Sans, sans-serif",
    },
    components: {
        Menu: {
            colorBgContainer: "#48433d",
            colorBgElevated: "#48433d", // bg child menu when hover or active li parent
            colorText: "#ffffff",
            colorBorder: "#e1e1e1",
            colorPrimary: '#ab7632',    
            controlItemBgActive: '#2e2923',
        },
        Typography: {
            colorLink: "#000000",
            colorLinkHover: "#000000",
        },
        Drawer: {
            colorBgElevated: "#48433d",
            colorText: "#ffffff",
            colorIcon: "#ffffff",
            colorIconHover: "#ffffff",
        },
        Layout: {
            headerBg: "#48433d"
        },
        Table: {
            controlItemBgActive: "#b0afab",
            controlItemBgActiveHover: "#b0afab",
            rowExpandedBg: "#ffffff"

        }
    }
}

// const handleCheckTheme = () => {
//     const key = "color"
//     const themeColor = storage.getStorage(`V-OSINT3_${key}`);
//     console.log(themeColor);

//     switch (themeColor) {
//         case "black": return themeDarkConfig;
//         case "white": return themeLightConfig;
//         case "blue": return themeDarkConfig;
//     }

//     return themeLightConfig;
// }

// export const themeConfig:ThemeConfig = handleCheckTheme();
