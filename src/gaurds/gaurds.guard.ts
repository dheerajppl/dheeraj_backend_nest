import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGaurd implements CanActivate {
  constructor(
    private jwtService: JwtService
  ){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token){
      throw new UnauthorizedException('Inavalid token')
    };

    try {
      const payload = await this.jwtService.verify(token);
      request['user'] = payload; 
    } catch (e){
      console.log("Error in jwt vwrify", e)
      throw new UnauthorizedException('Invalid token')
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers['authorization']?.split(' ')[1];
  }

}
