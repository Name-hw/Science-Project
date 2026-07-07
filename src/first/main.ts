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
let impulse: vec2 = [0, 0];
let isColliding: boolean = false;

let pointerEvent: PointerEvent | null = null;
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
    canvas.height = window.innerHeight * (3 / 4);

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
    // 합력 초기화
    objects[0].initForce();
    objects[1].initForce();

    // 선택된 물체 계산
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const pointerPosition: vec2 = [pointerEvent!.clientX - rect.left, pointerEvent!.clientY - rect.top];

        selectedObject!.applyPosition(pointerPosition, deltaTime! / 1000);
    }

    // 충돌 처리
    const distance = vec2.distance(objects[0].position, objects[1].position);

    if (!isColliding && distance <= (objects[0].size / 2 + objects[1].size / 2)) {
        canvasDragEnd();

        const object1_p: vec2 = objects[0].getMomentum();
        const object2_p: vec2 = objects[1].getMomentum();

        impulse = vec2.sub(object1_p, object2_p);

        objects[0].stop();
        objects[1].applyImpulse(impulse, deltaTime! / 1000);

        isColliding = true;
    } else if (isColliding && distance > (objects[0].size / 2 + objects[1].size / 2)) {
        isColliding = false;
    }

    // 위치 계산
    objects[0].calculatePosition(deltaTime! / 1000);
    objects[1].calculatePosition(deltaTime! / 1000);
}

// 2-2. 애니메이션
function animate(timestamp: number) {
    if (lastTime !== null) {
        deltaTime = timestamp - lastTime;

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        objects[0].animate();
        objects[1].animate();
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
function canvasDragStart(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    const pointerPosition: vec2 = [event.clientX - rect.left, event.clientY - rect.top]; // 캔버스 내에서의 포인터 위치(좌표)

    for (const object of objects) {
        const distance = vec2.distance(pointerPosition, object.position);

        if (distance <= (object.size / 2)) {
            isDragging = true;
            selectedObject = object;
            selectedObject.isSelected = true;

            break;
        }
    }

    pointerEvent = event
}

function canvasDragMove(event: PointerEvent) {
    pointerEvent = event
}

function canvasDragEnd() {
    if (isDragging) {
        isDragging = false;

        if (selectedObject) {
            selectedObject.isSelected = false;
            selectedObject = null;
        }
    }
}

// 3. 리셋
function reset() {
    cancelAnimationFrame(animationId1!);
    animationId1 = null;
    pointerEvent = null;
    lastTime = null;
    deltaTime = null;

    init()
    mainLoop();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

init();
mainLoop();
canvas.addEventListener('pointerdown', canvasDragStart);
canvas.addEventListener('pointermove', canvasDragMove);
canvas.addEventListener('pointerup', canvasDragEnd);
canvas.addEventListener('pointerleave', canvasDragEnd);
resetBtn.addEventListener('click', reset);
