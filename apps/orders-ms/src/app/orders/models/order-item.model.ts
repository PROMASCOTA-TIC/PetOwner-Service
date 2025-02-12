import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Order } from "./order.model";

@Table({ 
    tableName: 'PURCHASE_ORDER_ITEM',
    paranoid: true,
})
export class OrderItem extends Model {
    @Column({
        type: DataType.STRING,
        primaryKey: true,
        allowNull: false,
        field: 'ORDER_ITEM_ID',
    })
    orderItemId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'ITEM_ID',
    })
    itemId: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'QUANTITY',
    })
    quantity: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
        field: 'PRICE',
    })
    price: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'STATUS',
        defaultValue: 0,
    })
    status: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'ENTREPRENEUR_ID',
    })
    entrepreneurId: string;

    @ForeignKey(() => Order)
    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'ID',
    })
    orderId: string;

    @BelongsTo(() => Order)
    order: Order;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'CREATED_AT',
        defaultValue: () => {
            const date = new Date(Date.now());
            date.setHours(date.getHours() - 5);
            return date;
        },
    })
    createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        field: 'UPDATED_AT',
        defaultValue: () => {
            const date = new Date(Date.now());
            date.setHours(date.getHours() - 5);
            return date;
        }
    })
    updatedAt?: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        field: 'DELETED_AT',
    })
    deletedAt?: Date;
}