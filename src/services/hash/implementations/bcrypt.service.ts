import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
import { HashService } from '../hash.service';

@Injectable()
export class BcryptService implements HashService {
  async hash(password: string, salt = 12): Promise<string> {
    return hash(password, salt);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
