// Imports
import { useState } from 'react'

// Components
import HeaderBar from '@/components/Landing/HeaderBar'

import Head from 'next/head'
import Link from 'next/link'

export default function Landing() {

  return (
    <div className=''>
      <Head>
        <title>ProjMatch</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <div className='w-full'>
        <HeaderBar />
      </div>

      <div className='flex h-full w-full'>

      </div>
    </div>
  )
}

