import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Create PostgreSQL connection pool
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    // Create Prisma PG adapter (REQUIRED for v7)
    const adapter = new PrismaPg(pool);
    
    // Pass adapter to PrismaClient constructor
    super({ adapter });
    
    // Enable query logging (optional, remove in production)
    if (process.env.NODE_ENV === 'development') {
      (this as any).$use(async (params, next) => {
        console.log('Query: ' + params.model + '.' + params.action + params.args);
        return next(params);
      });
    }
  }

  async onModuleInit() {
    await this.$connect();
  }
}
