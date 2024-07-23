import React, { useState } from "react";
import {
    motion,
    useTransform,
    AnimatePresence,
    useMotionValue,
    useSpring,
} from "framer-motion";
import StyledBadge from "./miniComponents/StyledBadge";
import { Avatar } from "@mui/material";
import {useNavigate} from "react-router";



export const AnimatedTooltip = ({ items }) => {

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const navigate = useNavigate()
    const springConfig = { stiffness: 100, damping: 5 };
    const x = useMotionValue(0);
    const rotate = useSpring(
        useTransform(x, [-100, 100], [-45, 45]),
        springConfig
    );
    const translateX = useSpring(
        useTransform(x, [-100, 100], [-50, 50]),
        springConfig
    );
    const handleMouseMove = (event) => {
        const halfWidth = event.target.offsetWidth / 2;
        x.set(event.nativeEvent.offsetX - halfWidth);
    };

    return (
        <>
            {items.map((item, idx) => (
                <div
                    className="-mr-4 relative group cursor-pointer"
                    key={idx}
                    onMouseEnter={() => setHoveredIndex(item.id)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={()=>navigate(`/profile?userId=${item.id}`)}
                >
                    {hoveredIndex === item.id && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.6 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                transition: {
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 10,
                                },
                            }}
                            exit={{ opacity: 0, y: 20, scale: 0.6 }}
                            style={{
                                translateX: translateX,
                                rotate: rotate,
                                whiteSpace: "nowrap",
                            }}
                            className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2"
                        >
                            <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px " />
                            <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px " />
                            <div className="font-bold text-white relative z-30 text-base">
                                {item.userName}
                            </div>
                            {/* <div className="text-white text-xs">{item.userName}</div> */}
                        </motion.div>
                    )}
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar
                          sx={{ width: 56, height: 56 }}
                            onMouseMove={handleMouseMove}                           
                            src={item.profilePic ? item.profilePic : null}   
                            alt={item.userName}
                            className="object-cover !m-0 !p-0 object-top rounded-full h-14 w-14 border-1 group-hover:scale-105 group-hover:z-30 border-white relative transition duration-500"
                        ><p className="text-sm">{item.userName}</p></Avatar>

                    </StyledBadge>
                </div>
            ))}
        </>
    );
};
