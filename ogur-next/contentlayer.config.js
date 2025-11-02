import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";


const CONTACTS = {
    email: "mailto:test@ogur.dev",
    discord: "https://discord.com/users/822151223116824588",
    linkedin: "https://www.linkedin.com/in/dominik-karczewski-1b850b209/",
    github: "https://github.com/ishkabar",
};

const computedFields = {
    path: {
        type: "string",
        resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
    slug: {
        type: "string",
        resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
    },
};

export const Project = defineDocumentType(() => ({
    name: "Project",
    filePathPattern: "./projects/**/*.mdx",
    contentType: "mdx",

    fields: {
        published: { type: "boolean" },
        title: { type: "string", required: true },
        description: { type: "string", required: true },
        date: { type: "date" },
        url: { type: "string" },
        repository: { type: "string" },
    },
    computedFields: {
        ...computedFields,
        contactInfo: {
            type: "json",
            resolve: (doc) => ({
                website: doc.url || null,
                ...CONTACTS,
            }),
        },
    },
}));

export const Page = defineDocumentType(() => ({
    name: "Page",
    filePathPattern: "./pages/**/*.mdx",
    contentType: "mdx",
    fields: {
        title: { type: "string", required: true },
        description: { type: "string" },
    },
    computedFields,
}));

export default makeSource({
    contentDirPath: "./content",
    documentTypes: [Page, Project],
    mdx: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            rehypeSlug,
            [
                rehypePrettyCode,
                {
                    theme: "github-dark",
                    onVisitLine(node) {
                        if (node.children.length === 0) {
                            node.children = [{ type: "text", value: " " }];
                        }
                    },
                    onVisitHighlightedLine(node) {
                        node.properties.className.push("line--highlighted");
                    },
                    onVisitHighlightedWord(node) {
                        node.properties.className = ["word--highlighted"];
                    },
                },
            ],
            [
                rehypeAutolinkHeadings,
                {
                    properties: {
                        className: ["subheading-anchor"],
                        ariaLabel: "Link to section",
                    },
                },
            ],
        ],
    },
});