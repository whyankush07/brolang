import { Variants } from "framer-motion";

export const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.2
        }
    }
};

export const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1] as any
        }
    }
};

export const titleVariants: Variants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1] as any
        }
    }
};