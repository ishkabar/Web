'use client';
/**
 * Renders a random slogan and replaces any "ogur.dev" occurrence with a clickable Link.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SLOGANS } from '../../lib/slogans';

export default function Slogan() {
  const [text, setText] = useState<string>(SLOGANS[0]);

  useEffect(() => {
    const i = Math.floor(Math.random() * SLOGANS.length);
    setText(SLOGANS[i]);
  }, []);

  // Split by a capturing group to keep "ogur.dev" tokens for replacement
  const parts = text.split(/(ogur\.dev)/i);

  return (
    <>
      {parts.map((part, idx) =>
        part.toLowerCase() === 'ogur.dev' ? (
          <Link
            key={idx}
            href="https://ogur.dev"
            target="_blank"
            className="underline duration-500 hover:text-zinc-300"
          >
            {part}
          </Link>
        ) : (
          <span key={idx}>{part}</span>
        ),
      )}
    </>
  );
}
