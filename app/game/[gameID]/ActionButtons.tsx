"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import Card from "./Card";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/exports";
import { selectCardState, setSelectedCard } from "./store/cardSlice";
import { socket } from "./socket";

export default function ActionButtons(props) {
	const [isSpecialActive, setSpecialStatus] = useState(false);
	const [isPassBtnPressed, setPassBtnPressed] = useState(false);
	const [passTimeState, setPassTimeState] = useState(0);
	const [isMouseInPass, setMouseInPass] = useState(false);

	let passTime = 0;

	const passStatus = useRef(null);

    
	useEffect(() => {
        let animationInterval;
		let decreaseAnimationInterval;
        
        const playAnimation = () => {

            passTime += 3;

            if (passTime >= 100) {

                passTime = 100;
                passStatus.current.style.width = `${passTime}%`;

    			clearInterval(animationInterval);

                if (isMouseInPass) {
                    console.log('click')
                }
            }
    
            passStatus.current.style.width = `${passTime}%`;
            setPassTimeState(passTime);
        };

		const decreaseAnimation = () => {

			passTime -= 5;

			if (passTime <= 0) {

				passTime = 0;
                passStatus.current.style.width = `${passTime}%`;

			    clearInterval(decreaseAnimationInterval);
			}

			passStatus.current.style.width = `${passTime}%`;
			setPassTimeState(passTime);
		};

		if (isPassBtnPressed) {
			animationInterval = setInterval(playAnimation, 10);
		} else {
			passTime = passTimeState;
			clearInterval(animationInterval);
			decreaseAnimationInterval = setInterval(decreaseAnimation, 10);
		}

		return () => {
			clearInterval(animationInterval);
			clearInterval(decreaseAnimationInterval);
		};
	}, [isPassBtnPressed]);

	const specialButtonClick = () => {
		setSpecialStatus(!isSpecialActive);
	};
    
	const passStatusClickDown = () => {
        setPassBtnPressed(true);
        setMouseInPass(true)
	};

	const passStatusClickUp = () => {
		setPassBtnPressed(false);
	};

    const passStatusMouseLeave = () => {
		setMouseInPass(false);
	};

	return (
		<div className={styles.ActionButtonWrapper}>
			<button
				className={`${styles.uiButton} ${styles.passBtnWrapper}`}
				onMouseDown={passStatusClickDown}
				onMouseUp={passStatusClickUp}
                onMouseLeave={passStatusMouseLeave}
			>
				<div ref={passStatus} className={styles.passStatus}></div>
				<h2 className={styles.passText} >Pass</h2>
			</button>
			<button
				className={`${styles.uiButton} ${
					isSpecialActive ? styles.specialActive : ""
				}`}
				onClick={specialButtonClick}
			>
				<h2 className={styles.specialText}>Special</h2>
			</button>
		</div>
	);
}
