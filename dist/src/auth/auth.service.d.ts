import { PrismaService } from '../prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    hashPwd(pwd: string): Promise<any>;
    signup(dto: SignupDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    signin(dto: SigninDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    signToken(userId: string, email: string, role: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    updateRefreshTokenHash(userId: string, refreshToken: string): Promise<void>;
    logOut(userId: string): Promise<void>;
    refreshToken(userId: string, refreshtoken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    findRole(user: User): Promise<import(".prisma/client").Role>;
}
