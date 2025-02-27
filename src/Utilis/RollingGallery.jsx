import React from "react";
import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useAnimation,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";

const RollingGallery = ({
  autoplay = false,
  pauseOnHover = false,
  videos = [],
}) => {

  const [isScreenSizeSm, setIsScreenSizeSm] = useState(
    window.innerWidth <= 640
  );
  useEffect(() => {
    const handleResize = () => setIsScreenSizeSm(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3D geometry
  const cylinderWidth = isScreenSizeSm ? 2100 : 2570;
  const faceCount = 10;
  const faceWidth = (cylinderWidth / faceCount) * 1.5;
  const radius = cylinderWidth / (1.5* Math.PI);

  // Framer Motion
  const dragFactor = 0.01;
  const rotation = useMotionValue(0);
  const controls = useAnimation();

  // Convert rotation -> 3D transform
  const transform = useTransform(
    rotation,
    (val) => `rotate3d(0,1,0,${val}deg)`
  );

  const startInfiniteSpin = (startAngle) => {
    controls.start({
      rotateY: [startAngle, startAngle - 360],
      transition: {
        duration: 40,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  useEffect(() => {
    if (autoplay) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    } else {
      controls.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay]);

  const handleUpdate = (latest) => {
    if (typeof latest.rotateY === "number") {
      rotation.set(latest.rotateY);
    }
  };

  const handleDrag = (_, info) => {
    controls.stop();
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };

  const handleDragEnd = (_, info) => {
    const finalAngle = rotation.get() + info.velocity.x * dragFactor;
    rotation.set(finalAngle);

    if (autoplay) {
      startInfiniteSpin(finalAngle);
    }
  };

  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) {
      controls.stop();
    }
  };
  const handleMouseLeave = () => {
    if (autoplay && pauseOnHover) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    }
  };

  return (
    <div className="relative h-56 w-full overflow-hidden">

      <div className="flex  items-center justify-center [perspective:1000px] [transform-style:preserve-3d]">
      <motion.div
        drag="x"
        dragElastic={0}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={controls}
        onUpdate={handleUpdate}
        style={{
          transform: transform,
          rotateY: rotation,
          width: cylinderWidth,
          transformStyle: "preserve-3d",
    }}
    className="flex min-h-[200px] cursor-grab items-center justify-center [transform-style:preserve-3d]"
    >
    {videos.map((video, i) => {
        const { videoFile, thumbnail, title, owner: ownerId } = video;

        return (
        <div
            key={i}
            className="group absolute flex h-fit items-center justify-center p-[8%] [backface-visibility:hidden] md:p-[6%]"
            style={{
            width: `${faceWidth}px`,
            transform: `rotateY(${(360 / faceCount) * i}deg) translateZ(${radius}px)`,
            }}
        >
            <Link to={`/video/${encodeURIComponent(title)}`} state={{ video, owner: ownerId }}>
            <div className="relative h-[120px] w-[300px] sm:h-[100px] sm:w-[220px] rounded-[5px] border-[3px] border-white overflow-hidden transition-transform duration-300 ease-out group-hover:scale-105">
                <video
                src={videoFile}
                poster={thumbnail}
                className="absolute inset-0 w-full h-full object-cover rounded-[5px] pointer-events-none"
                muted
                loop
                playsInline
                autoPlay
                />
            </div>
            </Link>
        </div>
        );
    })}
    </motion.div>

      </div>
    </div>
  );
};

export default RollingGallery;