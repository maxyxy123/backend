import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UserResponseDto } from 'src/auth/dto/create-auth.dto';
import bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email ?? 'Sai roi' },
    });

    if (existUser) throw new ConflictException('User have already exist');

    //hashpassord
    const salt = await bcrypt.genSalt(10);
    const hashpassord = await bcrypt.hash(createUserDto.passwordHash, salt);

    const createdUser = await this.prisma.user.create({
      data: {
        fullName: createUserDto.fullName,
        email: createUserDto.email,
        passwordHash: hashpassord,
      },
    });

    return new UserResponseDto({
      email: createdUser.email,
      fullName: createdUser.fullName,
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: { id: id },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { id: id },
    });
  }
}
