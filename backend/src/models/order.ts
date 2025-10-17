import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

export type OrderStatus = "pending" | "completed" | "cancelled";

export interface OrderAttributes {
  id: string;
  customerName: string;
  item: string;
  quantity: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type OrderCreationAttributes = Optional<
  OrderAttributes,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;

export class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: string;
  public customerName!: string;
  public item!: string;
  public quantity!: number;
  public status!: OrderStatus;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date | null;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    customerName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "customer_name",
    },
    item: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "deleted_at",
    },
  },
  {
    sequelize,
    tableName: "orders",
    modelName: "Order",
    underscored: true,
    paranoid: true,
    timestamps: true,
  },
);

export default Order;
