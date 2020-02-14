import Bcrypt from 'bcryptjs'
import { IsEmail, Length } from 'class-validator'

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'users',
})
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({
    length: 80,
  })
  @Length(10, 80)
  public first_name: string

  @Column({
    length: 80,
  })
  @Length(10, 80)
  public last_name: string

  @Column({
    length: 100,
  })
  @Length(10, 100)
  @IsEmail()
  public email: string

  @Column({
    length: 100,
    nullable: true,
  })
  public company = ''

  @Column()
  public is_active: boolean

  @CreateDateColumn()
  public created_at: Date

  @UpdateDateColumn({ nullable: true })
  public updated_at?: Date

  @Column({
    length: 100,
    nullable: true,
  })
  @Length(10, 100)
  private password: string

  public hashPassword(password: string) {
    this.password = Bcrypt.hashSync(password, 8)
  }

  public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return Bcrypt.compareSync(unencryptedPassword, this.password)
  }
}
