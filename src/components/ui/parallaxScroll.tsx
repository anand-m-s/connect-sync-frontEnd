"use client";
import React, { useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import PostModal from "../user/profileFeed/viewSelectedPost";
import { useSelector } from "react-redux";

export const ParallaxScroll = ({
  images,
  className,
  determineUser
}: {
  images: string[];
  className?: string;
  determineUser: string;
}) => {

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);


  const openModal = (imageUrl) => {
    setSelectedPostId(imageUrl)
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPostId(null);
  };
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef, // remove this if your container is not fixed height
    offset: ["start start", "end start"], // remove this if your container is not fixed height
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(images.length / 3);

  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);


  return (
    <>
      <div style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
        className={cn("h-[40rem] items-start overflow-auto  w-full", className)}
        ref={gridRef}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start  max-w-5xl mx-auto gap-3 p-12"
          ref={gridRef}
        >
          <div className="grid gap-4">
            {firstPart.map((el, idx) => (
              <motion.div
                style={{ y: translateFirst }}
                key={"grid-1" + idx}
                onClick={() => openModal(el)}
              >
                <img
                  src={el}
                  className="h-full w-full object-contain rounded-lg gap-1 !m-0 !p-0"
                  height="320"
                  width="320"
                  alt="thumbnail"
                />
              </motion.div>
            ))}
          </div>
          <div className="grid gap-4">
            {secondPart.map((el, idx) => (
              <motion.div style={{ y: translateSecond }} key={"grid-2" + idx}
                onClick={() => openModal(el)}
              >
                <img
                  src={el}
                  className="h-full w-full object-contain  rounded-lg gap-1 !m-0 !p-0"
                  height="320"
                  width="320"
                  alt="thumbnail"
                />
              </motion.div>
            ))}
          </div>
          <div className="grid gap-4">
            {thirdPart.map((el, idx) => (
              <motion.div style={{ y: translateThird }} key={"grid-3" + idx}
                onClick={() => openModal(el)}
              >
                <img
                  src={el}
                  className="h-full w-full object-contain rounded-lg gap-1 !m-0 !p-0"
                  height="320"
                  width="320"
                  alt="thumbnail"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <PostModal
        determineUser={determineUser}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        imageUrl={selectedPostId}
      />
    </>
  );
};
