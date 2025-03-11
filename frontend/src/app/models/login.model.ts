export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    userId: number;
    username: string;
    token: string; // Assuming the response includes a token
  }