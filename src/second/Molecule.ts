import { Direction, SharedElectronPairCount } from "./types.ts";
import { scalar, vec2 } from 'linearly'
import { DrawingContext } from "./DrawingContext.ts";
import { Atom } from "./Atom.ts";
import { Bond } from "./Bond.ts";

export class Molecule extends DrawingContext {
    atoms: Atom[];
    bonds: Bond[];
    centralAtom!: Atom;

    constructor(moleculeFormula: string) {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        super([canvas.width / 2, canvas.height / 2])

        this.atoms = [];
        this.bonds = [];

        const gap = 100;

        const regex = /([A-Z][a-z]*)(\d*)/g; // 원소 기호와 숫자를 추출하는 정규식
        let match: RegExpExecArray | null;

        while (match = regex.exec(moleculeFormula)) {
            const symbol = match[1];
            let count: number;

            if (match[2]) {
                count = parseInt(match[2]);
            } else {
                count = 1;
            }

            for (let i = 0; i < count; i++) {
                const atom = new Atom(symbol);

                this.atoms.push(atom);
            }
        }

        // 중심 원자 구하기
        for (const atom of this.atoms) {
            if (this.centralAtom) {
                if (scalar.abs(atom.valenceElectronCount - 4) < scalar.abs(this.centralAtom.valenceElectronCount - 4)) {
                    this.centralAtom = atom;
                }
            } else {
                this.centralAtom = atom;
            }
        }

        // 원자 위치 정하기
        this.centralAtom.position = this.position

        const filterdAtoms = this.atoms.filter(atom => atom !== this.centralAtom);

        for (const [i, atom] of filterdAtoms.entries()) {
            let position: vec2 = this.centralAtom.position;
            let bond!: Bond;

            switch (i) {
                case 0:// 오른쪽 
                    atom.position = [position[0] + gap, position[1]];
                    bond = new Bond(this.centralAtom, atom, Direction.right);

                    break;
                case 1:// 왼쪽 
                    atom.position = [position[0] - gap, position[1]];
                    bond = new Bond(this.centralAtom, atom, Direction.left);

                    break;
                case 2: // 아래쪽 
                    atom.position = [position[0], position[1] + gap];
                    bond = new Bond(this.centralAtom, atom, Direction.bottom);

                    break;
                case 3:// 위쪽
                    atom.position = [position[0], position[1] - gap];
                    bond = new Bond(this.centralAtom, atom, Direction.top);

                    break;
            }

            this.bonds.push(bond);
        };

        // 원자가 전자 수의 합 구하기
        let valenceElectronTotal = 0;

        for (const atom of this.atoms) {
            valenceElectronTotal += atom.valenceElectronCount;
        }

        // 옥텟 규칙을 만족시키기 위해 필요한 전자 수의 합 구하기
        let requiredElectronTotal = 0;

        for (const atom of this.atoms) {
            requiredElectronTotal += atom.getMaximumOutermostElectron();
        }

        // 공유 전자쌍 개수 분석
        const sharedElectronPairCount = (requiredElectronTotal - valenceElectronTotal) / 2;

        if (filterdAtoms.length !== 0) {
            for (const [_, bond] of Object.entries(this.centralAtom.bonds)) {
                if (bond) {
                    bond.sharedElectronPairCount = (sharedElectronPairCount / filterdAtoms.length) as SharedElectronPairCount;
                    bond.apply();
                }
            }
        }

    }

    draw() {
        for (const bond of this.bonds) {
            bond.draw();
        };

        for (const atom of this.atoms) {
            atom.draw();
        };
    }

    destroy() {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}
