import { envs } from "apps/orders-ms/src/config";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { OrderItem } from "./order-item.model";

@Table({
    tableName: 'PURCHASE_ORDER',
    paranoid: true,
    timestamps: false,
})
export class Order extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        primaryKey: true,
        field: 'ID',
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'USERID',
    })
    userId: string; // ID del usuario asociado a la orden

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'TOTAL_ITEMS',
    })
    totalItems: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
        field: 'TOTAL_AMOUNT',
    })
    totalAmount: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'STATUS',
        defaultValue: envs.orderInitialStatus || 0,
    })
    status: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        field: 'IS_ACTIVE',
        defaultValue: true,
    })
    isActive: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'PAYMENT_METHOD',
    })
    paymentMethod: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        field: 'IS_PAID',
        defaultValue: false,
    })
    isPaid: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        field: 'PAID_AT',
    })
    paidAt?: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'PAYMENT_COMMENT',
    })
    paymentComment: string;

    // Cuando sea true se debe consultar la BD para obtener el valor del envio y sumarlo al totalAmount o algo asi :v
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        field: 'HOME_DELIVERY',
        defaultValue: false,
    })
    homeDelivery: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'PET_OWNER_ADDRESS_ID',
    })
    petOwnerAddressId?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'PET_OWNER_ADDRESS',
    })
    petOwnerAddress?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'PET_OWNER_PHONE',
    })
    petOwnerPhone?: string;

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
        field: 'CANCELLED_AT',
    })
    canceledAt?: Date;

    @HasMany(() => OrderItem)
    orderItems: OrderItem[];
}
