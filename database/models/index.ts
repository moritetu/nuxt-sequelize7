import {
  Sequelize,
  type HasManyCreateAssociationMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type Options,
} from "@sequelize/core";
import config from "../../config/config.json";
import {
  DataTypes,
  Model,
  type CreationOptional,
  type NonAttribute,
} from "@sequelize/core";
import {
  Attribute,
  HasMany,
  NotNull,
  Table,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  BeforeCreate,
  BeforeUpsert,
} from "@sequelize/core/decorators-legacy";
import type { SqliteDialect } from "@sequelize/sqlite3";
import bcrypt from "bcrypt";
const environment = process.env.NODE_ENV || "development";
const options = config[environment as keyof typeof config];
export const sequelize = new Sequelize({
  ...options,
} as Options<SqliteDialect>);

@Table({
  tableName: "Users",
  indexes: [{ fields: ["email"], unique: true }],
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Attribute(DataTypes.INTEGER.UNSIGNED)
  @PrimaryKey
  @AutoIncrement
  declare readonly id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare email: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare password: string;

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  @HasMany(() => Post, {
    foreignKey: "userId",
    inverse: {
      as: "author",
    },
  })
  declare posts?: NonAttribute<Post[]>;

  declare createPost: HasManyCreateAssociationMixin<Post, "userId">;

  @BeforeCreate
  static async hashPassword(instance: User) {
    const password = instance.getDataValue("password");
    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      instance.setDataValue("password", hashedPassword);
    }
  }
}

@Table({
  tableName: "Posts",
})
export class Post extends Model<
  InferAttributes<Post>,
  InferCreationAttributes<Post>
> {
  @Attribute(DataTypes.INTEGER.UNSIGNED)
  @PrimaryKey
  @AutoIncrement
  declare readonly id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare title: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare content: string;

  @Attribute({
    type: DataTypes.INTEGER.UNSIGNED,
    references: { table: "Users", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  declare userId: number;

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  /** Declared by {@link User#posts} */
  declare author?: NonAttribute<User>;
}

sequelize.addModels([Post, User]);
await sequelize.sync();

// 簡単のためここでテストデータを作成
const user = await User.findOne({
  where: { email: "admin@example.com" },
});
if (!user) {
  await User.create({
    name: "admin",
    email: "admin@example.com",
    password: "password",
  });
}
