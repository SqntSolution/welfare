import { Flex } from 'antd';
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
const AccordionList = ({ number, title, children, img, isOpen, onClick }) => {
    return (
        <motion.li className={isOpen ? 'act' : ''} >
            <div className='right-list'>
                <button onClick={onClick}>
                    <Flex align='center' gap={8}>
                        <span className='list-number'>{number}</span>
                        <h3 className='list-title'>{title}</h3>
                        <IoClose className='icon' />
                    </Flex>
                </button>
                <motion.div className='accodion-contents'
                    nitial={{ height: 0, opacity: 0 }}
                    animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                    <p>{children}</p>
                </motion.div>
            </div>
            <span className='left-imgBox' style={{ backgroundImage: `url(/img/sample/${img})` }} />
        </motion.li>
    );
}

export default AccordionList;
