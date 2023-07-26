import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { IComment, IUserCreated, Pagination } from '../ultils/interface';
import {
  DataCreateComment,
  DataDeleteComment,
  DataUpdateComment,
} from './comment.dto';
import { PostRepository } from '../post/post.repository';
import { CommentType } from '../ultils/constant';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async createComment(user: IUserCreated, data: DataCreateComment) {
    const { comment_parent_id, comment_post_id } = data;
    let rightValue: number = 1;
    // Reply
    if (comment_parent_id) {
      const parentComment = await this.commentRepository.findById(
        comment_parent_id,
      );
      if (!parentComment)
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);

      rightValue = parentComment.comment_right;

      // Update all child comment
      const promises = [
        this.commentRepository.updateManyChildCommentRight(
          comment_post_id,
          rightValue,
          2,
        ),
        this.commentRepository.updateManyChildCommentLeft(
          comment_post_id,
          rightValue,
          2,
        ),
      ];
      await Promise.all(promises);
    } else {
      // Get max right value
      const maxRightValue = await this.commentRepository.findMaxRightValue(
        comment_post_id,
      );
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      }
      console.log(rightValue);
    }

    await this.postRepository.increQuantityCommentNum(comment_post_id);
    const comment = await this.commentRepository.create(user, data, rightValue);

    return this.convertCommentToString(comment, user);
  }

  async getListCommentOfPost(
    postId: string,
    parentCommentId: string,
    pagination: Pagination,
  ) {
    const foundPost = await this.postRepository.findById(postId);
    if (!foundPost)
      throw new HttpException('Post not found!', HttpStatus.BAD_REQUEST);

    pagination.limit = pagination.limit + 10;
    let comments = [];
    let parentComment = null;

    if (!parentCommentId) {
      comments = await this.commentRepository.findParentComment(
        postId,
        pagination,
      );
    } else {
      const foundParentComment = await this.commentRepository.findById(
        parentCommentId,
      );
      if (!foundParentComment)
        throw new HttpException('Comment not found!', HttpStatus.NOT_FOUND);

      comments = await this.commentRepository.findChildComment(
        postId,
        parentCommentId,
        foundParentComment.comment_left,
        foundParentComment.comment_right,
        pagination,
      );
      parentComment = foundParentComment;
    }

    if (comments.length <= 10)
      return {
        parentComment,
        comments,
        remainComment: 0,
      };
    else
      return {
        parentComment,
        comments: comments.slice(0, 11),
        remainComment: comments.length - 10,
      };
  }

  async updateComment(user: IUserCreated, data: DataUpdateComment) {
    const { comment_id, comment_content, comment_post_id } = data;

    if (comment_content.trim() === '')
      throw new HttpException('Invalid content!', HttpStatus.BAD_REQUEST);

    const foundPost = await this.postRepository.findById(comment_post_id);
    if (!foundPost)
      throw new HttpException('Post not found!', HttpStatus.NOT_FOUND);

    const foundComment = await this.commentRepository.findById(comment_id);
    if (!foundComment)
      throw new HttpException('Comment not found!', HttpStatus.NOT_FOUND);

    if (foundComment.comment_type !== CommentType.TEXT)
      throw new HttpException('Not valid!', HttpStatus.BAD_REQUEST);

    if (foundComment.comment_user_id.toString() !== user._id)
      throw new HttpException('You not permission!', HttpStatus.BAD_REQUEST);

    foundComment.comment_content = comment_content;
    foundComment.save();

    return this.convertCommentToString(foundComment, user);
  }

  async deleteComment(user: IUserCreated, data: DataDeleteComment) {
    const { comment_id, comment_post_id } = data;

    const foundPost = await this.postRepository.findById(comment_post_id);
    if (!foundPost)
      throw new HttpException('Post not found!', HttpStatus.NOT_FOUND);

    const foundComment = await this.commentRepository.findById(comment_id);
    if (!foundComment)
      throw new HttpException('Comment not found!', HttpStatus.NOT_FOUND);

    const leftValue = foundComment.comment_left;
    const rightValue = foundComment.comment_right;
    const width = rightValue - leftValue + 1;

    // Delete all comment and child Comment
    await this.commentRepository.deleteComment(
      comment_post_id,
      leftValue,
      rightValue,
    );

    // Change left and right value
    const promise = [
      this.commentRepository.updateManyChildCommentLeft(
        comment_post_id,
        rightValue,
        -width,
      ),
      this.commentRepository.updateManyChildCommentRight(
        comment_post_id,
        rightValue,
        -width,
      ),
    ];

    await Promise.all(promise);
    // increment quantity comment
    await this.postRepository.increQuantityCommentNum(
      comment_post_id,
      -Math.floor(width / 2),
    );

    return foundComment;
  }

  async fixBugComment() {
    return await this.commentRepository.updateMany();
  }

  convertCommentToString(comment: any, user: IUserCreated) {
    return {
      _id: comment._id,
      comment_post_id: comment.comment_post_id,
      comment_user_id: user,
      comment_type: comment.comment_type,
      comment_content: comment.comment_content,
      comment_left: comment.comment_left,
      comment_right: comment.comment_right,
      comment_parent_id: comment.comment_parent_id,
      isDeleted: comment.isDeleted,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
