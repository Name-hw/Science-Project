import { Molecule } from "./Molecule";

const molecule_input = document.getElementById('molecule') as HTMLInputElement;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

let molecule: Molecule | null = null;

//
// 코드 구조
// 1. 초기화
// 2. 이벤트 처리
//

// 1. 초기화
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * (3 / 4);
}

// 2. 이벤트 처리
function onChanged(event: Event) {
    if (molecule) {
        molecule.destroy();
    }

    const moleculeFormula: string = (event.target as HTMLInputElement).value;

    molecule = new Molecule(moleculeFormula);
    molecule.draw();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

init();
molecule_input.addEventListener('change', onChanged);