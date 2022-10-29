import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  user_id: string;
}

class TurnUserAdminUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  execute({ user_id }: IRequest): User {
    const targetUser = this.usersRepository.findById(user_id);
    if (!targetUser) throw new Error("User does not exists");

    const user = this.usersRepository.turnAdmin(targetUser);

    return user;
  }
}

export { TurnUserAdminUseCase };
