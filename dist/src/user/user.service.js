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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const runtime_1 = require("@prisma/client/runtime");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async findOneByUserName(username) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    username: username,
                },
            });
            return user;
        }
        catch (error) {
            if (error instanceof runtime_1.PrismaClientKnownRequestError) {
                if (error.code === 'P1001') {
                    throw new common_1.ForbiddenException('Credential taken');
                }
            }
            throw error;
        }
    }
    async getMe(userArg) {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    email: userArg.email,
                },
                include: {
                    role: true,
                    threads: true,
                },
            });
            return user;
        }
        catch (error) {
            if (error instanceof runtime_1.PrismaClientKnownRequestError) {
                if (error.code === 'P1001') {
                    throw new common_1.ForbiddenException('Credential taken');
                }
            }
            throw error;
        }
    }
    async deleteUser(userId, user) {
        try {
            if (userId != user.id) {
                const delUser = await this.prisma.user.findFirst({
                    where: {
                        id: userId,
                    },
                });
                if (delUser) {
                    await this.prisma.comment.deleteMany({
                        where: {
                            userId,
                        },
                    });
                    await this.prisma.thread.deleteMany({
                        where: {
                            userId,
                        },
                    });
                    await this.prisma.badge.delete({
                        where: {
                            id: delUser.badgeId,
                        },
                    });
                    await this.prisma.role.deleteMany({
                        where: {
                            id: delUser.roleId,
                        },
                    });
                    const deletedUser = await this.prisma.user.delete({
                        where: {
                            id: userId,
                        },
                    });
                    return deletedUser;
                }
                else {
                    throw 'user does not exist';
                }
            }
            else {
                throw ' sorry you cannot delete yourself';
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async getAllUser() {
        try {
            const users = await this.prisma.user.findMany({});
            return users;
        }
        catch (error) {
            if (error instanceof runtime_1.PrismaClientKnownRequestError) {
                if (error.code === 'P1001') {
                    throw new common_1.ForbiddenException('Credential taken');
                }
            }
            throw error;
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map