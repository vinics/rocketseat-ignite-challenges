import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    // Complete usando query builder
    const result = await this.repository
      .createQueryBuilder('game')
      .where('LOWER(game.title) LIKE LOWER(:searchParam)', { searchParam: `%${param}%` })
      .getMany()

    return result
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const queryCountAllGames = 'SELECT COUNT(*) FROM games'
    return this.repository.query(queryCountAllGames); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    // Complete usando query builder
    const result = await this.repository
      .createQueryBuilder('game')
      .where('game.id = :id', { id: id })
      .leftJoinAndSelect('game.users', 'user')
      .getMany()

    return result[0].users;
  }
}
