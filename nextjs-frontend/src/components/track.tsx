import WavesurferPlayer, { WavesurferProps } from '@wavesurfer/react'
import { useState } from 'react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { twMerge } from 'tailwind-merge';
import SheetMusic from '@/assets/sheet-music'
import MusicNote from '@/assets/music-note'
interface TrackProps {
    id: number;
    focused: number | null; // id of the track that is focused
    fileUrl: string;
    waveColor: string;
    trackName: string;
    className: string;
    volume: number;
    onUniversalSeek: (time: number) => void;
    registerWaveSurfer: (id: number, ws: any) => void;
    setIsPlaying: (status: boolean) => void;
    updateVolume: (id: number, newVol: number) => void;
    setFocused: (id: number | null) => void;
}

export default function Track({
    id,
    fileUrl, 
    waveColor, 
    trackName, 
    className,
    volume,
    focused,
    registerWaveSurfer, 
    onUniversalSeek, 
    setIsPlaying,
    updateVolume,
    setFocused
} : TrackProps) {
    const onReady = (ws: any) => {
        ws.setVolume(volume);
        registerWaveSurfer(id, ws);
    };
  
    const onVolumeChange = (newVolume: number) => {
        updateVolume(id, newVolume)
    };
  
    return (
    <div className={twMerge(className, (volume == 0 || focused && focused != id) && "filter brightness-50", "bg-black w-full border-2 p-2 lg:p-4 rounded-md lg:rounded-xl")}>

        <div className="flex items-center">
            {/* Left cluster */}
            <div className="mr-4 flex flex-col gap-3 items-center">
                <p className="select-none text-white font-bold text-md">
                    {trackName}
                </p>
                <Slider
                    defaultValue={[1]}
                    max={1}
                    step={0.01}
                    className='w-20'
                    onValueChange={(e)=>onVolumeChange(e[0])}
                    value={[focused && focused !=id ? 0 : volume]}
                />
                <div className="flex gap-2">
                    <Button 
                        size="icon" 
                        className="select-none w-7 h-7" 
                        variant={volume==0 || (focused && focused != id) ? "destructive" : "outline"} 
                        onClick={()=>{
                            (volume == 0 || (focused && focused != id)) ? onVolumeChange(1) : onVolumeChange(0)
                        }}
                    >M</Button>
                    <Button 
                        size="icon" 
                        className="select-none w-7 h-7" 
                        variant={ focused == id ? "destructive" : "outline"}
                        onClick={()=>{ 
                            focused == id ? setFocused(null) : setFocused(id)
                        }}
                    >S</Button>
                </div>
                
            </div>
    
            {/* Waveform Display */}
            <div className="flex-grow">
                <WavesurferPlayer
                    height={70}
                    progressColor={waveColor}
                    waveColor="White"
                    url={fileUrl}
                    onFinish={()=>setIsPlaying(false)}
                    onReady={onReady}
                    onSeeking={(e: any)=> onUniversalSeek(e)}
                />
            </div>
    
            {/* Action Buttons */}
            <div className="ml-4 flex flex-col gap-2">
                <Button size="icon" className="w-9 h-9 rounded-full group" variant='outline' >
                    <SheetMusic className="invert-0 group-hover:invert" />
                </Button>
                <Button size="icon" className="w-9 h-9 rounded-full group" variant="outline">
                    <MusicNote className="invert-0 group-hover:invert" />
                </Button>
            </div>
        </div>
    </div>
    );
  }