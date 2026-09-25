import React from 'react';
import { motion as m } from 'framer-motion';

const JoinUs: React.FC = () => {
    return (
        <div className="join-page">
            <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    flex: 1,
                    justifyContent: 'center',
                    marginTop: '-100px'
                }}
            >
                <div className="neural-container">
                    <m.div
                        className="neural-core"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <m.div
                        className="gyro-ring g1"
                        animate={{ rotateX: 360, rotateY: 180, rotateZ: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <m.div
                        className="gyro-ring g2"
                        animate={{ rotateX: -360, rotateZ: -180 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                    <m.div
                        className="gyro-ring g3"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    />
                </div>
                <h2 className="stay-tuned-text">
                    Stay tuned for <br />
                    <span>upcoming Recruitments</span>
                </h2>
            </m.div>
        </div>
    );
};

export default JoinUs;