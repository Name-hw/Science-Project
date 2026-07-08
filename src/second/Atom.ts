import { Direction, ElementSymbol, ElementTable, ValenceElectronState, Bonds, BondState } from "./types.ts";
import { vec2 } from 'linearly'
import { DrawingContext } from "./DrawingContext.ts";

export class Atom extends DrawingContext {
    symbol: string;
    atomicNumber: number; // 원자 번호
    outermostElectronCount: number // 최외각 전자 수
    valenceElectronCount: number; // 원자가 전자 수
    bonds: Bonds; // 결합 상태 (동서남북으로 결합 가능)

    constructor(symbol: string) {
        super([0, 0]);

        const elementData = ElementTable[symbol as ElementSymbol];

        this.symbol = symbol;
        this.atomicNumber = elementData.atomicNumber;
        this.outermostElectronCount = elementData.outermostElectronCount;
        this.valenceElectronCount = elementData.valenceElectronCount;
        this.bonds = [null, null, null, null];
    }

    getUnsharedElectronCount(): number {
        let unsharedElectronCount = this.valenceElectronCount;

        for (let i: Direction = 0; i < 4; i++) {
            const bond = this.bonds[i];

            if (bond) {
                unsharedElectronCount -= bond!.sharedElectronPairCount;
            }
        }

        return unsharedElectronCount;
    }

    getMaximumOutermostElectron(): number {
        if (this.atomicNumber <= 2) {
            return 2;
        } else {
            return 8;
        }
    }

    getBondState(): BondState {
        let bondState!: BondState;

        for (let i: Direction = 0; i < 4; i++) {
            const bond = this.bonds[i];

            if (bond) {
                bondState[i] = false;
            } else if (!bond) {
                bondState[i] = true;
            }
        }

        return bondState;
    }

    getBondCount(): number {
        let bondCount: number = 0;

        for (let i: Direction = 0; i < 4; i++) {
            const bond = this.bonds[i];

            if (bond) {
                bondCount += 1;
            }
        }

        return bondCount;
    }

    getUnsharedElectronDirections(): Direction[] {
        let unsharedElectronDirections: Direction[] = [];

        for (let i: Direction = 0; i < 4; i++) {
            const bond = this.bonds[i];

            if (!bond) {
                unsharedElectronDirections.push(i);
            }
        }

        return unsharedElectronDirections;
    }

    draw() {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        const gap = 10;

        if (ctx) {
            ctx.font = "15pt '맑은 고딕'";
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillStyle = "black";
            ctx.fillText(this.symbol, this.position[0], this.position[1]);

            // 원자가 전자 위치 정하기
            const valenceElectronState: ValenceElectronState = [0, 0, 0, 0];
            const drawingElectronCount = this.getUnsharedElectronCount();
            const unsharedElectronDirections = this.getUnsharedElectronDirections();

            for (let i = 0; i < drawingElectronCount; i++) {
                for (const direction of unsharedElectronDirections) {
                    if (direction && valenceElectronState[direction] <= 2) {
                        valenceElectronState[direction] += 1;
                    }
                }
            }

            for (let i: Direction = 0; i < 4; i++) {
                if (valenceElectronState[i]) {
                    const count = valenceElectronState[i];
                    let position: vec2;

                    for (let v = 0; v <= count; v++) {
                        if (v > 0) {
                            switch (i) {
                                case Direction.top:
                                    if (v == 1) {
                                        position = [this.position[0] - gap / 2, this.position[1] - 50];
                                    }
                                    else {
                                        position = [this.position[0] + gap / 2, this.position[1] - 50];
                                    }
                                    break;
                                case Direction.bottom:
                                    if (v == 1) {
                                        position = [this.position[0] - gap / 2, this.position[1] + 50];
                                    }
                                    else {
                                        position = [this.position[0] + gap / 2, this.position[1] + 50];
                                    }
                                    break;
                                case Direction.right:
                                    if (v == 1) {
                                        position = [this.position[0] + 50, this.position[1] - gap / 2];
                                    }
                                    else {
                                        position = [this.position[0] + 50, this.position[1] + gap / 2];
                                    }
                                    break;
                                case Direction.left:
                                    if (v == 1) {
                                        position = [this.position[0] - 50, this.position[1] - gap / 2];
                                    }
                                    else {
                                        position = [this.position[0] - 50, this.position[1] + gap / 2];
                                    }
                                    break;
                            }

                            ctx.beginPath();
                            ctx.arc(position[0], position[1], 1, 0, 2 * Math.PI);
                            ctx.stroke();
                            ctx.lineWidth = 1;
                            ctx.fillStyle = "black";
                            ctx.fill();
                            ctx.closePath();
                        }
                    }
                }
            }
        }
    }
}