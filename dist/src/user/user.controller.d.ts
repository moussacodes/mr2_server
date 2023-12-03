import { User } from '@prisma/client';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getMe(user: User): Promise<User & {
        role: import(".prisma/client").Role;
        threads: import(".prisma/client").Thread[];
    }>;
    deleteUser(userId: string, user: User): Promise<User>;
    findOneByUserName(username: string): Promise<User>;
}
