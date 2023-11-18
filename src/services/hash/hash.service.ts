export abstract class HashService {
  abstract hash(password: string, salt?): Promise<string>;
  abstract compare(password: string, hashedPassword: string): Promise<boolean>;
}
