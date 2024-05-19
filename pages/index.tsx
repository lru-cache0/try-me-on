import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SquigglyLines from '../components/SquigglyLines';
import { Testimonials } from '../components/Testimonials';
import va from '@vercel/analytics';

const Home: NextPage = () => {
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Room Genius</title>
      </Head>
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-20">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-slate-900 sm:text-7xl">
          Your{' '}
          <span className="relative whitespace-nowrap text-[#808000]">
            <span className="relative">AI</span>
          </span> Interior Designer{' '}
        </h1>

        <p className="mx-auto mt-12 max-w-xl text-lg text-slate-700 leading-7">
          Want to redesign any room in your house? Upload an image and describe what you want to see!
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            className="bg-black rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80"
            href="/restore"
          >
            Try me!
          </Link>
        </div>
       
        <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
          <div className="flex flex-col space-y-10 mt-4">
            <div className="flex sm:space-x-2 sm:flex-row flex-col">
              <div>
                <h2 className="mb-1 font-medium text-lg ">Original Photo</h2>
                <Image
                  alt="Original"
                  src="/old.png"
                  className="w-160 h-75 rounded-2xl mr-4"
                  width={500}
                  height={500}
                />
              </div>
              <div className="sm:mt-0 mt-8">
                <h2 className="mb-1 font-medium text-lg">"Bohemian bungalow with tropical plants"</h2>
                <Image
                  alt="New"
                  width={500}
                  height={500}
                  src="/new.png"
                  className="w-160 h-75 rounded-2xl sm:mt-0 mt-2"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
          <div className="flex flex-col space-y-10 mt-4">
            <div className="flex sm:space-x-2 sm:flex-row flex-col">
              <div>
                <h2 className="mb-1 font-medium text-lg ">Original Photo</h2>
                <Image
                  alt="Original"
                  src="/old-kitchen.png"
                  className="w-160 h-75 rounded-2xl mr-4"
                  width={500}
                  height={500}
                />
              </div>
              <div className="sm:mt-0 mt-8">
                <h2 className="mb-1 font-medium text-lg">"Updated, rustic, stainless-steel Brooklyn kitchen"</h2>
                <Image
                  alt="New"
                  width={500}
                  height={500}
                  src="/new-kitchen.png"
                  className="w-160 h-75 rounded-2xl sm:mt-0 mt-2"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
          <div className="flex flex-col space-y-10 mt-4 mb-16">
            <div className="flex sm:space-x-2 sm:flex-row flex-col">
              <div>
                <h2 className="mb-1 font-medium text-lg ">Original Photo</h2>
                <Image
                  alt="Original"
                  src="/dorm-old.jpg"
                  className="w-160 h-75 rounded-2xl mr-4"
                  width={500}
                  height={500}
                />
              </div>
              <div className="sm:mt-0 mt-8">
                <h2 className="mb-1 font-medium text-lg">"Cute, modern Pinterest sorority dorm room"</h2>
                <Image
                  alt="New"
                  width={500}
                  height={500}
                  src="/dorm-new.png"
                  className="w-160 h-75 rounded-2xl sm:mt-0 mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
