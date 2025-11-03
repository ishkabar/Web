import { SiDiscord, SiGithub, SiLinkedin, SiInstagram, SiTelegram, SiMaildotcom } from "react-icons/si";
import { Globe } from "lucide-react";

// Surowe dane (bez React komponentów)
export const contactData = {
    discord: {
        href: "https://discord.com/users/822151223116824588",
        handle: "7cd_",
    },
    github: {
        href: "https://github.com/ishkabar",
        handle: "ishkabar",
    },
    email: {
        href: "mailto:kontakt@ogur.dev",
        handle: "kontakt@ogur.dev",
    },
    linkedin: {
        href: "https://www.linkedin.com/in/dominik-karczewski-1b850b209/",
        handle: "Dominik Karczewski",
    },
    instagram: {
        href: "https://instagram.com/antydesperant",
        handle: "@antydesperant",
    },
    telegram: {
        href: "https://t.me/PublicOverrideVoid",
        handle: "@PublicOverrideVoid",
    },
    website: {
        href: "https://respy.ogur.dev",
        handle: "respy.ogur.dev",
    },
};

export const getIcon = (type: 'website' | 'email' | 'discord' | 'linkedin') => {
    const icons = {
        website: <Globe size={20} />,
        email: <SiMaildotcom size={20} />,
        discord: <SiDiscord size={20} />,
        linkedin: <SiLinkedin size={20} />,
    };
    return icons[type];
};


export const socials = [
    {
        icon: <SiDiscord size={20} />,
        href: contactData.discord.href,
        label: "Discord",
        handle: contactData.discord.handle,
        copyable: true,
    },
    {
        icon: <SiLinkedin size={20} />,
        href: contactData.linkedin.href,
        label: "LinkedIn",
        handle: contactData.linkedin.handle,
    },
    {
        icon: <SiMaildotcom size={20} />,
        href: contactData.email.href,
        label: "Email",
        handle: contactData.email.handle,
    },
    {
        icon: <SiGithub size={20} />,
        href: contactData.github.href,
        label: "Github",
        handle: contactData.github.handle,
    },
    {
        icon: <SiInstagram size={20} />,
        href: contactData.instagram.href,
        label: "Instagram",
        handle: contactData.instagram.handle,
    },
    {
        icon: <SiTelegram size={20} />,
        href: contactData.telegram.href,
        label: "Telegram",
        handle: contactData.telegram.handle,
    },
    {
        icon: <Globe size={20} />,
        href: contactData.website.href,
        label: "Website",
        handle: contactData.website.handle,
    },
];