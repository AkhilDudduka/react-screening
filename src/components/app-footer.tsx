import Image from 'next/image'
import React from 'react'

export function AppFooter() {
  return (
    <footer className="flex flex-col items-center gap-2 p-4 bg-violet-700 text-white dark:bg-violet-900 dark:text-violet-100 text-xs mt-8 shadow-inner">
      <div className="flex items-center gap-2">
        <Image
          src="/third-time-icon-tiny-white.png"
          alt="Third Time Logo"
          width={24}
          height={24}
          className="rounded-full bg-white p-0.5"
        />
        <span>
          Powered by{' '}
          <a
            className="underline hover:text-violet-200"
            href="https://github.com/solana-developers/create-solana-dapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            create-solana-dapp
          </a>
        </span>
      </div>
      <span className="text-[10px] text-violet-200">
        © {new Date().getFullYear()} Third Time Games. All rights reserved.
      </span>
    </footer>
  )
}
