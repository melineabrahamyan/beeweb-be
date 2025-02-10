import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../database/ormconfig';
import { UserModule } from './moduls/user/user.module';
import { AuthModule } from './moduls/auth/auth.module';
import { WorkspaceModule } from './moduls/workspace/workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    WorkspaceModule,
  ],
})
export class AppModule {}
