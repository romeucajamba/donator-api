declare namespace Express {
  interface Request {
    user_email?: string;
    user_id?: string;
    user?: {
      id: number;
      role: string;
    };
  }
  interface User {
    id: string;
  }
}