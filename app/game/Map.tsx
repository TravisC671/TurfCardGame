'use client'

import styles from "./page.module.css";
import { useEffect, useRef } from "react";
import { mapRenderer } from "./mapRenderer";

export default function Map(props) {
	const canvasRef = useRef(null);

    const draw = (renderer:mapRenderer) => {
        renderer.render()
    }
    
	useEffect(() => {
        const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		let frameCount = 0;
		let animationFrameId;
        
        let renderer = new mapRenderer(context, canvas)

		const render = () => {
			frameCount++;
            draw(renderer)
			animationFrameId = window.requestAnimationFrame(render);
		};

		render();

		return () => {
			window.cancelAnimationFrame(animationFrameId);
		};
	}, [draw]);

	return <canvas className={styles.mapCanvas} ref={canvasRef} {...props}></canvas>;
}
