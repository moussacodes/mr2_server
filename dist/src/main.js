"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const helmet_1 = require("helmet");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: {
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
            origin: 'http://localhost:3000',
            credentials: true,
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use((0, helmet_1.default)());
    await app.listen(5000);
}
bootstrap();
//# sourceMappingURL=main.js.map