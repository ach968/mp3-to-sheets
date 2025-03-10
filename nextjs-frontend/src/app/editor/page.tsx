"use client";
import Track from "@/components/track";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PlaySVG from "@/assets/play"
import ForwardSVG from "@/assets/forward"
import PauseSVG from "@/assets/pause"
import BackwardSVG from "@/assets/backward";
import ListSVG from "@/assets/list"
import MenuSVG from "@/assets/menu"
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu"


interface TrackState {
    ws: any;
    volume: number;
}

export default function Home() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackStates, setTrackStates] = useState<Record<number, TrackState>>({});
    // Prevent feedback loop
    const [isSeeking, setIsSeeking] = useState(false);
    const [focused, setFocused] = useState<number| null>(null);

    const PROJECTNAME = "Untitled Project" // TODO HOOK UP TO BACKEND
    const FILENAME = "this_is_a_filler_file_name.mp3" // TODO HOOK UP TO BACKEND

    // Callback to register each track's wavesurfer instance
    const registerWaveSurfer = (id: number, ws: any) => {
        setTrackStates((prev: Record<number, TrackState>) => {
            return {
                ...prev,
                [id]: {ws, volume: 1}
            }
        })
    };

    const updateTrackVolume = (id:number, newVolume: number) => {
        if(focused != null && focused != id) {
            setFocusedLayer(null);
        }

        setTrackStates((prev: Record<number, TrackState>) => {
            const track = prev[id]
            if(track && track.ws) {
                track.ws.setVolume(newVolume);
            }
            return {
                ...prev, 
                [id]: {...track, volume: newVolume}
            }
        })
    }

    const setFocusedLayer = (setId: number | null) => {
        if(setId == null) {
            Object.values(trackStates).forEach((trackState) => {
                if (trackState.ws) trackState.ws.setVolume(trackState.volume);
            });
        }
        else {
            Object.entries(trackStates).forEach(([id, trackState])=> {
                if(setId != Number(id) && trackState.ws) {
                    trackState.ws.setVolume(0);
                }
                else {
                    trackState.ws.setVolume(trackState.volume)
                }
            })
        }

        setFocused(setId);
    }

    // Seeking with one wavesurfer seeks for all instances
    const onUniversalSeek = (e: any) => {
        if (isSeeking) return;
        setIsSeeking(true);
        const newTime = e.media.currentTime;
        Object.values(trackStates).forEach(({ ws }) => {
            if (ws) ws.setTime(newTime);
        });
        setTimeout(() => setIsSeeking(false), 100);
    };

    // Control play/pause for all tracks
    const onUniversalPlayPause = () => {
        Object.values(trackStates).forEach(({ ws }) => {
            if (ws) ws.playPause();
        });
        setIsPlaying((prev) => !prev);
    };

    const onUniversalSkipForward = () => {
        const anyWs = Object.values(trackStates).find(({ ws }) => ws)?.ws;
        if (anyWs) {
            const newTime = anyWs.getCurrentTime() + 5;
            Object.values(trackStates).forEach(({ ws }) => {
                if (ws) ws.setTime(newTime);
            });
        }
    };

    const onUniversalSkipBackward = () => {
        const anyWs = Object.values(trackStates).find(({ ws }) => ws)?.ws;
        if (anyWs) {
            const newTime = anyWs.getCurrentTime() - 5;
            Object.values(trackStates).forEach(({ ws }) => {
                if (ws) ws.setTime(newTime);
            });
        }
    };
    

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode === 32) {
            e.preventDefault();
            onUniversalPlayPause();
        }
        else if(e.keyCode === 37) {
            e.preventDefault();
            onUniversalSkipBackward();
        }
        else if(e.keyCode === 39) {
            e.preventDefault();
            onUniversalSkipForward();
        }
        
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [trackStates]);

  return (
  <section>
        <div className="w-screen flex h-screen bg-black">
            <div className="flex flex-col justify-center w-full h-full">
                <div className="flex w-full justify-end px-6">
                    <NavigationMenu className="fixed top-0 mt-6">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>My Projects</NavigationMenuTrigger>
                                <NavigationMenuContent className="">
                                    <div className="w-[200px] h-auto p-3 bg-black">
                                        <p className="text-white mb-2 font-semibold">
                                            Recent
                                        </p>
                                        <ul className="text-neutral-400">
                                            <Link href="/projects" legacyBehavior passHref>
                                                <li className="hover:cursor-pointer truncate p-2 leading-5 transition ease-out hover:bg-neutral-900 rounded-sm">
                                                    Song Name 1 THIS IS LONG
                                                </li>
                                            </Link>
                                            <Link href="/projects" legacyBehavior passHref>
                                                <li className="hover:cursor-pointer truncate p-2 leading-5 transition ease-out hover:bg-neutral-900 rounded-sm">
                                                    Song Name 1 THIS IS LONG
                                                </li>
                                            </Link>
                                            <Link href="/projects" legacyBehavior passHref>
                                                <li className="hover:cursor-pointer truncate p-2 leading-5 transition ease-out hover:bg-neutral-900 rounded-sm">
                                                    Song Name 1 THIS IS LONG
                                                </li>
                                            </Link>
                                            <Link href="/projects" legacyBehavior passHref>
                                                <li className="hover:cursor-pointer truncate p-2 leading-5 transition ease-out hover:bg-neutral-900 rounded-sm">
                                                    Song Name 1 THIS IS LONG
                                                </li>
                                            </Link>
                                        </ul>
                                        <div className="w-full mt-5 flex justify-end font-semibold text-white">
                                            <Link href="/projects" legacyBehavior passHref>
                                                All Projects
                                            </Link>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        + New Project
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Profile
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/logout" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Logout
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                

                <div className="mt-20 mb-3 flex w-full justify-center">
                    <div className="container lg:px-5 px-3">
                        <div className=" flex gap-3 place-items-baseline">
                            <p className="text-3xl lg:text-4xl font-semibold text-white truncate">
                                {PROJECTNAME}
                            </p>
                            <p className="text-base text-neutral-400 truncate">
                                / {FILENAME}
                            </p>
                        </div>
                    </div>
                </div>

                {/* TRACK CONTAINER THING -- IT RESIZES */}
                <div className="flex w-full justify-center overflow-x-hidden">
                    <div className="container mx-3">
                        <div className="flex flex-col gap-3 border border-neutral-700 rounded-lg lg:gap-6 lg:p-5 p-3">
                            <Track
                                id={1}
                                className="border-red-400 shadow-[0px_0px_50px_#fb2c3655]"
                                fileUrl="/vocals.wav"
                                trackName="Vocal"
                                waveColor="#fb2c36"
                                registerWaveSurfer={registerWaveSurfer}
                                onUniversalSeek={onUniversalSeek}
                                setIsPlaying={setIsPlaying}
                                volume={trackStates[1] ? trackStates[1].volume : 1}
                                updateVolume={(updateTrackVolume)}
                                focused={focused}
                                setFocused={setFocusedLayer}
                            />
                            <Track
                                id={2}
                                className="border-yellow-400 shadow-[0px_0px_50px_#efb10055]"
                                fileUrl="/drums.wav"
                                trackName="Drums"
                                waveColor="#efb100"
                                registerWaveSurfer={registerWaveSurfer}
                                onUniversalSeek={onUniversalSeek}
                                setIsPlaying={setIsPlaying}
                                volume={trackStates[2] ? trackStates[2].volume : 1}
                                updateVolume={(updateTrackVolume)}
                                focused={focused}
                                setFocused={setFocusedLayer}
                            />
                            <Track
                                id={3}
                                className="border-lime-400 shadow-[0px_0px_50px_#7ccf0055]"
                                fileUrl="/bass.wav"
                                trackName="Bass"
                                waveColor="#7ccf00"
                                registerWaveSurfer={registerWaveSurfer}
                                onUniversalSeek={onUniversalSeek}
                                setIsPlaying={setIsPlaying}
                                volume={trackStates[3] ? trackStates[3].volume : 1}
                                updateVolume={(updateTrackVolume)}
                                focused={focused}
                                setFocused={setFocusedLayer}
                            />
                            <Track
                                id={4}
                                className="border-teal-400 shadow-[0px_0px_50px_#00bba755]"
                                fileUrl="/other.wav"
                                trackName="Guitar"
                                waveColor="#00bba7"
                                registerWaveSurfer={registerWaveSurfer}
                                onUniversalSeek={onUniversalSeek}
                                setIsPlaying={setIsPlaying}
                                volume={trackStates[4] ? trackStates[4].volume : 1}
                                updateVolume={(updateTrackVolume)}
                                focused={focused}
                                setFocused={setFocusedLayer}
                            />
                            <Track
                                id={5}
                                className="border-red-400 shadow-[0px_0px_50px_#fb2c3655]"
                                fileUrl="/vocals.wav"
                                trackName="Vocal"
                                waveColor="#fb2c36"
                                registerWaveSurfer={registerWaveSurfer}
                                onUniversalSeek={onUniversalSeek}
                                setIsPlaying={setIsPlaying}
                                volume={trackStates[5] ? trackStates[5].volume : 1}
                                updateVolume={(updateTrackVolume)}
                                focused={focused}
                                setFocused={setFocusedLayer}
                            />
                            <Track
                                id={6}
                                className="border-yellow-400 shadow-[0px_0px_50px_#efb10055]"
                                fileUrl="/drums.wav"
                                trackName="Drums"
                                waveColor="#efb100"
                                registerWaveSurfer={registerWaveSurfer}
                                onUniversalSeek={onUniversalSeek}
                                setIsPlaying={setIsPlaying}
                                volume={trackStates[6] ? trackStates[6].volume : 1}
                                updateVolume={(updateTrackVolume)}
                                focused={focused}
                                setFocused={setFocusedLayer}
                            />
                        </div>
                    </div>
                </div>

                {/* TOOLBAR */}
                <div className=" flex w-full justify-center mb-5">
                    <div className="container lg:px-5 px-3">
                        <div className="border-b border-neutral-700 py-1 w-full min-h-7 flex justify-center gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="w-7 h-7 group"
                                            // TODO: On click
                                        >
                                            <MenuSVG className="invert-0 group-hover:invert" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Icon</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="w-7 h-7 group"
                                            onClick={onUniversalSkipBackward}
                                        >
                                            <BackwardSVG className="invert-0 group-hover:invert"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Seek Forward (Left Arrow)</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="w-7 h-7 group"
                                            onClick={onUniversalPlayPause}
                                        >
                                            {isPlaying===true ? <PauseSVG className="invert-0 group-hover:invert" /> 
                                            : <PlaySVG className="invert-0 group-hover:invert"/>}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Play/Pause (Space)</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="w-7 h-7 group"
                                            onClick={onUniversalSkipForward}
                                        >
                                            <ForwardSVG className="invert-0 group-hover:invert" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Seek Forward (Right Arrow)</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                className="w-7 h-7 group"
                                // TODO: On click 
                            >
                                <ListSVG className="invert-0 group-hover:invert" />
                            </Button>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
}
