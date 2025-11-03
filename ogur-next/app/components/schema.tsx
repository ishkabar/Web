export function Schema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Dominik Karczewski",
        "alternateName": ["Ogur", "ogur.dev"],
        "url": "https://ogur.dev",
        "image": "https://ogur.dev/og-image.png",
        "jobTitle": "Senior .NET Developer",
        "worksFor": {
            "@type": "Organization",
            "name": "Dominik Karczewski",
            "url": "https://ogur.dev",
            "logo": "https://ogur.dev/og-image.png",
            "sameAs": ["https://ogur.dev"]
        },
        "description": "Senior .NET Developer specjalizujący się w architekturze systemów, Docker, Discord bots, aplikacjach desktop i systemach backend. Tworzę zaawansowane aplikacje w C#, ASP.NET Core, WPF oraz boты Discord. Ekspert w zakresie Docker, Traefik, PostgreSQL, Redis, MySQL i Firebird.",
        "knowsAbout": [
            ".NET",
            "C#",
            "ASP.NET Core",
            "Senior .NET Developer",
            "Backend Developer",
            "Programista .NET",
            "Docker",
            "Traefik",
            "Discord Bots",
            "Bot Discord",
            "WPF",
            "DevExpress",
            "Aplikacje Desktop",
            "PostgreSQL",
            "MySQL",
            "Redis",
            "Firebird",
            "Architektura systemów",
            "Microservices",
            "REST API",
            "Systemy rozproszone",
            "Wdrożenia Docker",
            "CI/CD",
            "GitHub Actions",
            "Linux",
            "Konsultacje techniczne",
            "Audyt kodu",
            "Code Review",
            "Clean Architecture",
            "Domain-Driven Design",
            "CQRS",
            "Entity Framework",
            "Dapper"
        ],
        "knowsLanguage": [
            {
                "@type": "Language",
                "name": "Polski",
                "alternateName": "pl"
            },
            {
                "@type": "Language",
                "name": "English",
                "alternateName": "en"
            }
        ],
        "sameAs": [
            "https://github.com/ishkabar",
            "https://ogur.dev"
        ],
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "PL",
            "addressLocality": "Jedlnia-Letnisko",
            "postalCode": "26-630",
            "streetAddress": "Piotrowicka 14"
        },
        "areaServed": {
            "@type": "Country",
            "name": "Polska"
        },
        "email": "kontakt@ogur.dev",
        "vatID": "PL7963019557",
        "nationality": {
            "@type": "Country",
            "name": "Polska"
        },
        "alumniOf": {
            "@type": "Organization",
            "name": "Senior .NET Developer"
        },
        "makesOffer": [
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Tworzenie aplikacji .NET",
                    "description": "Profesjonalne tworzenie aplikacji w technologii .NET (C#, ASP.NET Core)"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Aplikacje Desktop",
                    "description": "Projektowanie i wdrażanie aplikacji desktop (WPF, DevExpress)"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Boty Discord",
                    "description": "Rozwój i wdrażanie zaawansowanych botów Discord"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Wdrożenia Docker",
                    "description": "Wdrożenia systemów z wykorzystaniem Docker i Traefik"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Konsultacje techniczne",
                    "description": "Konsultacje techniczne, audyty kodu i code review"
                }
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}