"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const static_1 = __importDefault(require("@fastify/static"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const routes_1 = __importDefault(require("./routes"));
const db_1 = require("./utils/db");
const config_1 = __importDefault(require("./config"));
async function start() {
    try {
        // Log configuration on startup
        console.log(`Starting server in ${config_1.default.server.env} mode`);
        // Initialize database
        await (0, db_1.initializeDb)();
        const fastify = (0, fastify_1.default)({
            logger: {
                level: config_1.default.logger.level,
                transport: config_1.default.isDevelopment ? {
                    target: 'pino-pretty',
                    options: {
                        translateTime: 'HH:MM:ss Z',
                        ignore: 'pid,hostname',
                    },
                } : undefined,
            }
        });
        // Register plugins
        await fastify.register(cors_1.default, {
            origin: config_1.default.cors.origin,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        });
        await fastify.register(multipart_1.default, {
            limits: {
                fileSize: config_1.default.upload.maxFileSize,
            }
        });
        // Serve static files (uploads)
        await fastify.register(static_1.default, {
            root: config_1.default.storage.uploadsDir,
            prefix: '/api/files/',
            decorateReply: false,
        });
        // Register Swagger
        await fastify.register(swagger_1.default, {
            openapi: {
                info: {
                    title: 'Music Tracks API',
                    description: 'API for managing music tracks',
                    version: '1.0.0',
                }
            }
        });
        // Register Swagger UI
        await fastify.register(swagger_ui_1.default, {
            routePrefix: '/documentation',
            uiConfig: {
                docExpansion: 'list',
                deepLinking: true
            }
        });
        // Register routes
        await fastify.register(routes_1.default);
        // Start server
        await fastify.listen({
            port: config_1.default.server.port,
            host: config_1.default.server.host
        });
        console.log(`Server is running on http://${config_1.default.server.host}:${config_1.default.server.port}`);
        console.log(`Swagger documentation available on http://${config_1.default.server.host}:${config_1.default.server.port}/documentation`);
    }
    catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=index.js.map