"use client"

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
import Share from "@/components/share-dialog-header"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { usePathname } from 'next/navigation'
import { useState } from "react"

export default function EditorNav({projectId, projectName, pauseCallback} : {projectId?: string, projectName?: string, pauseCallback?: ()=>void}) {
    const pathname = usePathname()
    const [isSharing, setIsSharing] = useState(false);

    return <nav className="bg-black/50 backdrop-blur-md h-[100px] z-20 justify-center w-screen flex fixed top-0">
        <div className="flex flex-row w-full container items-baseline justify-between px-6 mt-8">
            <div className="flex gap-5 text-neutral-400 underline-offset-4">
                <Link onClick={pauseCallback} href="/projects">
                    <p className={twMerge(pathname==="/projects" && "text-white", "hover:cursor-pointer hover:underline")}>Projects</p>
                </Link>
                <Link onClick={pauseCallback} href="/editor">
                    <p className={twMerge(pathname.startsWith("/editor") && "text-white", "hover:cursor-pointer hover:underline")}>Editor</p>
                </Link>
                {
                    projectId && projectId != "" && projectName &&
                    <Link href="#">
                        <Dialog onOpenChange={(open)=>setIsSharing(open)}>
                            <DialogTrigger>
                                <p className={twMerge(isSharing && "text-white", "hover:cursor-pointer hover:underline")}>Share</p>
                            </DialogTrigger>
                            <DialogContent>
                                <Share projectId={projectId} projectName={projectName}/>
                            </DialogContent>
                        </Dialog>
                    </Link>
                } 
                
            </div>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/profile" legacyBehavior passHref>
                            <NavigationMenuLink onClick={pauseCallback}
                            className={twMerge(navigationMenuTriggerStyle(), 
                            pathname.startsWith("/profile") && "bg-white text-black hover:bg-white/80")}>
                                Profile
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/logout" legacyBehavior passHref>
                            <NavigationMenuLink onClick={pauseCallback}
                            className={navigationMenuTriggerStyle()}>
                                Logout
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    </nav>
}