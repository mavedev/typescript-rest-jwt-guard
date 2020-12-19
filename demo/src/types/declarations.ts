import cors from 'cors';

// ==================== Utility types ====================

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Maybe<T> = Nullable<T> | Optional<T>;

export type CorsMiddleware = (req: cors.CorsRequest, res: {
  statusCode?: number | undefined;
  setHeader(key: string, value: string): any;
  end(): any;
}, next: (err?: any) => any) => void;

// ========================= DTOs ==========================

export type HealthResponseDTO = {
  message: string;
  version: string;
};

export type SimpleResponseDTO = {
  message: string;
};
