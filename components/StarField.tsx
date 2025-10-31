import React, { useRef, useEffect } from 'react';

// Define a separate component for the star field to encapsulate its logic.
// This is better than defining it inside App.tsx to prevent re-creation on re-renders.
export const StarField: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            if (canvas) {
                canvas.width = width;
                canvas.height = height;
            }
        };
        window.addEventListener('resize', handleResize);

        const stars: { x: number; y: number; z: number }[] = [];
        const numStars = 800;
        const speed = 4;

        const initStars = () => {
            stars.length = 0; // Clear the array
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: (Math.random() - 0.5) * 2000,
                    y: (Math.random() - 0.5) * 2000,
                    z: Math.random() * 2000
                });
            }
        };

        initStars();
        
        let animationFrameId: number;

        const draw = () => {
            if (!ctx) return;
            
            // Fading background for trail effect - increased alpha for faster fade
            ctx.fillStyle = 'rgba(12, 10, 9, 0.4)';
            ctx.fillRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;

            ctx.save();
            ctx.translate(centerX, centerY);

            stars.forEach(star => {
                star.z -= speed;
                if (star.z <= 0) {
                    star.x = (Math.random() - 0.5) * 2000;
                    star.y = (Math.random() - 0.5) * 2000;
                    star.z = 2000;
                }

                const k = 128.0 / star.z;
                const px = star.x * k;
                const py = star.y * k;

                const size = (1 - star.z / 2000) * 5;
                // Reduced max brightness from 255 to 200 for less contrast
                const shade = parseInt(( (1 - star.z / 2000) * 200 ).toString());
                
                // Draw star
                ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
                ctx.beginPath();
                ctx.arc(px, py, size / 2, 0, Math.PI * 2);
                ctx.fill();

                // Draw streak
                const k_prev = 128.0 / (star.z + speed * 20); // Make streak longer
                const px_prev = star.x * k_prev;
                const py_prev = star.y * k_prev;
                
                // Reduced streak opacity for less contrast
                ctx.strokeStyle = `rgba(${shade},${shade},${shade}, 0.1)`;
                ctx.lineWidth = size;
                ctx.beginPath();
                ctx.moveTo(px_prev, py_prev);
                ctx.lineTo(px, py);
                ctx.stroke();
            });
            
            ctx.restore();

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />;
};