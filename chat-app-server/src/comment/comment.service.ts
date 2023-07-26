import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { IComment, IUserCreated, Pagination } from '../ultils/interface';
import { DataCreateComment } from './comment.dto';
import { PostRepository } from '../post/post.repository';

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
        ),
        this.commentRepository.updateManyChildCommentLeft(
          comment_post_id,
          rightValue,
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
