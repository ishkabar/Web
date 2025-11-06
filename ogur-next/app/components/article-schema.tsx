interface ArticleSchemaProps {
    title: string;
    description: string;
    image: string;
    datePublished: string;
    url: string;
}

export function ArticleSchema({ title, description, image, datePublished, url }: ArticleSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": {
            "@type": "ImageObject",
            "url": `https://ogur.dev${image}`,
            "width": 1200,
            "height": 630
        },
        "datePublished": datePublished,
        "dateModified": datePublished,
        "author": {
            "@type": "Person",
            "name": "Dominik Karczewski",
            "url": "https://ogur.dev"
        },
        "publisher": {
            "@type": "Person",
            "name": "Dominik Karczewski",
            "url": "https://ogur.dev",
            "logo": {
                "@type": "ImageObject",
                "url": "https://ogur.dev/icon.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://ogur.dev${url}`
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}