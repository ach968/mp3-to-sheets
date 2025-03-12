"use client"
import WavesurferPlayer from '@wavesurfer/react';
import RegionsPlugin, {RegionParams, RegionEvents} from 'wavesurfer.js/plugins/regions'

import { useState, useRef, useEffect } from 'react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { twMerge } from 'tailwind-merge';
import SheetMusic from '@/assets/sheet-music'
import MusicNote from '@/assets/music-note'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

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
    setStart: (time: number) => void;
    setEnd: (time: number) => void;
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
    setFocused,
    setStart,
    setEnd
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
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                            <Button 
                                size="icon" 
                                className="select-none w-7 h-7" 
                                variant={volume==0 || (focused && focused != id) ? "destructive" : "outline"} 
                                onClick={()=>{
                                    (volume == 0 || (focused && focused != id)) ? onVolumeChange(1) : onVolumeChange(0)
                                }}
                            >M</Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Mute</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                            <Button 
                                size="icon" 
                                className="select-none w-7 h-7" 
                                variant={ focused == id ? "success" : "outline"}
                                onClick={()=>{ 
                                    focused == id ? setFocused(null) : setFocused(id)
                                }}
                            >S</Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Focus Track</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
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
                    onRedrawcomplete={()=>console.log(`FINISHED LOADING ${id}`) } // TODO: SKELETON WHILE LOADING
                    // onClick={(e: any)=>setStart(e)}
                    onDragstart={(e: any)=>setStart(e)}
                    onDragend={(e: any)=>setEnd(e)}
                    dragToSeek={true}
                />
            </div>
    
            {/* Action Buttons */}
            <div className="ml-4 flex flex-col gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                        <Button size="icon" className="w-9 h-9 rounded-full group" variant='outline' >
                            <SheetMusic className="invert-0 group-hover:invert" />
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Convert to Sheet Music</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                        <Button size="icon" className="w-9 h-9 rounded-full group" variant="outline">
                            <MusicNote className="invert-0 group-hover:invert" />
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Download MP3</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                
            </div>
        </div>
    </div>
    );
  }