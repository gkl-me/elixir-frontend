import { Globe, Laptop, Smartphone } from "lucide-react";
import { UAParser } from "ua-parser-js";




export const formatUserAgent = (uaString: string) => {
    if (!uaString || uaString.includes("axios") || uaString.includes("node")) {
        return { name: "Unknown Device", icon: Globe };
    }
    const parser = new UAParser(uaString);
    const result = parser.getResult();
    const browser = result.browser.name || "Browser";
    const os = result.os.name || "Unknown OS";
    const isMobile = result.device.type === "mobile" || result.device.type === "tablet";

    return {
        name: `${browser} on ${os}`,
        icon: isMobile ? Smartphone : Laptop,
    };
}