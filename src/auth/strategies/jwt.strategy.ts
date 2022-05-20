import { JwtPayload } from './../models/jwt-payload.model';
import { AuthService } from './../auth.service';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt"
import { User } from 'src/users/models/users.model';

//Serviços possuem a anotação @Injectable()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService:AuthService,
    ) { super({
        jwtFormRequest: authService.returnJwtExtractor(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_SECRET
    }); 
    }

    async validate(jwtPayload: JwtPayload): Promise<User> {
        const user = await this.authService.validateUser(jwtPayload)
        if(!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}