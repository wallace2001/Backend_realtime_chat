import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateChatroomDto {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;
  @Field()
  @IsNumber()
  @IsNotEmpty({ message: 'Name is required.' })
  ownerId: string;
  @IsArray()
  @Field(() => [String])
  userIds: string[];
}