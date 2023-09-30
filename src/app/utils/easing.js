import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

export const smooth = CustomEase.create('smooth', '0.7, 0, 0.3, 1');
export const translate = CustomEase.create('translate', '.9, 0, .1, 1');
