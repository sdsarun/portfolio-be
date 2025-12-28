import { Prisma, Profile as PrismaProfileModel } from "../../../../../generated/prisma/client";
import { Profile, type ProfileAttributes } from "../../../../core/entities/profile/profile.entity";
import { type ProfileRepository } from "../../../../core/entities/profile/profile.repository";
import { type PrismaClientOrTransaction } from "../prisma-database-session";

export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prisma: PrismaClientOrTransaction) {}

  private readonly toEntity = (record: PrismaProfileModel): Profile => new Profile(record);

  async create(attributes: Partial<ProfileAttributes>): Promise<Profile> {
    const record = await this.prisma.profile.create({
      data: attributes as Prisma.ProfileUncheckedCreateInput
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Profile | null> {
    const record = await this.prisma.profile.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  async findByAuthId(authId: string): Promise<Profile | null> {
    const record = await this.prisma.profile.findUnique({ where: { authId } });
    return record ? this.toEntity(record) : null;
  }

  async updateById(id: string, attributes: Partial<ProfileAttributes>): Promise<Profile> {
    const record = await this.prisma.profile.update({
      where: { id },
      data: attributes as Prisma.ProfileUncheckedUpdateInput
    });
    return this.toEntity(record);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.profile.delete({ where: { id } });
  }

  async findAll(): Promise<Profile[]> {
    const records = await this.prisma.profile.findMany();
    return records.map(this.toEntity);
  }

  async upsert(attributes: Partial<ProfileAttributes>): Promise<Profile> {
    if (!attributes.id) {
      return this.create(attributes);
    }
    const { id, ...rest } = attributes as ProfileAttributes & { id: string };
    const record = await this.prisma.profile.upsert({
      where: { id },
      create: { id, ...(rest as Prisma.ProfileUncheckedCreateInput) },
      update: rest as Prisma.ProfileUncheckedUpdateInput
    });
    return this.toEntity(record);
  }
}
