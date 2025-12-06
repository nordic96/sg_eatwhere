'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useProgress } from '@react-three/drei';

interface ProgressBarProps {
  progress: string;
}

function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-4 w-full">
        <div className="bg-primary animate-fill h-full origin-left"></div>
      </div>
      <div className="absolute text-white font-bold">{progress}%</div>
    </div>
  );
}

interface ScreenLoaderProps {
  onReady: () => void;
}

export default function FullScreenLoader(props: ScreenLoaderProps) {
  const { progress } = useProgress();
  useEffect(() => {
    if (progress === 100) {
      props.onReady();
    }
  }, [progress, props]);

  if (typeof window === 'undefined') {
    return null;
  }
  return createPortal(
    <div className="fixed bg-white inset-0 flex flex-col grow align-center justify-center">
      <div className={'absolute left-[50%] translate-x-[-50%] top-[40%] translate-y-[-40%]'}>
        <div className="flex flex-col gap-8 justify-center items-center">
          <Image
            loading={'eager'}
            src={'/images/logo.svg'}
            className={'xl:w-[300px] lg:w-[200px] max-sm:w-[200px]'}
            alt="logo"
            draggable="false"
            width={'0'}
            height={'0'}
          />
          <div className={'xl:w-[50vw] lg:w-[80vw] max-sm:w-[80vw]'}>
            <ProgressBar progress={progress.toFixed(0)} />
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('root')!,
  );
}
