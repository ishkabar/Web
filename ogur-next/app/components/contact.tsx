import { socials,getIcon } from "@/lib/contact-data";

interface ContactProps {
    website?: string | null;
}

export function Contact({ website }: ContactProps) {
    const email = socials.find(s => s.label === "Email");
    const discord = socials.find(s => s.label === "Discord");
    const linkedin = socials.find(s => s.label === "LinkedIn");

    return (
        <div className="mt-12 pt-8 border-t border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-900 mb-4">Kontakt</h2>
            <p className="text-zinc-400 mb-4">
                Masz pytania lub chcesz porozmawiać o projekcie? Skontaktuj się:
            </p>
            <ul className="space-y-2 text-zinc-400">
                {website && (
                    <li className="flex items-center gap-2">
                        {getIcon('website')} Website:{" "}
                        <a href={website} className="text-blue-600 hover:text-blue-700">
                            {website.replace(/^https?:\/\//, "")}
                        </a>
                    </li>
                )}
                {email && (
                    <li className="flex items-center gap-2">
                        {email.icon} Email:{" "}
                        <a href={email.href} className="text-blue-600 hover:text-blue-700">
                            {email.handle}
                        </a>
                    </li>
                )}
                {discord && (
                    <li className="flex items-center gap-2">
                        {discord.icon} Discord:{" "}
                        <a href={discord.href} className="text-blue-600 hover:text-blue-700">
                            {discord.handle}
                        </a>
                    </li>
                )}
                {linkedin && (
                    <li className="flex items-center gap-2">
                        {linkedin.icon} LinkedIn:{" "}
                        <a href={linkedin.href} className="text-blue-600 hover:text-blue-700">
                            {linkedin.handle}
                        </a>
                    </li>
                )}
            </ul>
        </div>
    );
}