"use client";
import { animate, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { cn } from "../../../utils/cn";
import PsychologyIcon from '@mui/icons-material/Psychology';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

export function MeditationCard() {
    return (
        <Card className='w-72  mt-7'>
            <CardSkeletonContainer>
                <Skeleton />
            </CardSkeletonContainer>
            <CardTitle>Explore guided meditation</CardTitle>
            <CardDescription>
                Activate your chakras
            </CardDescription>
            <Box className='flex justify-center' component={Link} to='/meditation' >
                <Button variant="contained" color="inherit" size="small" >Explore now</Button>
            </Box>
        </Card>
    );
}

const Skeleton = () => {
    const scale = [1, 1.4, 1];
    const transform = ["translateY(0px)", "translateY(-4px)", "translateY(0px)"];
    const sequence = [
        [
            ".circle-1",
            {
                scale,
                transform,
            },
            { duration: 0.8 },
        ],
        [
            ".circle-2",
            {
                scale,
                transform,
            },
            { duration: 0.8 },
        ],
        [
            ".circle-3",
            {
                scale,
                transform,
            },
            { duration: 0.8 },
        ],
        [
            ".circle-4",
            {
                scale,
                transform,
            },
            { duration: 0.8 },
        ],
        [
            ".circle-5",
            {
                scale,
                transform,
            },
            { duration: 0.8 },
        ],
    ];

    useEffect(() => {
        // @ts-ignore
        animate(sequence, {
            repeat: Infinity,
            repeatDelay: 1,
        });
    }, []);
    return (
        <div
            className=" overflow-hidden h-full relative flex items-center justify-center"
        >
            <div className="flex flex-row flex-shrink-0 justify-center items-center gap-2">
                {/* <Container className="h-8 w-8 circle-1">
                    <PsychologyIcon fontSize="large" color="primary" />
                </Container> */}
                <Container className="h-12 w-12 circle-2">
                    <PsychologyAltIcon fontSize="large" color="primary" />
                </Container>
                <Container className="circle-3">
                    <SelfImprovementIcon fontSize="large" color="error" />
                </Container>
                <Container className="h-12 w-12 circle-4">
                    <PsychologyIcon fontSize="large" color="primary" />
                </Container>
                {/* <Container className="h-8 w-8 circle-5">
                    <SelfImprovementIcon fontSize="large" color="success" />
                </Container> */}
            </div>

            <div className="h-40 w-px absolute top-20 m-auto z-40 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-move">
                <div className="w-10 h-32 top-1/2 -translate-y-1/2 absolute -left-10">
                    <Sparkles />
                </div>
            </div>
        </div>
    );
};

const Sparkles = () => {
    const randomMove = () => Math.random() * 2 - 1;
    const randomOpacity = () => Math.random();
    const random = () => Math.random();
    return (
        <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
                <motion.span
                    key={`star-${i}`}
                    animate={{
                        top: `calc(${random() * 100}% + ${randomMove()}px)`,
                        left: `calc(${random() * 100}% + ${randomMove()}px)`,
                        opacity: randomOpacity(),
                        scale: [1, 2, 1],
                    }}
                    transition={{
                        duration: random() * 2 + 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        position: "absolute",
                        top: `${random() * 100}%`,
                        left: `${random() * 100}%`,
                        width: `2px`,
                        height: `2px`,
                        borderRadius: "50%",
                        zIndex: 1,
                    }}
                    className="inline-block bg-black dark:bg-white"
                ></motion.span>
            ))}
        </div>
    );
};

export const Card = ({
    className,
    children,
}) => {
    return (
        <div
            className={cn(
                "max-w-sm  mx-auto p-4 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
                className
            )}
        >
            {children}
        </div>
    );
};

export const CardTitle = ({
    children,
    className,
}) => {
    return (
        <h3
            className={cn(
                "text-lg font-semibold text-gray-800 dark:text-white ",
                className
            )}
        >
            {children}
        </h3>
    );
};

export const CardDescription = ({
    children,
    className,
}) => {
    return (
        <p
            className={cn(
                "text-sm font-normal text-neutral-600 dark:text-neutral-400 max-w-sm py-2",
                className
            )}
        >
            {children}
        </p>
    );
};

export const CardSkeletonContainer = ({
    className,
    children,
    showGradient = true,
}) => {
    return (
        <div
            className={cn(
                "h-[15rem] md:h-[20rem] rounded-xl z-40",
                className,
                showGradient &&
                "bg-neutral-300 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
            )}
        >
            {children}
        </div>
    );
};

const Container = ({
    className,
    children,
}) => {
    return (
        <div
            className={cn(
                `h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)]
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]
    `,
                className
            )}
        >
            {children}
        </div>
    );
};





