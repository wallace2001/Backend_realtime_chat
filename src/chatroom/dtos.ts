import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateChatroomDto {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;
  @IsArray()
  @Field(() => [String])
  userIds: string[];
}