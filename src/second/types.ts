import { Bond } from "./Bond.ts";

// 원소 관련 타입
export interface ElementData {
    atomicNumber: number;
    outermostElectronCount: number;
    valenceElectronCount: number;
}

export type ElementSymbol =
    'H' | 'He' | 'Li' | 'Be' | 'B' | 'C' | 'N' | 'O' | 'F' | 'Ne'
    | 'Na' | 'Mg' | 'Al' | 'Si' | 'P' | 'S' | 'Cl' | 'Ar' | 'K' | 'Ca';

export const ElementTable: Record<ElementSymbol, ElementData> = {
    H: { atomicNumber: 1, outermostElectronCount: 1, valenceElectronCount: 1 },
    He: { atomicNumber: 2, outermostElectronCount: 2, valenceElectronCount: 0 },
    Li: { atomicNumber: 3, outermostElectronCount: 1, valenceElectronCount: 1 },
    Be: { atomicNumber: 4, outermostElectronCount: 2, valenceElectronCount: 2 },
    B: { atomicNumber: 5, outermostElectronCount: 3, valenceElectronCount: 3 },
    C: { atomicNumber: 6, outermostElectronCount: 4, valenceElectronCount: 4 },
    N: { atomicNumber: 7, outermostElectronCount: 5, valenceElectronCount: 5 },
    O: { atomicNumber: 8, outermostElectronCount: 6, valenceElectronCount: 6 },
    F: { atomicNumber: 9, outermostElectronCount: 7, valenceElectronCount: 7 },
    Ne: { atomicNumber: 10, outermostElectronCount: 8, valenceElectronCount: 0 },
    Na: { atomicNumber: 11, outermostElectronCount: 1, valenceElectronCount: 1 },
    Mg: { atomicNumber: 12, outermostElectronCount: 2, valenceElectronCount: 2 },
    Al: { atomicNumber: 13, outermostElectronCount: 3, valenceElectronCount: 3 },
    Si: { atomicNumber: 14, outermostElectronCount: 4, valenceElectronCount: 4 },
    P: { atomicNumber: 15, outermostElectronCount: 5, valenceElectronCount: 5 },
    S: { atomicNumber: 16, outermostElectronCount: 6, valenceElectronCount: 6 },
    Cl: { atomicNumber: 17, outermostElectronCount: 7, valenceElectronCount: 7 },
    Ar: { atomicNumber: 18, outermostElectronCount: 8, valenceElectronCount: 0 },
    K: { atomicNumber: 19, outermostElectronCount: 1, valenceElectronCount: 1 },
    Ca: { atomicNumber: 20, outermostElectronCount: 2, valenceElectronCount: 2 },
};

// 원자가 전자 관련 타입
export enum Direction { "top" = 0, "bottom" = 1, "right" = 2, "left" = 3 };

export function invertDirection(direction: Direction): Direction {
    switch (direction) {
        case Direction.top:
            direction = Direction.bottom

            break;
        case Direction.bottom:
            direction = Direction.top

            break;
        case Direction.right:
            direction = Direction.left

            break;
        case Direction.left:
            direction = Direction.right

            break;
    }

    return direction
}

export type ValenceElectronCount = 0 | 1 | 2;
export type ValenceElectronState = Record<Direction, ValenceElectronCount>;

export type Bonds = Record<Direction, Bond | null>;
export type BondState = Record<Direction, boolean>;

export type SharedElectronPairCount = 0 | 1 | 2 | 3;
