"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const prisma_module_1 = require("./prisma/prisma.module");
const config_1 = require("@nestjs/config");
const helmet_1 = require("helmet");
const auth_controller_1 = require("./auth/auth.controller");
const user_controller_1 = require("./user/user.controller");
const cors_1 = require("cors");
const redis = require("redis");
const core_1 = require("@nestjs/core");
const redisStore = require("cache-manager-redis-store");
const guards_1 = require("./auth/guards");
const user_guard_1 = require("./user/guards/user.guard");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const cache_manager_1 = require("@nestjs/cache-manager");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(cors_1.default, (0, helmet_1.default)())
            .forRoutes(auth_controller_1.AuthController, user_controller_1.UserController);
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            common_1.CacheModule.registerAsync({
                isGlobal: true,
                useFactory: () => ({
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => {
                        const client = redis.createClient({
                            socket: {
                                host: 'localhost',
                                port: 6379,
                            },
                        });
                        return {
                            store: require('cache-manager').caching({
                                store: redisStore,
                                client,
                            }),
                        };
                    },
                    inject: [config_1.ConfigService],
                }),
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            prisma_module_1.PrismaModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            { provide: core_1.APP_GUARD, useClass: guards_1.AcessTokenGuard },
            { provide: core_1.APP_GUARD, useClass: user_guard_1.RoleGuard },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: cache_manager_1.CacheInterceptor,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map