/* eslint-disable @typescript-eslint/no-explicit-any */

export const log = (message: any) => console.log("[bot]", `${message}`);

export const error = (message: any) => console.log("[error]", `${message}`);

export const warn = (message: any) => console.log("[warn]", `${message}`);

export const success = (message: any) => console.log("[success]", `${message}`);
