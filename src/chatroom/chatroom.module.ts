import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.sevice';
import { UserService } from 'src/user/user.service';
import { ChatroomResolver } from './chatroom.resolver';
import { ChatroomService } from './chatroom.service';

@Module({
  providers: [
    ChatroomService,
    ChatroomResolver,
    PrismaService,
    UserService,
    JwtService,
  ],
})
export class ChatroomModule {}