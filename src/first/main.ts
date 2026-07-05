import { vec2 } from 'linearly';
import { Object } from './Object.ts';

const object1_m_input = document.getElementById('object1_m') as HTMLInputElement;
const object1_v_span = document.getElementById('object1_v') as HTMLInputElement;
const object1_p_span = document.getElementById('object1_p') as HTMLInputElement;

const object2_m_input = document.getElementById('object2_m') as HTMLInputElement;
const object2_v_span = document.getElementById('object2_v') as HTMLSpanElement;
const object2_p_span = document.getElementById('object2_p') as HTMLInputElement;

const object_I_span = document.getElementById('object_I') as HTMLInputElement;

const resetBtn = document.getElementById('reset_btn') as HTMLButtonElement;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

let animationId1: number | null = null;
let lastTime: number | null = null; // 초 단위임
let deltaTime: number | null = null; // 초 단위임

let objects: Array<Object> = [];
let selectedObject: Object | null = null;
let impulse: vec2 = [0,0];

let animationId2: number | null = null;
let mouseEvent: MouseEvent | null = null;
let isDragging: boolean = false;

//
// 코드 구조
// 1. 초기화
// 2. 메인루프(계산, 애니메이션, UI 업데이트, 이벤트 처리)
// 3. 리셋
//

// 1. 초기화
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight / 2;

    createObject();
}

function createObject() {
    const object1_m = Number(object1_m_input.value);
    const object2_m = Number(object2_m_input.value);

    objects[0] = new Object(1, object1_m);
    objects[0].position = [50, 100];

    objects[1] = new Object(2, object2_m);
    objects[1].position = [400, 100];
}

// 2. 메인루프
function mainLoop() {
    calculate();
    animate(performance.now());
    updateUI();

    animationId1 = requestAnimationFrame(mainLoop);
}

// 2-1. 계산
function calculate() {
    const distance = vec2.distance(objects[0].position, objects[1].position);

    if (distance <= (objects[0].size / 2 + objects[1].size / 2)) {
        canvasDragEnd();

        const object1_p: vec2 = objects[0].getMomentum();
        const object2_p: vec2 = objects[1].getMomentum();

        if (objects[0].m < objects[1].m) {
            impulse = object2_p;
        } else if (objects[0].m == objects[1].m) {
            impulse = object2_p;
        } else if (objects[0].m > objects[1].m) {
            impulse = object1_p;
        }

        objects[0].applyImpulse(impulse, deltaTime! / 1000);
        objects[1].applyImpulse(impulse, deltaTime! / 1000);
    }
}

// 2-2. 애니메이션
function animate(timestamp: number) {
    if (lastTime !== null) {
        deltaTime = timestamp - lastTime;

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        objects[0].animate(deltaTime / 1000);
        objects[1].animate(deltaTime / 1000);
    }

    lastTime = timestamp;
}

// 2-3. UI 업데이트
function updateUI() {
    const object1_p = objects[0].getMomentum();
    const object2_p = objects[1].getMomentum();

    object1_v_span.textContent = vec2ToFixed(objects[0].v);
    object1_p_span.textContent = vec2ToFixed(object1_p);
    object2_v_span.textContent = vec2ToFixed(objects[1].v);
    object2_p_span.textContent = vec2ToFixed(object2_p);
    object_I_span.textContent = vec2ToFixed(impulse);
}

function vec2ToFixed(v: vec2): string {
    const a: vec2 = vec2.div(v, 60);
    const r: string = `(${a[0].toFixed(2)}, ${a[1].toFixed(2)})`;

    return r;
}

// 2-4. 이벤트 처리
function canvasDragStart(event: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const mousePosition: vec2 = [event.clientX - rect.left, event.clientY - rect.top]; // 캔버스 내에서의 마우스 위치(좌표)

    for (const object of objects) {
        const distance = vec2.distance(mousePosition, object.position);

        if (distance <= (object.size / 2)) {
            isDragging = true;
            selectedObject = object;
            selectedObject.isSelected = true;

            break;
        }
    }

    mouseEvent = event

    canvasDragging();
}

function canvasDragging() {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const mousePosition: vec2 = [mouseEvent!.clientX - rect.left, mouseEvent!.clientY - rect.top];

        selectedObject!.setPosition(mousePosition, deltaTime! / 1000);
        
        animationId2 = requestAnimationFrame(canvasDragging);
    }
}

function canvasDragMove(event: MouseEvent) {
    mouseEvent = event
}

function canvasDragEnd() {
    if (isDragging) {
        isDragging = false;

        if (selectedObject) {
            selectedObject.isSelected = false;
            selectedObject = null;
        }

        cancelAnimationFrame(animationId2!);
    }
}

// 3. 리셋
function reset() {
    cancelAnimationFrame(animationId1!);
    cancelAnimationFrame(animationId2!);
    animationId1 = null;
    animationId2 = null;
    mouseEvent = null;
    lastTime = null;
    deltaTime = null;

    init()
    mainLoop();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

init();
mainLoop();
canvas.addEventListener('mousedown', canvasDragStart);
canvas.addEventListener('mousemove', canvasDragMove);
canvas.addEventListener('mouseup', canvasDragEnd);
canvas.addEventListener('mouseleave', canvasDragEnd);
resetBtn.addEventListener('click', reset);