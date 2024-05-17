import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col justify-between items-center px-3 space-y-3 sm:mb-0 mb-3">
      <div>
        Powered by{' '}
        <a
          href="https://replicate.com/"
          target="_blank"
          className="font-bold transition hover:text-black/50"
        >
          Replicate{' '}
        </a>
        and {' '}
        <a
          href="https://twitter.com/nutlope/status/1696534532709872072"
          target="_blank"
          className="font-bold transition hover:text-black/50"
        >
           Nutlope{' '}
        </a>
      </div>
    </footer>
  );
}
