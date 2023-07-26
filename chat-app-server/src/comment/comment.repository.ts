import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from 'src/schema/comment.model';
import { DataCreateComment } from './comment.dto';
import { IUserCreated, Pagination } from '../ultils/interface';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
  ) {}

  async create(
    user: IUserCreated,
    data: DataCreateComment,
    rightValue: number,
  ) {
    return await this.commentModel.create({
      ...data,
      comment_left: rightValue,
      comment_right: rightValue + 1,
      comment_user_id: user._id,
    });
  }

  async findMaxRightValue(postId: string) {
    return await this.commentModel.findOne(
      {
        comment_post_id: postId,
      },
      'comment_right',
      { $sort: { comment_right: -1 } },
    );
  }

  async findById(commentId: string) {
    return await this.commentModel.findById(commentId);
  }

  async updateManyChildCommentRight(
    postId: string,
    rightValue: number,
    quantity: number,
  ) {
    return await this.commentModel.updateMany(
      {
        comment_post_id: postId,
        comment_right: { $gte: rightValue },
      },
      {
        $inc: {
          comment_right: quantity,
        },
      },
    );
  }

  async updateManyChildCommentLeft(
    postId: string,
    rightValue: number,
    quantity: number,
  ) {
    return await this.commentModel.updateMany(
      {
        comment_post_id: postId,
        comment_left: { $gt: rightValue },
      },
      {
        $inc: {
          comment_left: quantity,
        },
      },
    );
  }

  async findParentComment(postId: string, pagination: Pagination) {
    const { page, limit, sortBy } = pagination;
    const offset = (page - 1) * limit;
    return await this.commentModel
      .find({
        comment_post_id: postId,
        comment_parent_id: null,
      })
      .populate('comment_user_id')
      .sort(sortBy === 'ctime' ? { createdAt: -1 } : { createdAt: 1 })
      .skip(offset)
      .limit(limit)
      // .select({})
      .lean();
  }

  async findChildComment(
    postId: string,
    parentCommentId: string,
    left: number,
    right: number,
    pagination: Pagination,
  ) {
    const { page, limit, sortBy } = pagination;
    const offset = (page - 1) * limit;
    return await this.commentModel
      .find({
        comment_post_id: postId,
        comment_parent_id: parentCommentId,
        comment_left: { $gt: left },
        comment_right: { $lte: right },
      })
      .populate('comment_user_id')
      .sort(sortBy === 'ctime' ? { createdAt: -1 } : { createdAt: 1 })
      .skip(offset)
      .limit(limit)
      // .select({})
      .lean();
  }

  async deleteComment(postId: string, leftValue: number, rightValue: number) {
    return await this.commentModel.deleteMany({
      comment_post_id: postId,
      comment_left: { $gte: leftValue, $lte: rightValue },
    });
  }

  async updateMany() {
    return await this.commentModel.updateMany(
      {},
      {
        comment_likes_num: 0,
        comment_likes: [],
      },
    );
  }
}
