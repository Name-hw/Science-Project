import { vec2 } from 'linearly'

export class Object {
    id: number;
    m: number; // 질량
    v: vec2; // 속도
    a: vec2; // 가속도
    F: vec2; // 힘
    position: vec2; // 위치(좌표)
    size: number; // 지름
    isSelected: boolean;

    constructor(id: number, mass: number) {
        this.id = id;
        this.m = mass;
        this.v = [0, 0];
        this.a = [0, 0];
        this.F = [0, 0];
        this.position = [0, 0];
        this.size = 50;
        this.isSelected = false;
    }

    getMomentum(): vec2 {
        const p: vec2 = vec2.mul(this.v, this.m); // 운동량

        return p;
    }

    applyPosition(newPosition: vec2, dt: number) {
        const newVelocity: vec2 = vec2.div((vec2.sub(newPosition, this.position)), dt);
        const newAcceleration: vec2 = vec2.div((vec2.sub(newVelocity, this.v)), dt);
        const newForce: vec2 = vec2.mul(newAcceleration, this.m);

        this.v = newVelocity;
        this.a = newAcceleration;
        this.F = newForce;
        this.position = newPosition;
    }

    applyForce(F: vec2, dt: number) {
        const newForce = vec2.add(this.F, F);
        const newAcceleration: vec2 = vec2.add(this.a, vec2.div(newForce, this.m));
        const newVelocity: vec2 = vec2.add(this.v, vec2.mul(newAcceleration, dt));

        this.F = newForce;
        this.a = newAcceleration;
        this.v = newVelocity;
    }

    applyImpulse(I: vec2, dt: number) {
        const F: vec2 = vec2.div(I, dt); // 받은 힘

        this.applyForce(F, dt);
    }

    calculatePosition(dt: number) {
        if (this.isSelected !== true) {
            const d: vec2 = vec2.mul(this.v, dt); // 변위

            this.position = vec2.add(this.position, d);
        }
    }

    initForce() {
        this.a = [0, 0];
        this.F = [0, 0];
    }

    stop() {
        this.v = [0, 0];
        this.a = [0, 0];
        this.F = [0, 0];
    }

    animate = (dt: number) => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        //console.log(`Object ${this.id}: position = (${this.position[0]}, ${this.position[1]}), velocity = ${this.v}, acceleration = ${this.a}`);

        if (ctx) {
            ctx.beginPath();
            ctx.arc(this.position[0], this.position[1], this.size / 2, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.closePath();

            ctx.font = "bold 15pt '맑은 고딕'";
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillStyle = "black";
            ctx.fillText(this.id.toString(), this.position[0], this.position[1], 10);
        }
    }
}