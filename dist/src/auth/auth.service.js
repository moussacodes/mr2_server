"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async hashPwd(pwd) {
        const salt = 10;
        return await bcrypt.hash(pwd, salt);
    }
    async signup(dto) {
        try {
            const userEmailExist = await this.prisma.user.findFirst({
                where: { email: dto.email },
            });
            const userUsernameExist = await this.prisma.user.findFirst({
                where: { username: dto.username },
            });
            if (!userEmailExist && !userUsernameExist) {
                const hashedPassword = await this.hashPwd(dto.hashedPassword);
                const newRole = await this.prisma.role.create({
                    data: {
                        name: 'ADMIN',
                    },
                });
                if (!newRole) {
                    throw "couldn't create role";
                }
                const newBadge = await this.prisma.badge.create({
                    data: {
                        name: 'STARTER',
                    },
                });
                if (!newBadge) {
                    throw "couldn't create badge";
                }
                const user = await this.prisma.user.create({
                    data: {
                        username: dto.username,
                        email: dto.email,
                        hashedPassword,
                        badge: {
                            connect: {
                                id: newBadge.id,
                            },
                        },
                        role: {
                            connect: {
                                id: newRole.id,
                            },
                        },
                        active: true,
                        score: 0,
                    },
                });
                if (!user) {
                    throw "couldn't create badge";
                }
                const role = await this.findRole(user);
                if (role) {
                    const tokens = await this.signToken(user.id, user.email, role.name);
                    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
                    return tokens;
                }
            }
            else {
                throw new common_1.ForbiddenException('Credential taken');
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException('Credential taken');
                }
            }
            throw error;
        }
    }
    async signin(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email,
            },
        });
        if (!user) {
            throw new common_1.ForbiddenException('Credential incorrect');
        }
        const isMatch = await bcrypt.compare(dto.hashedPassword, user.hashedPassword);
        if (!isMatch)
            throw new common_1.ForbiddenException('Credentials incorrect');
        const role = await this.findRole(user);
        if (role) {
            const tokens = await this.signToken(user.id, user.email, role.name);
            await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
            return tokens;
        }
    }
    async signToken(userId, email, role) {
        const secret = this.config.get('JWT_SECRET');
        const payload = {
            sub: userId,
            email,
            role,
        };
        const [aceess_token, refresh_token] = await Promise.all([
            this.jwt.signAsync(payload, {
                expiresIn: '15m',
                secret: secret,
            }),
            this.jwt.signAsync(payload, {
                expiresIn: 60 * 60 * 24 * 7,
                secret: secret,
            }),
        ]);
        return {
            access_token: aceess_token,
            refresh_token: refresh_token,
        };
    }
    async updateRefreshTokenHash(userId, refreshToken) {
        const hashedToken = await this.hashPwd(refreshToken);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshToken: hashedToken,
            },
        });
    }
    async logOut(userId) {
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshToken: null,
            },
        });
    }
    async refreshToken(userId, refreshtoken) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user)
            throw new common_1.ForbiddenException('Access denied');
        if (user.refreshToken != null) {
            const match = bcrypt.compare(refreshtoken, user.refreshToken);
            if (!match)
                throw new common_1.ForbiddenException('Access denied [WRONG CREDENTIALS]');
        }
        else {
            throw new common_1.ForbiddenException("You've been logged out, you need to log in again ");
        }
        const role = await this.findRole(user);
        if (role) {
            const tokens = await this.signToken(user.id, user.email, role.name);
            await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
            return tokens;
        }
    }
    async findRole(user) {
        const role = await this.prisma.role.findFirst({
            where: {
                id: user.roleId,
            },
        });
        return role;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map