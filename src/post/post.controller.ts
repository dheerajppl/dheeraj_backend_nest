import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGaurd } from 'src/gaurds/gaurds.guard';
import { PostCreateDto } from './dto/postCreate.dto';
@UseGuards(AuthGaurd)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }
  @Post()
  async CreatePost(@Body() CreatePostDto: PostCreateDto, @Req() req) {
    console.log("user", req.user)
    return this.postService.createPost(CreatePostDto, req.user._id)
  }

  @Get()
    async getPosts(){
      return this.postService.getPosts();
    }

}
