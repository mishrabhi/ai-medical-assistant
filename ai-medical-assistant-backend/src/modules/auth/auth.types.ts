export interface RegisterUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface JwtUserPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
}