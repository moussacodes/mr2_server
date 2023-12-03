import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
declare const AceessTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class AceessTokenStrategy extends AceessTokenStrategy_base {
    private prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    validate(req: Request, payload: {
        sub: string;
        email: string;
    }): Promise<{
        sub: string;
        email: string;
    }>;
}
export {};
