"use client"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import EditorNav from "@/components/editor-nav"
import SearchSVG from "@/assets/search"
import PlaySVG from "@/assets/play"
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge"
import Footer from "@/components/footer"
import { motion } from "motion/react"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import Share from "./share-dialog-header"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog"

interface Project {
    id: string;
    title: string;
    file: string;
    lastModified: string;
}

export default function Projects({ initialProjects }: { initialProjects: Project[] }) {

    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [searchQuery, setSearchQuery] = useState("");
    
    const [alphabeticalDown, setAlphabeticalDown] = useState<boolean | null>(null);
    const [dateDown, setDateDown] = useState<boolean | null>(true);

    const [renaming, setRenaming] = useState<string | null>(null); // set to project-id while renaming
    const [newName, setNewName] = useState<string>(''); // holds new name for project
    
    // Only plays framer animations once
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
    setHasMounted(true);
    }, []);

    const filteredProjects = projects.filter((project) => {
        const lowerQuery = searchQuery.toLowerCase()
        return (
            project.title.toLowerCase().includes(lowerQuery) ||
            project.file.toLowerCase().includes(lowerQuery)
        )
    })
    
    // used to autofocus rename Input field because react DOM is stupid
    const inputElement = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        if (renaming && inputElement.current != null) {
            setTimeout(() => {
                inputElement.current?.focus();
            }, 300);
        }
    }, [renaming]);

    // Create a sorted copy based on the active sort:
    // If dateDown is not null, sort by lastModified.
    // Else if alphabeticalDown is not null, sort by title.
    let sortedProjects = [...filteredProjects];
    if (dateDown !== null) {
    sortedProjects.sort((a, b) => {
        const dateA = new Date(a.lastModified);
        const dateB = new Date(b.lastModified);
        // If dateDown is true, sort descending (newest first), yes it's counter intuitive but that's how UI works.
        return dateDown ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
    });
    } else if (alphabeticalDown !== null) {
    sortedProjects.sort((a, b) => {
        return alphabeticalDown
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });
    }

    const handleRenameSubmit = async (projectId: string) => {
        try {
            // fetch logic
            // new name stored in newName
            
            if(newName.trim() == '') {
                throw new Error();
            } 

            // update dummy list
            setProjects(prevProjects =>
                prevProjects!.map(project =>
                  project.id === projectId ? { ...project, title: newName } : project
                )
            );
        } catch (error) {
            // error logic
        } finally {
            // Clear renaming state whether successful or not.
            setRenaming(null);
            setNewName('');
        }
    };

    return <section>
            <EditorNav />

            <div className="flex flex-col w-full min-h-screen bg-black">
                <div className="flex flex-col h-full">
                    
                    <div className="flex justify-center w-full mt-28">
                        <div className="container lg:px-5 px-3">
                            <div className="w-full flex justify-end pb-3">
                                <motion.div 
                                initial={hasMounted ? false : {opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 2}}
                                className="relative w-[300px] flex flex-row items-center">
                                    <SearchSVG className="h-5 w-5 absolute left-2"></SearchSVG>
                                    <Input className="pl-9 border-neutral-500 text-white"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </motion.div>
                            </div>
                            
                            <Table className="text-base">
                                <TableCaption>
                                    <p className="text-neutral-500">
                                        {projects.length > 0 ? "A list of your projects." : "You don't have any projects, click 'Editor' to get started!"}
                                    </p>
                                </TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <div className="flex flex-row gap-2 items-center justify-between pt-3 pb-3">
                                                <motion.span
                                                initial={hasMounted ? false : {opacity: 0}}
                                                animate={{opacity: 1}}
                                                transition={{duration: 2}}
                                                onClick={() => {
                                                    setDateDown(null);
                                                    setAlphabeticalDown((prev) =>
                                                    prev === null ? true : !prev
                                                );}}
                                                className="flex flex-row gap-2 items-center select-none hover:cursor-pointer">
                                                    <p className="text-white">Name</p>
                                                    <PlaySVG
                                                    className={twMerge("w-3 h-3 transition-all opacity-50",
                                                        alphabeticalDown === null
                                                            ? "opacity-0"
                                                            : alphabeticalDown
                                                            ? "rotate-90"
                                                            : "rotate-[270deg]"
                                                        )}
                                                    />
                                                </motion.span>
                                                <motion.span 
                                                initial={hasMounted ? false : {opacity: 0}}
                                                animate={{opacity: 1}}
                                                transition={{duration: 2}}                                                
                                                onClick={() => {
                                                    setAlphabeticalDown(null);
                                                    setDateDown((prev) =>
                                                    prev === null ? true : !prev
                                                    );
                                                }}
                                                className="flex flex-row gap-2 items-center select-none hover:cursor-pointer">
                                                    <p className="text-white">Last Modified</p>
                                                    <PlaySVG
                                                    className={twMerge("w-3 h-3 transition-all opacity-50", 
                                                        dateDown === null
                                                            ? "opacity-0"
                                                            : dateDown
                                                            ? "rotate-90"
                                                            : "rotate-[270deg]"
                                                    )}
                                                    />
                                                </motion.span>
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedProjects.map((project, idx) => (
                                        <TableRow key={project.id} className="hover:bg-white/15">
                                            <ContextMenu>
                                                <ContextMenuTrigger>
                                                    {renaming !== project.id ?
                                                    <Link className="flex justify-between pt-3 pb-3" 
                                                    href={renaming==null ? `/editor/${project.id}` : '/projects'} // clicking only redirects if not editing name
                                                    onClick={()=> {
                                                        setRenaming(null);
                                                        setNewName('');
                                                    }}>
                                                        <TableCell>
                                                            <motion.span 
                                                            initial={hasMounted ? false : {opacity: 0}}
                                                            animate={{opacity:1}}
                                                            transition={{duration: 1, delay: 1/(sortedProjects.length)*idx}}
                                                            className="flex gap-3 items-baseline">
                                                                <p className="line-clamp-1">{project.title}</p>
                                                                <p className="text-neutral-400 text-sm line-clamp-1">/ {project.file}</p>
                                                            </motion.span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <motion.p 
                                                            initial={hasMounted ? false : {opacity: 0}}
                                                            animate={{opacity:1}}
                                                            transition={{duration: 1, delay: 1/(sortedProjects.length)*idx}}
                                                            className="text-neutral-400 text-sm line-clamp-1">
                                                                {new Date(project.lastModified).toDateString()}
                                                            </motion.p>
                                                        </TableCell>
                                                    </Link>
                                                    : 
                                                    <div className="flex justify-between pt-3 pb-3">
                                                        <TableCell>
                                                            <span className="flex gap-3 items-baseline">
                                                                <Input
                                                                ref={inputElement}
                                                                className="border-neutral-400 text-white"
                                                                autoFocus
                                                                value={newName}
                                                                onChange={(e) => setNewName(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                      handleRenameSubmit(project.id);
                                                                    }
                                                                }}
                                                                onBlur={() => {handleRenameSubmit(project.id)}} 
                                                                />
                                                                <p className="text-neutral-400 text-sm line-clamp-1">/ {project.file}</p>
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center h-full">
                                                                <p className="text-neutral-400 text-sm line-clamp-1">
                                                                    {new Date(project.lastModified).toDateString()}
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                    </div>
                                                    }
                                                </ContextMenuTrigger>
                                                <ContextMenuContent>
                                                    <ContextMenuItem
                                                    onClick={()=>{
                                                        setRenaming(project.id);
                                                        setNewName(project.title);
                                                    }}>
                                                        <p className="flex w-full h-full hover:cursor-pointer">
                                                            Rename
                                                        </p>
                                                    </ContextMenuItem>
                                                    
                                                    <Dialog>
                                                        <ContextMenuItem>
                                                            <DialogTrigger className="w-full h-full text-start"
                                                            onClick={(e) => e.stopPropagation()}>
                                                                <p className="w-full h-full hover:cursor-pointer text-black">
                                                                    Share
                                                                </p>
                                                            </DialogTrigger>
                                                        </ContextMenuItem>
                                                        <DialogContent>
                                                            <Share projectId={project.id} projectName={project.title} />
                                                        </DialogContent>
                                                    </Dialog>
                                                    
                                                    <ContextMenuItem>
                                                        <p className="flex w-full h-full hover:cursor-pointer">
                                                            Delete
                                                        </p>
                                                    </ContextMenuItem>
                                                </ContextMenuContent>
                                            </ContextMenu>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </section>
}
