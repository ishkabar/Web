"use client";
import CookieConsent from "react-cookie-consent";
import { useTranslations } from "next-intl";

export function CookieConsentBanner() {
    const t = useTranslations("common.cookies");

    return (
        <CookieConsent
            location="bottom"
            buttonText={t("accept")}
            declineButtonText={t("decline")}
            enableDeclineButton
            cookieName="portfolio-analytics-consent"
            style={{
                background: "#18181b",
                borderTop: "1px solid #3f3f46"
            }}
            buttonStyle={{
                background: "#512BD4",
                color: "#fff",
                fontSize: "14px",
                borderRadius: "4px",
                padding: "8px 16px"
            }}
            declineButtonStyle={{
                background: "transparent",
                color: "#a1a1aa",
                border: "1px solid #3f3f46",
                fontSize: "14px",
                borderRadius: "4px",
                padding: "8px 16px"
            }}
            expires={365}
        >
            {t("message")}
        </CookieConsent>
    );
}