import { vec2 } from 'linearly'

export class DrawingContext {
    position!: vec2;

    constructor(position: vec2) {
        this.position = position;
    }
}