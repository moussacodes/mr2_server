import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';
import { Tokens } from './types';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: SignupDto): Promise<Tokens>;
    signin(dto: SigninDto): Promise<Tokens>;
    logOut(userId: string): Promise<void>;
    refreshToken(userId: string, refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}
