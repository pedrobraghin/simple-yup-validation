export class UpdatePasswordDTO {
  constructor(
    public password: string,
    public passwordConfirm: string,
    public currentPassword: string
  ) {}
}
