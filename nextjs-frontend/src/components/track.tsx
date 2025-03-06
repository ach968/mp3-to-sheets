import WavesurferPlayer, { WavesurferProps } from '@wavesurfer/react'
import { useState } from 'react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { twMerge } from 'tailwind-merge';
import SheetMusic from '@/assets/sheet-music'
import MusicNote from '@/assets/music-note'
interface TrackProps {
    fileUrl: string;
    waveColor: string;
    trackName: string;
    className: string;
    onUniversalSeek: (time: number) => void;
    registerWaveSurfer: (ws: any) => void;
    setIsPlaying: (status: any) => void;
}

export default function Track({ fileUrl, waveColor, trackName, className, registerWaveSurfer, onUniversalSeek, setIsPlaying} : TrackProps) {

    const [wavesurfer, setWavesurfer] = useState<any>(null);
    const [volume, setVolume] = useState(1);

    const onReady = (ws: any) => {
        setWavesurfer(ws);
        ws.setVolume(volume);
        registerWaveSurfer(ws);
    };
  
    const onVolumeChange = (e: Number) => {
        const newVolume = Number(e)
        setVolume(newVolume);
        wavesurfer && wavesurfer.setVolume(newVolume);
    };
  
    return (
      <div className={twMerge(className, "w-full border-2 p-4 rounded-xl")}>
        <p className="text-white font-bold text-lg">
            {trackName}
        </p>

        <div className="flex items-center">
            {/* Volume Control */}
            <div className="mr-4">
            <Slider
                defaultValue={[1]}
                max={1}
                step={0.01}
                className='w-20'
                onValueChange={(e)=>onVolumeChange(e[0])}
            />
            </div>
    
            {/* Waveform Display */}
            <div className="flex-grow">
            <WavesurferPlayer
                height={100}
                progressColor={waveColor}
                waveColor="White"
                url={fileUrl}
                onFinish={()=>setIsPlaying(false)}
                onReady={onReady}
                onSeeking={(e: any)=> onUniversalSeek(e)}
            />
            </div>
    
            {/* Action Buttons */}
            <div className="ml-4 flex flex-col space-y-2">
            <Button className="w-12 h-12 rounded-full" variant='outline' >
                <SheetMusic />
            </Button>
            <Button className="w-12 h-12 rounded-full" variant="outline">
                <MusicNote />
            </Button>
            </div>
        </div>
        
      </div>
    );
  }