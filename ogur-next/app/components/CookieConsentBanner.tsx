"use client";
import CookieConsent from "react-cookie-consent";

export function CookieConsentBanner() {
    return (
        <CookieConsent
            location="bottom"
            buttonText="Akceptuję"
            declineButtonText="Odrzuć"
            enableDeclineButton
            cookieName="ogur-analytics-consent"
            style={{
                background: "#18181b",
                borderTop: "1px solid #3f3f46"
            }}
            buttonStyle={{
                background: "#3b82f6",
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
            Ta strona używa plików cookies oraz Google Analytics do analizy ruchu.
            Więcej informacji w{" "}
            <a href="/legal" className="underline">
                Polityce Prywatności
            </a>.
        </CookieConsent>
    );
}