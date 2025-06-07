import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import mongoose, { Model } from 'mongoose';
import { PostCreateDto } from './dto/postCreate.dto';
import { title } from 'process';

@Injectable()
export class PostService {
    constructor(@InjectModel(Post.name) private PostModel: Model<Post>) { }
    async createPost(CreatePostDto: PostCreateDto, _id: mongoose.Types.ObjectId) {
        try {
            return await this.PostModel.create({
                ...CreatePostDto,
                createdBy: new mongoose.Types.ObjectId(_id)
            })
        } catch (err) {
            console.log("Error Creating post", err)
            throw err
        }
    }

    async getPosts() {
        try {
            const result = this.PostModel.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "createdBy",
                        foreignField: '_id',
                        as: "createdBy"
                        

                    }
                },
                {
                    $unwind: "$createdBy"
                },
                {
                    $project:{
                        "createdBy.name":1,
                        title:1,
                        description:1,
                        createdAt:1

                    }
                }
            ])
            return result;
        } catch (err) {
            throw err;
        }
    }
}
