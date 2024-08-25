import { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { UrlBuilder } from '@bytescale/sdk';
import {
  UploadWidgetConfig,
  UploadWidgetOnPreUploadResult,
} from '@bytescale/upload-widget';
import { UploadDropzone } from '@bytescale/upload-widget-react';
import { CompareSlider } from '../components/CompareSlider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoadingDots from '../components/LoadingDots';
import Toggle from '../components/Toggle';
import appendNewToName from '../utils/appendNewToName';
import downloadPhoto from '../utils/downloadPhoto';
import NSFWFilter from 'nsfw-filter';
import va from '@vercel/analytics';
import { useSession, signIn } from 'next-auth/react';
import useSWR from 'swr';
import { Rings } from 'react-loader-spinner';
import { useEffect } from 'react';

const Home: NextPage = () => {
  const [you, setYou] = useState<string | null>(null);
  const [clothing, setClothing] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [youName, setYouName] = useState<string | null>(null);
  const [clothingName, setClothingName] = useState<string | null>(null);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, mutate } = useSWR('/api/remaining', fetcher);
  const { data: session, status } = useSession();

  const options: UploadWidgetConfig = {
    //apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    //  ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    //  : 'free',
    apiKey: 'free',
    maxFileCount: 1,
    mimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    editor: { images: { crop: false } },
    styles: { colors: { primary: '#000' } },
    onPreUpload: async (
      file: File
    ): Promise<UploadWidgetOnPreUploadResult | undefined> => {
      let isSafe = false;
      try {
        isSafe = await NSFWFilter.isSafe(file);
        console.log({ isSafe });
        if (!isSafe) va.track('NSFW Image blocked');
      } catch (error) {
        console.error('NSFW predictor threw an error', error);
      }
      if (!isSafe) {
        return { errorMessage: 'Detected a NSFW image which is not allowed.' };
      }
      if (data.remainingGenerations <= 0) {
        return { errorMessage: 'You have no remaining credits.' };
      }
      return undefined;
    },
  };

  useEffect(() => {
    if (loading) {
      setRestoredImage(null);
      setRestoredLoaded(false);
    }
  }, [loading]);


  const Result = () => {
    return <div>
       {restoredImage && !sideBySide && (     
        <div className="sm:mt-0 mt-8">
          <a href={restoredImage} target="_blank" rel="noreferrer">
            <Image
              alt="your look"
              src={restoredImage}
              className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in h-[300px] w-auto object-contain"
              height={200}
              width={200}
              onLoadingComplete={() => setRestoredLoaded(true)}
            />
          </a>
        </div>
        )}
        <p className="mt-2 text-center">{"Your Look!"}</p>
          {restoredLoaded && (
            <button
              onClick={() => {
                downloadPhoto(restoredImage!, appendNewToName(youName!));
              }}
              className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-6 hover:bg-gray-100 transition"
            >
              Download
            </button>
          )}
         {loading && (
            <button
              disabled
              className="bg-black rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 hover:bg-black/80 w-40"
            >
              <span className="pt-4">
                <LoadingDots color="white" style="large" />
              </span>
            </button>
            
          )}
    </div>
  }  
  
  interface UploadDropZoneProps {
    caption: string;
  }
  const YouDropZone: React.FC<UploadDropZoneProps> = ({ caption}) => (
    <div className="flex flex-col items-center">
    {!you && <UploadDropzone
      options={options}
      onUpdate={({ uploadedFiles }) => {
        if (uploadedFiles.length !== 0) {
          const image = uploadedFiles[0];
          const imageName = image.originalFile.originalFileName;
          const imageUrl = UrlBuilder.url({
            accountId: image.accountId,
            filePath: image.filePath,
            options: {
              transformation: 'preset',
              transformationPreset: 'thumbnail',
            },
          });
          setYou(imageUrl);
          setYouName(imageName)
        }
      }}
      width="200px"
      height="300px"
      />
    }
    {you &&  
        <Image
          alt="restored photo"
          src={you ?? ''}
          className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in object-cover"
          width={200}
          height={200}
        />}
    <p className="mt-2 text-center">{caption}</p>
    {!loading && you &&  (
      <button
        onClick={() => {
          setYou(null);
          setRestoredImage(null);
          setRestoredLoaded(false);
          setError(null);
        }}
        className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-6 hover:bg-gray-100 transition"
      >
        Change Photo
      </button>
    )}
    </div>
  );


  const ClothingDropZone: React.FC<UploadDropZoneProps> = ({ caption}) => (
    <div className="flex flex-col items-center">
    {!clothing && <UploadDropzone
      options={options}
      onUpdate={({ uploadedFiles }) => {
        if (uploadedFiles.length !== 0) {
          const image = uploadedFiles[0];
          const imageName = image.originalFile.originalFileName;
          const imageUrl = UrlBuilder.url({
            accountId: image.accountId,
            filePath: image.filePath,
            options: {
              transformation: 'preset',
              transformationPreset: 'thumbnail',
            },
          });
          setClothing(imageUrl);
          setClothingName(imageName);
          }
        }}
      width="200px"
      height="300px"
      />
    }
    {clothing &&  
        <Image
          alt="restored photo"
          src={clothing ?? ''}
          className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in object-cover"
          width={200}
          height={200}
        />}
    <p className="mt-2 text-center">{caption}</p>
    {!loading && clothing &&  (
      <button
        onClick={() => {
          setClothing(null);
          setRestoredImage(null);
          setRestoredLoaded(false);
          setError(null);
        }}
        className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-6 hover:bg-gray-100 transition"
      >
        Change Photo
      </button>
    )}
    </div>
  );


  async function generatePhoto(youUrl: string, clothingUrl: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(true);

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ youUrl: youUrl, clothingUrl: clothingUrl }),
    });

    let newPhoto = await res.json();
    if (res.status !== 200) {
      setError("Failed to process image.");
    } else {
      mutate();
      setRestoredImage(newPhoto);
    }
    setLoading(false);
  }

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>AI Interior Designer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header photo={session?.user?.image || undefined} gens={data?.remainingGenerations ? Number(data.remainingGenerations) : 0} />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-20">

        <div className="flex justify-between items-center w-full flex-col mt-4">
        
          {status === 'loading' ? (
            <div className="max-w-[670px] h-[250px] flex justify-center items-center">
              <Rings
                height="100"
                width="100"
                color="black"
                radius="6"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="rings-loading"
              />
            </div>
          ) : status === 'authenticated'  ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="flex flex-row items-center space-x-6">
                <YouDropZone caption={'Image of You'} />
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>+</span>
                <ClothingDropZone caption={'Image of Clothing'} />
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>=</span>
                <Result/>
              </div>
              {you && clothing &&  (
                <button 
                  onClick={() => {
                    setError(null);
                    generatePhoto(you, clothing);
                  }}
                  className="bg-black rounded-full text-white font-medium px-4 py-2 mt-20 hover:bg-black/80 transition">
                  Go!
                </button>
              )}
            </div>
          ) : (
            status === 'unauthenticated' && !you && (
              <div className="h-[250px] flex flex-col items-center space-y-6 max-w-[670px] -mt-8">
                <div className="max-w-xl text-gray-600">
                  Sign in below with Google to get started!
                </div>
                <button
                  onClick={() => signIn('google')}
                  className="bg-gray-200 text-black font-semibold py-3 px-6 rounded-2xl flex items-center space-x-2"
                >
                  <Image
                    src="/google.png"
                    width={20}
                    height={20}
                    alt="google's logo"
                  />
                  <span>Sign in with Google</span>
                </button>
              </div>
            )
          )}
         
    




          {error && you && !sideBySide && (
            <div className="flex sm:space-x-4 sm:flex-row flex-col">
              <div>
                <h2 className="mb-1 font-medium text-lg mt-8">Failed to process image — try again!</h2>
              </div>
            </div>
          )}

          {data &&data.remainingGenerations <= 0 && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8 max-w-[575px]"
              role="alert"
            >
              <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                <a href="/buy-credits">You need more credits! Buy more here.</a>
              </div>
              <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                <a href="/buy-credits">Buy Credits</a>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
