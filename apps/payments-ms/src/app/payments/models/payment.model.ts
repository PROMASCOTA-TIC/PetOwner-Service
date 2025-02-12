import { AllowNull, Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: 'PAYMENTS',
    timestamps: true,
    paranoid: true,
})
export class Payment extends Model{

    @Column({
        type: DataType.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        unique: true,
        field: 'ID'
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'ORDER_ID'
    })
    orderId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'PAYMENT_METHOD'
    })
    paymentMethod: string;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
        field: 'AMOUNT'
    })
    amount: number;

    @Column({
        type: DataType.CHAR(1),
        allowNull: false,
        defaultValue: 'P',
        field: 'STATUS'
    })
    status: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'PAYMENT_DATE'
    })
    paymentDate: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'COMMENT',
        defaultValue: ''
    })
    comment: String;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'VOUCHER'
    })
    voucherUrl: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'CREATED_AT'
    })
    createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'UPDATED_AT'
    })
    updatedAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        field: 'DELETED_AT'
    })
    deletedAt: Date;
}
