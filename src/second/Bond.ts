import { Direction, invertDirection, SharedElectronPairCount } from "./types.ts";
import { vec2 } from 'linearly'
import { DrawingContext } from "./DrawingContext.ts";
import { Atom } from "./Atom.ts";

export class Bond extends DrawingContext {
    atomA: Atom;
    atomB: Atom;
    sharedElectronPairCount!: SharedElectronPairCount; // 전자 공유쌍 개수
    direction: Direction;

    constructor(atomA: Atom, atomB: Atom, direction: Direction) {
        const position = vec2.div(vec2.add(atomA.position, atomB.position), 2);

        super(position);

        this.atomA = atomA;
        this.atomB = atomB;
        this.direction = direction;

        atomA.bonds[direction] = this;
        atomB.bonds[invertDirection(direction)] = this;
    }

    apply() {
        if (this.sharedElectronPairCount == 0) {
            this.atomA.bonds[this.direction] = null;
            this.atomB.bonds[invertDirection(this.direction)] = null;
        }
    }

    getDirection(atom: Atom): Direction {
        let direction!: Direction

        if (atom == this.atomA) {
            direction = this.direction
        } else if (atom == this.atomB) {
            direction = invertDirection(this.direction)
        }

        return direction;
    }

    draw() {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        const gap = 15;
        const width = 25;
        const height = 1.5;

        if (ctx) {
            if (this.direction == Direction.top || this.direction == Direction.bottom) {
                if (this.sharedElectronPairCount == 1) {
                    ctx.fillRect(this.position[0] - height / 2, this.position[1] - width / 2, height, width);
                } else if (this.sharedElectronPairCount == 2) {
                    ctx.fillRect(this.position[0] + gap / 2 - height / 2, this.position[1] - width / 2, height, width);
                    ctx.fillRect(this.position[0] - gap / 2 - height / 2, this.position[1] - width / 2, height, width);
                } else if (this.sharedElectronPairCount == 3) {
                    ctx.fillRect(this.position[0] + gap / 3 - height / 2, this.position[1] - width / 2, height, width);
                    ctx.fillRect(this.position[0] - height / 2, this.position[1] - width / 2, height, width);
                    ctx.fillRect(this.position[0] - gap / 3 - height / 2, this.position[1] - width / 2, height, width);
                }
            }
            else if (this.direction == Direction.right || this.direction == Direction.left) {
                if (this.sharedElectronPairCount == 1) {
                    ctx.fillRect(this.position[0] - width / 2, this.position[1] - height / 2, width, height);
                } else if (this.sharedElectronPairCount == 2) {
                    ctx.fillRect(this.position[0] - width / 2, this.position[1] + gap / 2 - height / 2, width, height);
                    ctx.fillRect(this.position[0] - width / 2, this.position[1] - gap / 2 - height / 2, width, height);
                } else if (this.sharedElectronPairCount == 3) {
                    ctx.fillRect(this.position[0] - width / 2, this.position[1] + gap / 3 - height / 2, width, height);
                    ctx.fillRect(this.position[0] - width / 2, this.position[1] - height / 2, width, height);
                    ctx.fillRect(this.position[0] - width / 2, this.position[1] - gap / 3 - height / 2, width, height);
                }
            }
        }
    }
}