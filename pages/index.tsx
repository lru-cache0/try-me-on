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
        <title>Try Me On AI</title>
      </Head>
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mb-7 ">
              
     

        <h1 className="mx-auto max-w-3xl font-display text-5xl font-bold tracking-normal text-slate-900 sm:text-6xl mt-20">
          <span className="relative whitespace-nowrap text-[#b3209c]">
            <span className="relative">AI </span>  
          </span> 
          Outfit Try-On
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-lg text-slate-700 leading-7">
          Online shopping sucks cuz you can't try stuff on — until now!
        </p>

        <div className="flex justify-center space-x-4">
          <Link
            className="bg-black rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80"
            href="/restore"
          >
            Try me!
          </Link>
        </div>

        <div className="flex justify-between items-center w-full flex-col mt-10">

                <Image
                  alt="Original" //
                  src="/olivia.png"
                  className="w-160 h-75 rounded-2xl mr-4"
                  width={700}
                  height={700}
                />
 
        </div>
        

 
      </main>
      <Footer />
    </div>
  );
};

export default Home;
