import { motion } from "framer-motion";


// animations.js
export const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
};


export const MotionFadeUp = ({ children, delay = 0, duration = 0.6, ...rest }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration, delay, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        {...rest}
    >
        {children}
    </motion.div>
);

export const MotionFadeLeft = ({ children, delay = 0, duration = 0.6, ...rest }) => (
    <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration, delay, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.2 }}
        {...rest}
    >
        {children}
    </motion.div>
);

export const MotionFadeRight = ({ children, delay = 0, duration = 0.6, ...rest }) => (
    <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration, delay, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.2 }}
        {...rest}
    >
        {children}
    </motion.div>
);

// export const fadeIn = {
//     initial: { opacity: 0 },
//     whileInView: { opacity: 1 },
//     transition: { duration: 0.6 }
// };

// export const zoomIn = {
//     initial: { scale: 0.8, opacity: 0 },
//     whileInView: { scale: 1, opacity: 1 },
//     transition: { duration: 0.5 }
// };