import { useRef, useState, useEffect } from 'react';

import isMobile from 'ismobilejs'
const isMob = isMobile(navigator.userAgent).any;

interface IHoverProps {
	isHovered: boolean;
}

// Hook
export function useHover(): [React.RefObject<HTMLDivElement>, IHoverProps] {
	const [hoverProps, setValue] = useState({ isHovered: isMob ? true : false });

	const divRef = useRef<HTMLDivElement>(null);

	const handleMouseOver = () => { console.log('unisao'); setValue({ isHovered: true })};
	const handleMouseOut = () => setValue({ isHovered: false });

	useEffect(
		() => {
			const node = divRef.current;
			if (node) {

				if (!isMob) {
					node.addEventListener('mouseenter', () => handleMouseOver());
					node.addEventListener('mouseleave', () => handleMouseOut());

					return () => {
						node.removeEventListener('mouseenter', () => handleMouseOver());
						node.removeEventListener('mouseleave', () => handleMouseOut());
					};
				}
			}
		}, [] // Recall only if ref changes
	);

	return [divRef, hoverProps];
}

