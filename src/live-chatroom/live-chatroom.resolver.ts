import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { Request } from 'express';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.type';
import { LiveChatroomService } from './live-chatroom.service';
@Resolver()
export class LiveChatroomResolver {
  private pubSub: PubSub;
  constructor(
    private readonly liveChatroomService: LiveChatroomService,
    private readonly userService: UserService,
  ) {
    this.pubSub = new PubSub();
  }

  @Subscription(() => [User], {
    nullable: true,
    resolve: (value) => value.liveUsers,
    filter: (payload, variables) => {
      return payload.chatroomId === variables.chatroomId;
    },
  })
  liveUsersInChatroom(@Args('chatroomId') chatroomId: number) {
    return this.pubSub.asyncIterator(`liveUsersInChatroom.${chatroomId}`);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Boolean)
  async enterChatroom(
    @Args('chatroomId') chatroomId: number,
    @Context() context: { req: Request },
  ) {
    const user = await this.userService.getUser(context.req.user.sub);
    await this.liveChatroomService.addLiveUserToChatroom(chatroomId, user);
    const liveUsers = await this.liveChatroomService
      .getLiveUsersForChatroom(chatroomId)
      .catch((err) => {
        console.log('getLiveUsersForChatroom error', err);
      });

    await this.pubSub
      .publish(`liveUsersInChatroom.${chatroomId}`, {
        liveUsers,
        chatroomId,
      })
      .catch((err) => {
        console.log('pubSub error', err);
      });
    return true;
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Boolean)
  async leaveChatroom(
    @Args('chatroomId') chatroomId: number,
    @Context() context: { req: Request },
  ) {
    const user = await this.userService.getUser(context.req.user.sub);
    await this.liveChatroomService.removeLiveUserFromChatroom(chatroomId, user);
    const liveUsers = await this.liveChatroomService.getLiveUsersForChatroom(
      chatroomId,
    );
    await this.pubSub.publish(`liveUsersInChatroom.${chatroomId}`, {
      liveUsers,
      chatroomId,
    });

    return true;
  }
}