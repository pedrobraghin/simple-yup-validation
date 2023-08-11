export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public createdAt: Date,
    public updatedAt: Date,
    public otpEnabled: boolean,
    public passwordHash: string,
    public verified: boolean,
    public tokenExpires: Date,
    public token: string | null
  ) {}
}
