import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Ensure DATABASE_URL is loaded from .env if not already set
function loadEnvIfNeeded() {
    if (!process.env.DATABASE_URL) {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
            for (const line of lines) {
                const match = line.match(/^([^#=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const val = match[2].trim().replace(/^"|"$/g, '');
                    if (!process.env[key]) process.env[key] = val;
                }
            }
        }
    }
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        loadEnvIfNeeded();
        const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
        super({ adapter } as any);
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
