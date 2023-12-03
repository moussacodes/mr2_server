import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
export declare class UserService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    findOneByUserName(username: string): Promise<User>;
    getMe(userArg: User): Promise<User & {
        role: import(".prisma/client").Role;
        threads: import(".prisma/client").Thread[];
    }>;
    deleteUser(userId: string, user: User): Promise<User>;
    getAllUser(): Promise<User[]>;
}
