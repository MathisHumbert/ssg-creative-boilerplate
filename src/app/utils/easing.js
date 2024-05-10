import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

export const easeInOut = CustomEase.create('easeInOut', '0.7, 0, 0.3, 1');
export const expoInOut = CustomEase.create('expoInOut', '.9, 0, .1, 1');
export const easeOut = CustomEase.create('easeOut', '0.39, 0.575, 0.565, 1');
export const expoOut = CustomEase.create('expoOut', '0.19, 1, 0.22, 1');
