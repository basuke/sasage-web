/**
 * Minimal D1 type definitions for use in this project.
 * Avoids importing @cloudflare/workers-types globally, which overrides
 * the built-in Response.json() return type from `any` to `unknown`.
 */

export interface D1ExecResult {
    count: number;
    duration: number;
}

export interface D1Result<T = unknown> {
    results: T[];
    success: boolean;
    meta: D1ExecResult;
}

export interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = unknown>(colName?: string): Promise<T | null>;
    run(): Promise<D1ExecResult>;
    all<T = unknown>(): Promise<D1Result<T>>;
    raw<T = unknown>(): Promise<T[]>;
}

export interface D1Database {
    prepare(query: string): D1PreparedStatement;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
    exec(query: string): Promise<D1ExecResult>;
    dump(): Promise<ArrayBuffer>;
}
