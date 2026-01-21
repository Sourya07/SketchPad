export type Shape =
    | {
        type: "rect";
        x: number;
        y: number;
        width: number;
        height: number;
    }
    | {
        type: "circle";
        cx: number;
        cy: number;
        r: number;
    }
    | {
        type: "triangle";
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        x3: number;
        y3: number;
    }
    | {
        type: "pencil";
        points: { x: number; y: number }[];
    };

export type Tool = "rect" | "circle" | "triangle" | "pencil";