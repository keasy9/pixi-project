/// <reference types="vite/client" />

import type {Application} from 'pixi.js';

declare global {
    var __PIXI_APP__: Application | unefined;
}