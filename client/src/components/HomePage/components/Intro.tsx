import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Intro: React.FC = () => {
    const introRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(
            introRef.current?.children!,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power2.out' }
        );
    }, []);

    return (
        <div ref={introRef} className="space-y-4 mx-10 intro">
            <div className="text-5xl font-extrabold max-sm:text-4xl max-sm:font-bold">
                Let's Flight Now.
            </div>
            <div className="text-4xl text-blue-900 font-extrabold max-sm:text-3xl max-sm:font-bold">
                Don't Worry Over Baggage.
            </div>
            <div>
                We Provide ticket services with the most comfortable system in India.
            </div>
        </div>
    );
};

export default Intro;
